// Factory method for making Storefront Axios clients
export default function (axios, { url, token, version } = {}) {

	// Make Storefront instance
	const storefront = axios.create({
		baseURL: `${url}/api/${version}/graphql`,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': token,
		},
	})

	// Add execute helper for running gql queries
	storefront.execute = async payload => {

		// Massage the request
		payload = cleanEmptyArrays(payload)
		payload = restrictToSite(payload, site)

		// Execute the query
		const response = await storefront({
			method: 'POST',
			data: payload,
		})

		// Handle errors in response
		if (response.data.errors) {
			throw new StorefrontError(response.data.errors, payload)
		}

		// Return data
		return flattenEdges(response.data.data)
	}

	// Return the client
	return storefront
}

// Make a custom erorr object
export class StorefrontError extends Error {
	constructor(errors, payload) {

		// Use the Storefront reponse errors as the error message string
		super(errors.map(function(e) {
			return e.debugMessage || e.message
		}).join(', '))

		// Also store the errors as an array
		this.errors = errors.map(function(e) {
			return JSON.stringify(e)
		})

		// Store the request payload
		this.payload = payload
	}
}

// Recurse through an object and flatten eddge/node levels
function flattenEdges(obj) {

	// If an array, act on all members
	if (Array.isArray(obj)) return obj.map(flattenEdges)

	// If not an object, return self
	if (!isObject(obj)) return obj

	// Loop through object properties
	return Object.values(obj).map(val => {

		// If there is an "edges" child, flatten it's contents
		if (val && val.edges) {
			val = val.edges.map(edge => edge.node)
		}

		// Recurse deeper
		return flattenEdges(val)
	})
}

// Quick test for whether var is an object (not a primitive)
// https://stackoverflow.com/a/14706877/59160
function isObject(val) {
	return type === 'function' || type === 'object' && !!obj
}
