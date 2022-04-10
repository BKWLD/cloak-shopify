// Nuxt config
export default {

	// Load boilerplate and this package's module
	buildModules: [
		'@cloak-app/boilerplate',
		'@cloak-app/demo-theme',
		'../nuxt',
	],

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
