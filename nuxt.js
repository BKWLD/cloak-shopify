import { join } from 'path'
import { requireOnce, setPublicDefaultOptions } from '@cloak-app/utils'
export default function() {

	// Have Nuxt transpile resources
	this.options.build.transpile.push('@cloak-app/shopify')

	// Set default options
	setPublicDefaultOptions(this, 'shopify', {
		url: process.env.SHOPIFY_URL,
		storefront: {
			token: process.env.SHOPIFY_STOREFRONT_TOKEN,
			version: 'unstable',
		}
	})

	// Add Axios module at the end so it can be used in the plugin
	this.nuxt.hook('modules:done', moduleContainer => {
		requireOnce(moduleContainer, '@nuxtjs/axios')
	})

	// Add the Storefront plugin which creates the Storefront instance of Axios.
	// Not using this.addPlugin so I don't have to deal with adding sub-imports
	// via addTemplate.
	this.options.plugins.unshift(join(__dirname, 'plugins/storefront-client.js'))
}

// Required for published modules
module.exports.meta = require('./package.json')
