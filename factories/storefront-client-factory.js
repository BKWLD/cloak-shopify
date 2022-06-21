import mapValues from 'lodash/mapValues'
import isPlainObject from 'lodash/isPlainObject'

// Factory method for making Storefront Axios clients
export default function (axios, {
	url,
	token,
	version = '2022-04',
	language,
	country,
} = {}) {

	// Make Storefront instance
	const storefront = axios.create({
		baseURL: `${url}/api/${version}/graphql`,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': token,
		},
	})

	// Store configuration on the object, for reading out externally (or mutating)
	storefront.language = language
	storefront.country = country

	// Add execute helper for running gql queries
	storefront.execute = async payload => {

		// Massage the payload
		const { language, country } = storefront
		payload = setInContext(payload, { language, country })

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

// Make a custom error object
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

// Send language and country on all requests if specified, for use with
// @inContext directive. Casting falsey values to null because Shopify errors
// on empty strings.
export function setInContext(payload, { language, country }) {
	return {
		...payload,
		variables: {
			language: language || null,
			country: country || null,
			...(payload.variables || {})
		}
	}
}

// Recurse through an object and flatten eddge/node levels
function flattenEdges(obj) {

	// If an array, act on all members
	if (Array.isArray(obj)) return obj.map(flattenEdges)

	// If not an object, return self
	if (!isPlainObject(obj)) return obj

	// Loop through object properties
	return mapValues(obj, val => {

		// If there is an "edges" child, flatten it's contents
		if (val && val.edges) {
			val = val.edges.map(edge => edge.node)
		}

		// Recurse deeper
		return flattenEdges(val)
	})
}
