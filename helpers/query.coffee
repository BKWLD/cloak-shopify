###
Helpers related to executed Storefront API queries.  These are expected to
be invoked as a result to how they are mixed into the storefront client
by factories/index.js
###
import fetchQuery from '../queries/fetch.gql'
import createQuery from '../queries/create.gql'
import addQuery from '../queries/add.gql'
import updateQuery from '../queries/update.gql'
import deleteQuery from '../queries/delete.gql'
import discountsQuery from '../queries/discounts.gql'
import linkCustomerQuery from '../queries/link-customer.gql'
import productQuery from '../queries/product.gql'
import productFragment from '../queries/fragments/product.gql'

# Throw errors if found in the response, else map the checkout object
handleCheckoutMutation = ({ mutation: response }) ->
	if response.userErrors?.length
	then throw JSON.stringify response.userErrors
	return response.cart

# Lookup a checkout
export fetch = ({ execute }, id) ->
	{ cart } = await execute
		query: fetchQuery
		variables: { id }
	return cart

# Create a new checkout
export create = ({ execute }) ->
	handleCheckoutMutation await execute
		query: createQuery
		variables: input: {}

# Add an item to the checkout
export addVariant = ({ execute }, {
	cartId, variantId, quantity, sellingPlanId, attributes
}) ->
	addVariants {
		cartId
		variantIds: [ variantId ]
		quantity
		sellingPlanId
		attributes
	}

# Add multiple items to the checkout with the same attributes
export addVariants = ({ execute }, {
	cartId, variantIds, quantity, sellingPlanId, attributes = {}
}) ->
	handleCheckoutMutation await execute
		query: addQuery
		variables:
			cartId: cartId
			lines: variantIds.map (variantId) -> {
				merchandiseId: variantId
				quantity
				sellingPlanId
				attributes: { key, value } for key, value of attributes
			}

# Update multiple line items
export updateLines = ({ execute }, {
	cartId, lineIds, quantity, sellingPlanId
}) ->
	handleCheckoutMutation await execute
		query: updateQuery
		variables:
			cartId: cartId
			lines: lineIds.map (lineId) ->
				id: lineId
				quantity: quantity
				sellingPlanId: sellingPlanId

# Delete multiple line items
export deleteLines = ({ execute }, { cartId, lineIds }) ->
	handleCheckoutMutation await execute
		query: deleteQuery
		variables:
			cartId: cartId
			lines: lineIds

# Update discount codes
export updateDiscounts = ({ execute }, { cartId, codes }) ->
	handleCheckoutMutation await execute
		query: discountsQuery
		variables:
			cartId: cartId
			discountCodes: codes

# Associate a customer with the cart
export linkCustomer = ({ execute }, { cartId, accessToken }) ->
	handleCheckoutMutation await execute
		query: linkCustomerQuery
		variables:
			cartId: cartId
			buyerIdentity: customerAccessToken: accessToken

# Get product data for a PDP
export getProductDetail = ({ execute }, handle) ->
	{ product } = await execute
		variables: { handle, pdp: true }
		query: productQuery
	return product

# Helper to look up product card data from their handles by querying the
# productByHandle method multiple times
export getProductCards = ({ execute }, handles) ->
	return [] unless handles?.length

	# Make the list of queries
	productQueries = handles.map (handle, index) -> """
		product_#{index}: productByHandle(handle:"#{handle}") {
			...product
		}
	"""

	# Assemble full query
	query = """
		query getProductCards {
			#{productQueries.join("\n")}
		}
		#{productFragment}
	"""

	# Execute the query and return only valid products
	products = await execute { query }

	# Nullcheck because result is `undefined` if no product hits
	return [] if !products? || typeof products != 'object'
	return onlyPublishedProducts Object.values products

# Return only products with URLs, aka, those that have been published to the
# online store. This only works on production because the URL value is null
# while the site is password protected.
# https://community.shopify.com/c/Shopify-APIs-SDKs/Product-onlineStoreUrl/m-p/572566/highlight/true#M38272
export onlyPublishedProducts = (products) ->
	products.filter (product) ->
		if process.env.APP_ENV == 'prod'
		then !!product?.onlineStoreUrl
		else !!product
