import atob from 'atob-lite'

// Get the id from a Shopify gid:// style id.  This strips everything but the
// last part of the string.  So gid://shopify/ProductVariant/34641879105581
// becomes 34641879105581
// https://regex101.com/r/3FIplL/3
export function getShopifyId(id) {

	// Already a simple ID
	if (String(id).match(/^\d+$/)) return id

	// De-base64.  This should only be required when migrating cart ids that were
	// stored in a cookie, AKA client-side pre Storefront API version 2022-07.
	if (!id.match(/^gid:\/\//)) id = atob(id)

	// Return the ID
	const matches = id.match(/\/([^\/?]+)(?:\?.+)?$/)
	if (matches) return matches[1]
}

// Format a string or number like money, using vue-i18n if it's installed
// or falling back to USD
export function formatMoney(val) {
	if (this && this.$n) return this.$n(val, 'currency')
	return parseFloat(val)
		.toLocaleString(process.env.LOCALE_CODE || 'en-US', {
			style: 'currency',
			currency: process.env.CURRENCY_CODE || 'USD'
		})
}
