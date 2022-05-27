<!-- Demo using mocks -->

<template lang='pug'>

ul.merge-demo: li(v-for='product in products')
	| {{ product.title }}

</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>
export default

	data: -> products: []

	fetch: ->
		@products = await @$mergeShopifyProductCards [
			{ slug: 'clay-plant-pot' }
			{ slug: 'copper-light' }
		]

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

.merge-demo
	border 1px dashed currentColor
	padding 1em
	list-style disc

li
	margin-left 1em
	margin-v .25em

</style>
