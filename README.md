# @cloak-app/shopify

Shopify Storefront API client and related helpers.

- [View demo](https://cloak-shopify.netlify.app)
- [Edit CodeSandbox](https://githubbox.com/BKWLD/cloak-shopify)

## Install

1. Install with `yarn add @cloak-app/shopify`
2. Add to `nuxt.config` with `buildModules: ['@cloak-app/shopify']`

### Module Options

Set these properties within `cloak: { shopify: { ... } }` in the nuxt.config.js:

- `url` - Your public Shopify store URL, for example: https://brand.myshopify.com or https://shop.brand.com.  Defaults to `process.env.SHOPIFY_URL`.
- `storefront:`
  - `token` - The Storefront API token of your custom app.  Defaults to `process.env.SHOPIFY_STOREFRONT_TOKEN`.
  - `language` - A Storefront API recognized [LanguageCode](https://shopify.dev/api/storefront/2022-10/enums/LanguageCode).  Defaults to the 1st part of `process.env.CMS_SITE` if it is ISO-like (ex: if `en_US` or `en-US` then `EN`).
  - `country` - A Storefront API recognized [CountryCode](https://shopify.dev/api/storefront/2022-10/enums/CountryCode).  Defaults to the 2nd part of `process.env.CMS_SITE` if it is ISO-like (ex: if `en_US` or `en-US` then `US`).
  - `injectClient` - Boolean for whether to inject the `$storefront` client globally.  Defaults to `true`.  You would set this to `false` when this module is a depedency of another module (like [@cloak-app/algolia](https://github.com/BKWLD/cloak-algolia)) that is creating `$storefront` a different way.
- `mocks` - An array of objects for use with [`mockAxiosGql`](https://github.com/BKWLD/cloak-utils/blob/main/src/axios.js).

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
import mergeClientHelpers from '@cloak-app/shopify/factories/merge-helpers'
const storefront = mergeClientHelpers(makeStorefrontClient({
  url: process.env.SHOPIFY_URL,
  token: process.env.SHOPIFY_STOREFRONT_TOKEN,
}))

// Optional, inject it globally into Vue components
import Vue from 'vue'
Vue.prototype.$storefront = storefront
```

## Contributing

Run `yarn dev` to open a Nuxt dev build of [the demo directory](./demo).
