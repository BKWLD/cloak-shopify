// Nuxt config
export default {

	// Load boilerplate and this package's module
	buildModules: [
		'@cloak-app/boilerplate',
		'@cloak-app/demo-theme',
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

	},

	// @nuxt/content can't be loaded from module
	modules: ['@nuxt/content'],
}
