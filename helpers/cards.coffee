###
Helpers related to mering Shopify product data into other product objects by
slug. Intended use case is when we get product listing info from Craft, designed
for rendering in cards.
###
import memoize from 'lodash/memoize'
import { getShopifyId } from './formatting'
import getProduct from '../queries/product.gql'

# Take an array of Craft product entries and merge Shopify data with them. This
# preserves the original order of the products.
export mergeShopifyProductCards = ({ execute }, products) ->
	return [] unless products.length

	# Get Shopify and bundle data for products. If Shopify data isn't found,
	# an exception is thrown, which we catch and use to remove that product
	# from the listing.
	products = await Promise.all products.map (product) ->
		try await mergeShopifyProductCard { execute }, product
		catch error then console.warn error

	# Remove all empty products (those that errored while getting data)
	return products.filter (val) -> !!val

# Merge Shopify data into a single card
export mergeShopifyProductCard = memoize ({ execute }, product) ->
	return unless product

	# Merge Shopify data into the product object
	shopifyProduct = await getShopifyProductByHandle { execute }, product.slug
	product = { ...product, ...shopifyProduct }

	# Remove keys not needed for cards
	delete product.description

	# Return the final product
	return product

# Use the slug as the memoize resolver
, (deps, product) -> product?.slug

# Get the Shopify product data given a Shopify product handle
getShopifyProductByHandle = ({ execute }, productHandle) ->

	# Query Storefront API
	{ product } = await execute
		query: getProduct
		variables: handle: productHandle
	unless product then throw "No Shopify product found for #{productHandle}"

	# Add URLs to each variant for easier iteration later
	product.variants = product.variants.map (variant) =>
		variantIdNum = getShopifyId variant.id
		url = "/products/#{productHandle}/#{variantIdNum}"
		return { ...variant, url }

	# Return the product
	return product
