import { makeModuleCraftClient } from '@cloak-app/craft/factories'
import { makeModuleStorefrontClient } from '../factories'
import { getShopifyId } from '../helpers/formatting'
import consola from 'consola'

// Add URLs to variant pages to the SSGed list
export default function() {

	// Hook to extend routes
	this.nuxt.hook('generate:extendRoutes', async(routes) => {
		consola.info('Adding variant routes')

		// Make clients
		const $craft = makeModuleCraftClient(this),
			$storefront = makeModuleStorefrontClient(this)

		// Get all the variant routes
		const variantRoutes = await buildVariantRoutes({
			$craft, $storefront
		}, routes)

		// Append the variant routes to the routes, has to be done in place
		for (const route of variantRoutes) {
			routes.push(route)
			this.nuxt.options.sitemap?.routes.push(route)
		}
		consola.success('Added variant routes');
	})
}

// Add variants to the routes
async function buildVariantRoutes({ $craft, $storefront }, routes) {
	const variantRoutes = []

	// Get all products
	const products = await $craft.getEntries({ query: `
		query getProductsForSsgVariants ($site:[String]) {
			entries(
				site:    $site
				section: "products"
			) {
				slug
				uri
			}
		}`
	})

	// Build list of variant routes
	for (const product of products) {

		// Get all of the variant ids of this product from Shopify
		const { product: shopifyProduct } = await $storefront.execute({ query:
			`query getProductVariantsForSsgVariants {
				product: productByHandle(handle: "${product.slug}") {
					variants(first:100) {
						edges {
							node { id }
						}
					}
				}
			}`
		})

		// If no Shopify product, remove route for the product
		if (!shopifyProduct) {
			const index = routes.findIndex(route => route.route == `/${product.uri}`)
			if (index >= 0) routes.splice(index, 1)
			console.warn(`Shopify product not found for ${product.slug}`)
			continue
		}

		// Push new route objects onto the stack
		for (const variant of shopifyProduct.variants) {
			variantRoutes.push({
				route: `/${product.uri}/${getShopifyId(variant.id)}`
			})
		}
	}

	// Return the updated list of routes
	return variantRoutes
};
