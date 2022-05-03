import makeClient from './storefront-client-factory'
import axios from 'axios'
import * as queryHelpers from '../helpers/query'

// Export client factory function that automatically applies query helpers
// to the client. This was done so that the main makeStorefrontClient doesn't
// depend on importing gql files and, thus, can be directly imported into
// places (like Netlify functions) that don't route through webpack.
export function makeStorefrontClient(settings = {}) {
	const client = makeClient(settings.axios || axios, settings)

	// Loop through query helpers and register them on the client, passing the
	// axios client in as the first argument
	Object.entries(queryHelpers).forEach(([methodName, method]) => {
		client[methodName] = (...args) => {
			return method.apply(null, [client, ...args])
		}
	})

	// Return the final client
	return client
}
