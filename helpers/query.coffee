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
	cartId, variantId, quantity, sellingPlanId
}) ->
	handleCheckoutMutation await execute
		query: addQuery
		variables:
			cartId: cartId
			lines: [
				merchandiseId: variantId
				quantity: quantity
				sellingPlanId: sellingPlanId
			]

# Add multiple items to the checkout with the same attributes
export addVariants = ({ execute }, {
	cartId, variantIds, quantity, attributes = {}
}) ->
	handleCheckoutMutation await execute
		query: addQuery
		variables:
			cartId: cartId
			lines: variantIds.map (variantId) ->
				merchandiseId: variantId
				quantity: quantity
				attributes: { key, value } for key, value of attributes

# Update a line item
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

# Update a line item
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
