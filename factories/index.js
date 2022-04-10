import makeStorefrontClient from './storefront-client-factory'
import * as queryHelpers from '../helpers/query'
export default {

	// Export client factory function that automatically applies query helpers
	// to the client. This was done so that the main makeStorefrontClient doesn't
	// depend on importing gql files and, thus, can be directly imported into
	// places (like Netlify functions) that don't route through webpack.
	makeStorefrontClient(axios, options) {
		const client = makeStorefrontClient(axios, options)

		// Loop through query helpers and register them on the client, passing the
		// axios client in as the first argument
		for (name in queryHelpers) {
			client[name] = (...args) => {
				return queryHelpers[name].apply(null, [client, ...args])
			}
		}

		// Return the final client
		return client
	}
}
