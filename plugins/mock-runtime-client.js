/*
 * Mock runtime Storefront instances. Using explicit import so we don't try to
 * load Node deps
 */
import { mockAxiosGql } from '@cloak-app/utils/src/axios'
export default function({ $config, $storefront }) {
	mockAxiosGql($storefront, $config.cloak.storefront.mocks)
}
