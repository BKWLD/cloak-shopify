# Get the id from a Shoify gid:// style id.  This strips everything but the
# last part of the string.  So gid://shopify/ProductVariant/34641879105581
# becomes 34641879105581
export getShopifyId = (id) -> id.match(/\/(\w+)$/)?[1]
