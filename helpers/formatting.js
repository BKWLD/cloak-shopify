// Get the id from a Shoify gid:// style id.  This strips everything but the
// last part of the string.  So gid://shopify/ProductVariant/34641879105581
// becomes 34641879105581
export var getShopifyId = function(id) {
	const matches = id.match(/\/(\w+)$/)
	if (matches) return matches[1]
}
