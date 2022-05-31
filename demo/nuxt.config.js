// Mock stubs
import someProducts from './stubs/some-products.json'
import productsForSsgVariants from './stubs/products-for-ssg-variants.json'
import productVariantsForSsgVariants from './stubs/product-variants-for-ssg-variants.json'

// Nuxt config
export default {

	// Load boilerplate and this package's module
	buildModules: [
		'@cloak-app/boilerplate',
		'@cloak-app/demo-theme',
		'@cloak-app/craft',
		'../nuxt',
	],

	// Generate the demo PDP route
	generate: {
		routes: ['/products/clay-plant-pot']
	},

	// Cloak settings
	cloak: {

		// Boilerplate settings
		boilerplate: {
			siteName: '@cloak-app/shopify demo',
		},

		// Mock Storefront queries
		shopify: {
			mocks: [
				{
					query: 'getSomeProducts',
					response: someProducts,
				},
				{
					query: 'getProductVariantsForSsgVariants',
					response: productVariantsForSsgVariants
				},
			],
		},

		// Mock Craft queries
		craft: {
			mocks: [
				{
					query: 'getProductsForSsgVariants',
					response: productsForSsgVariants
				}
			]
		}

	},

	// @nuxt/content can't be loaded from module
	modules: ['@nuxt/content'],
}
