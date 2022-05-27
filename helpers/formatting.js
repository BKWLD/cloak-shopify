// Get the id from a Shopify gid:// style id.  This strips everything but the
// last part of the string.  So gid://shopify/ProductVariant/34641879105581
// becomes 34641879105581
// https://regex101.com/r/3FIplL/3
export function getShopifyId(id) {

	// Already a simple ID
	if (String(id).match(/^\d+$/)) return id

	// Return the ID
	const matches = id.match(/\/([^\/?]+)(?:\?.+)?$/)
	if (matches) return matches[1]
}
