/**
 * Create the Storefront axios client instance
 */
import { makeStorefrontClient } from '../factories'
import mergeClientHelpers from '../factories/merge-helpers'
import * as cardsHelpers from '../helpers/cards'
export default function({ $axios, $config }, inject) {

	// Make the instance
	const $storefront = mergeClientHelpers(makeStorefrontClient({
		axios: $axios,
		url: $config.cloak.shopify.url,
		...$config.cloak.shopify.storefront,
	}))

	// Inject the final Storefront object
	inject('storefront', $storefront)

	// Inject merge helpers, which rely on the storefront object
	Object.entries(cardsHelpers).forEach(([methodName, method]) => {
		inject(methodName, (...args) => {
			return method.apply(null, [$storefront, ...args])
		})
	})
}
