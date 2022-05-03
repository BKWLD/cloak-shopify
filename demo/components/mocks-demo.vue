<!-- Demo using mocks -->

<template lang='pug'>

ul.mocks-demo: li(v-for='product in products')
	| {{ product.title }}

</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>
import productFragment from '../../queries/fragments/product.gql'
export default

	data: -> products: []

	fetch: ->
		{ @products } = await @$storefront.execute query: '''
			query getSomeProducts {
				products(first: 5) {
					edges {
						node { ...product }
					}
				}
			}
		''' + productFragment

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

.mocks-demo
	border 1px dashed currentColor
	padding 1em
	list-style disc

li
	margin-left 1em
	margin-v .25em

</style>
