/**
 * Create the Storefront axios client instance
 */
import { makeStorefrontClient } from '../factories'
import * as mergeHelpers from '../helpers/merge'
import * as queryHelpers from '../helpers/query'
export default function({ $axios, $config }, inject) {

	// Make the instance
	const $storefront = makeStorefrontClient({
		axios: $axios,
		url: $config.cloak.shopify.url,
		...$config.cloak.shopify.storefront,
	})

	// Loop through query helpers and register them on the client, passing the
	// axios client in as the first argument.  This happens in this plugin
	// rather than in the factory so we can transpile the gql used by the
	// query helpers.
	Object.entries(queryHelpers).forEach(([methodName, method]) => {
		$storefront[methodName] = (...args) => {
			return method.apply(null, [$storefront, ...args])
		}
	})

	// Injeect the final Storefront object
	inject('storefront', $storefront)

	// Inject merge helpers, which rely on the storefront object
	Object.entries(mergeHelpers).forEach(([methodName, method]) => {
		inject(methodName, (...args) => {
			return method.apply(null, [$storefront, ...args])
		})
	})
}
