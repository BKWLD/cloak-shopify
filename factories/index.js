import makeClient from './storefront-client-factory'
import axios from 'axios'

// Used passed in Axios instance or fallback to a node_modules instance.  The
// latter may be used when creating a client from another @cloak-app module.
export function makeStorefrontClient(settings = {}) {
	return makeClient(settings.axios || axios, settings)
}

// Helper to make a client when in the context of a Nuxt module,
// supporting the optional persence of a mock.  This is necessary because,
// when a module runs, the injected plugin instance isn't ready yet.
export function makeModuleStorefrontClient(moduleContainer) {
	const shopifyOptions = moduleContainer.options.cloak?.shopify || {}
	return moduleContainer.options.storefrontMock ||
		makeStorefrontClient({
			url: shopifyOptions.url,
			...shopifyOptions.storefront,
		})
}
