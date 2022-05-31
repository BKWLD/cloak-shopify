import { join } from 'path'
import { requireOnce, setPublicDefaultOptions } from '@cloak-app/utils'
export default function() {

	// Have Nuxt transpile resources
	this.options.build.transpile.push('@cloak-app/shopify')

	// Detect the lanaguge and country code from the CMS_SITE ENV
	// https://regex101.com/r/ozRGpF/1
	const matches = process.env.CMS_SITE?.match(/(\w{2})(?:-|_)(\w{2})/),
		language = matches?.[1].toUpperCase(),
		country = matches?.[2].toUpperCase()

	// Set default options
	setPublicDefaultOptions(this, 'shopify', {
		url: process.env.SHOPIFY_URL,
		storefront: {
			token: process.env.SHOPIFY_STOREFRONT_TOKEN,
			version: '2022-04',
			language,
			country,
			injectClient: true,
		},
		mocks: [],
	})

	// Add Axios module at the end so it can be used in the plugin
	this.nuxt.hook('modules:done', moduleContainer => {
		requireOnce(moduleContainer, '@nuxtjs/axios')
	})

	// Add the Storefront plugin which creates the Storefront instance of Axios.
	// Not using this.addPlugin so I don't have to deal with adding sub-imports
	// via addTemplate.
	if (this.options.cloak.shopify.storefront.injectClient) {
		const clientPluginPath = join(__dirname, 'plugins/storefront-client.js')
		this.options.plugins.unshift(clientPluginPath)
	}

	// Support mocking
	requireOnce(this, join(__dirname, './modules/mock-storefront.js'))

	// Add ssg-variants module if @cloak-app/craft is used
	if ([
		...this.options.modules,
		...this.options.buildModules,
	].includes('@cloak-app/craft')) {
		requireOnce(this, join(__dirname, './modules/ssg-variants.js'))
	}

	// Add helpers
	this.options.plugins.unshift(join(__dirname, 'plugins/helpers.js'))

}

// Required for published modules
module.exports.meta = require('./package.json')
