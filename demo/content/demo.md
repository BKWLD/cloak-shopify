# [@cloak-app/shopify](https://github.com/BKWLD/cloak-shopify)

## PDP Example

Check out this [example PDP](/products/clay-plant-pot) using live data from a demo Shopify store.

## Mocking Example

This is an example of using the `mocks` option to return mocked data.

<mocks-demo></mocks-demo>

```vue
<template lang='pug'>

ul: li(v-for='product in products')
  | {{ product.title }}

</template>

<script lang='coffee'>
import productFragment from '../../queries/fragments/product.gql'
export default

  data: -> products: []

  fetch: -> { @products } = await @$storefront.execute query: '''
    query getSomeProducts {
      products(first: 5) {
        edges {
          node { ...product }
        }
      }
    }
  ''' + productFragment

</script>
```

## Merge Example

This uses live Shopify data and the `$mergeShopifyProductCards` helper to simulate merging Shopify data into an array of product data from another source, like Craft.

<merge-demo></merge-demo>

```vue
<template lang='pug'>

ul: li(v-for='product in products')
  | {{ product.title }}

</template>

<script lang='coffee'>
export default

  data: -> products: []

  fetch: -> @products = await @$mergeShopifyProductCards [
    { slug: 'clay-plant-pot' }
    { slug: 'copper-light' }
  ]

</script>
```
