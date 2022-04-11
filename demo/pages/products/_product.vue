<!-- Minimal example of a PDP -->

<template lang='pug'>

.product
	h1 @cloak-app/shopify

	h2 PDP Demo of "{{ product.title }}"
	.wysiwyg(v-html='product.description')
	ul
		li id: <code>{{ product.id }}</code>

	h3 Variants
	ul: li(v-for='variant in product.variants' :key='variant.id')
		| {{ variant.title }}
		button Add to Cart

	h3 Cart

</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>
export default

	# Get Shopify data of test product
	asyncData: ({ params, $storefront, $notFound }) ->
		product = await $storefront.getProductDetail params.product
		return $notFound() unless product
		return { product }

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

li:not(:first-child)
	margin-top 1em

button
	border 1px solid currentColor
	padding 0.25em
	font-size 0.75em
	margin-left 1em
	border-radius 0.25em

</style>
