/**
 * Create the Storefront axios client instance
 */
import { makeStorefrontClient } from '../factories'
export default function({ $axios, $config }, inject) {
	inject('storefront', makeStorefrontClient($axios, {
		url: $config.cloak.shopify.url,
		...$config.cloak.shopify.storefront,
	}))
}
