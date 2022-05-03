/*
 * Add support for Mocking the Craft instance
 */
import { join } from 'path'
import { makeModuleStorefrontClient } from '../factories'
import { mockAxiosGql } from '@cloak-app/utils'
export default function() {

	// Abort unless the mock options have been set
	const { mocks } = this.options.cloak.shopify
	if (!mocks.length) return

	// Make the Storefont mock and store it on options for use by
	// makeModuleCraftClient()
	const $storefront = makeModuleStorefrontClient(this)
	mockAxiosGql($storefront, mocks, { passthrough: true })
	this.options.storefrontMock = $storefront

	// Mock runtime Storefont instances, adding after storefront-client
	const mockPlugin = join(__dirname, '../plugins/mock-runtime-client.js')
	this.options.plugins.push(mockPlugin)
}
