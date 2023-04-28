import { cookie } from 'library/helpers/storage'
import { CART_ID_KEY, CART_COUNT_KEY } from 'library/helpers/constants'

# Lookup the cart from cookies
export getCart = ->

	# Lookup or make the checkout
	cart = if cartId = cookie.get CART_ID_KEY
	then await @$storefront.fetch cartId
	cart = await @$storefront.create() unless cart

	# Update the cookie exiration
	# https://regex101.com/r/fVhyob/1/
	cookie.set CART_ID_KEY, cart.id, expires: 14 # Days

	# Return the cart
	return cart

# Stores the Shopify cart state
# https://shopify.dev/docs/ajax-api/reference/cart#get-cart-js
export state = ->

	# Default values for Shopify properties we consume
	id: null
	lines: []
	cost:
		subtotalAmount: amount: 0
		totalAmount: amount: 0
		totalTaxAmount: amount: 0
	discountCodes: []
	buyerIdentity: customer: id: null
	checkoutUrl: '' # The checkout URL

	# App-specific cart values
	hydrated: false # Whether we've fetched the cart yet

export getters =

	# Getter methods that be overriden at the project level for adding project
	# specific code.
	lines: (state) -> state.lines
	checkoutUrl: (state) -> state.checkoutUrl

	# Helper for accessing totals
	subtotal: (state) -> state.cost.subtotalAmount.amount
	total: (state) -> state.cost.totalAmount.amount
	tax: (state) -> state.cost.totalTaxAmount?.amount || 0

	# Get the quantity of items in the cart
	itemCount: (state, getters) ->
		unless state.hydrated then return cookie.get(CART_COUNT_KEY) || 0
		getters.lines.reduce (sum, line) ->
			sum + line.quantity
		, 0

	# Determine if the cart contains a subscription
	hasSubscription: (state) ->
		!!state.lines.find (line) -> !!line.sellingPlanAllocation

	# Determine if the cart contains one time purchases
	hasNonSubscription: (state) ->
		!!state.lines.find (line) -> !line.sellingPlanAllocation

export mutations =

	# Replace the current cart with the new one
	replace: (state, cart) -> Object.assign state, cart

	# Mark has hydrated
	isHydrated: (state) -> state.hydrated = true

export actions =

	# Add an item to the cart
	addItem: (
		{ state, dispatch, commit },
		{ id: variantId, quantity = 1, sellingPlanId }
	) ->
		try
			await dispatch 'fetchUnlessHydrated'
			cart = await @$storefront.addVariant
				cartId: state.id
				variantId: variantId
				quantity: parseInt quantity
				sellingPlanId: sellingPlanId
			commit 'replace', cart
		catch e then console.error e

	# Change an item's quantity. If the quantity is 0, delete the line. Auto
	# close the cart if the total items equals 0.
	updateLine: (
		{ state, dispatch, commit, getters },
		{ quantity, id: lineId, sellingPlanId }
	) ->
		try
			await dispatch 'fetchUnlessHydrated'

			# Change the quantity
			if quantity > 0
			then cart = await @$storefront.updateLines
				cartId: state.id
				lineIds: [ lineId ]
				quantity: parseInt quantity
				sellingPlanId: sellingPlanId

			# Or remove quantity if new value would be 0
			else cart = await @$storefront.deleteLines
				cartId: state.id
				lineIds: [ lineId ]

			# Update the cart and close it if empty
			commit 'replace', cart
			commit 'close' if getters.itemCount == 0
		catch e then console.error e

	# Fetch the current cart status or start a new cart
	fetch: ({ commit, state }) ->
		try cart = await getCart.call this
		catch e
			cookie.remove CART_ID_KEY
			cart = await getCart.call this
		commit 'replace', cart
		commit 'isHydrated' unless state.hydrated

	# Fetch the cart unless it is already hydrated
	fetchUnlessHydrated: ({ state, dispatch }) ->
		return if state.hydrated
		dispatch 'fetch'

	# Apply a discount code(s) to the cart
	applyDiscount: ({ state, dispatch, commit }, { code }) ->
		try
			await dispatch 'fetchUnlessHydrated'
			cart = await @$storefront.updateDiscounts
				cartId: state.id
				codes: [ code ]
			commit 'replace', cart
		catch e then console.error e

	# Remove all discount codes
	removeDiscounts: ({ state, dispatch, commit }) ->
		try
			await dispatch 'fetchUnlessHydrated'
			cart = await @$storefront.updateDiscounts
				cartId: state.id
				codes: [ ]
			commit 'replace', cart
		catch e then console.error e

	# Link a customer by access token to the cart
	linkCustomer: ({ state, commit }, { accessToken }) ->
		try
			cart = await @$storefront.linkCustomer
				cartId: state.id
				accessToken: accessToken
			commit 'replace', cart
		catch e then console.error e
