# @cloak-app/shopify

Shopify Storefront API client and related helpers.

- [View demo](https://cloak-shopify.netlify.app)
- [Edit CodeSandbox](https://githubbox.com/BKWLD/cloak-shopify)

## Install

1. Install with `yarn add @cloak-app/shopify`
2. Add to `nuxt.config` with `buildModules: ['@cloak-app/shopify']`


### Module Options

- `cloak.shopify:`
  - `url` - Your public Shopify store URL, for example: https://brand.myshopify.com or https://shop.brand.com.  Defaults to `process.env.SHOPIFY_URL`.
  - `storefront:`
    `token` - The Storefront API token of your custom app.  Defaults to `process.env.SHOPIFY_STOREFRONT_TOKEN`.
    `version` - The [Storefront API version](https://shopify.dev/api/usage/versioning) to use.  Defaults to `unstable` (aka, latest).

## Usage

### Inside of Nuxt app

The [`storefront` Nuxt plugin](./plugins/storefront.js) injects `$storefront` globally.  This is an Axios instance with it's `baseUrl` set to `cloak.shopify.endpoint`.  In addition, you can call:

- `$storefront.execute({ query, variables })` - Executes a GraphQL request that automatically adds a `site` GraphQL variable with the value from the `cloak.craft.site` value.

### Inside of Nuxt module

You can use the `makeModuleStorefrontClient()` factory method within a Nuxt module to build a `$storefront` instance.  In a module, we can't use the instance that is injected by the `storefront-client` plugin because that is constructed later in the lifecycle.

```js
// A Nuxt module
import { makeModuleStorefrontClient } from '@cloak-app/shopify/factories'
export default function() {
  const $storefront = makeModuleStorefrontClient(this)
}
```

### Outside of Nuxt

You can make an instance of the Storefront Axios client when outside of Nuxt (like in a Shopify JS entry point) as follows:

```js
import { makeStorefrontClient } from '@cloak-app/shopify/factories'
const storefront = makeStorefrontClient({
  url: process.env.SHOPIFY_URL,
  token: process.env.SHOPIFY_STOREFRONT_TOKEN,
})

// Optional, inject it globally into Vue components
import Vue from 'vue'
Vue.prototype.$storefront = storefront
```

## Contributing

Run `yarn dev` to open a Nuxt dev build of [the demo directory](./demo).
