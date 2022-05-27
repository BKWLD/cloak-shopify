import * as queryHelpers from '../helpers/query'

/**
 * Merge query query helpers into the storefront object. This is done from
 * a different file from the other factory files because it results in loading
 * gql files that will require transpiling. And we want to make the base
 * Storefront client to be useable without transpiling.
 */
export default function ($storefront) {
	Object.entries(queryHelpers).forEach(([methodName, method]) => {
		$storefront[methodName] = (...args) => {
			return method.apply(null, [$storefront, ...args])
		}
	})

	// Return $storefront so this can wrap Storefront factory
	return $storefront
}
