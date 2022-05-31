/**
 * Inject helpers
 */
import * as helpers from '../helpers'
export default function ({ }, inject) {

	// Not binding to context because it makes Vuei18n methods inaccessible
	for (const [name, helper] of Object.entries(helpers)) {
		inject(name, helper)
	}
}
