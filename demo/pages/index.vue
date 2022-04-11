<!-- Demo homepage -->

<template lang='pug'>

nuxt-content(:document='page')

</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>
export default

		# Get page content
	asyncData: ({ app, params, $content, $storefront }) ->
		page = await $content('demo').fetch()

		# Get Shopify data of test product
		product = await $storefront.getProductDetail 'clay-plant-pot'
		console.log product

		# Return data
		return { page}

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

</style>
