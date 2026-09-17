# Linking the store

The site runs today with no Shopify store attached. Until one is linked it
prices bars from `app/data/catalogue.ts` and hands orders to WhatsApp, exactly
as the static build did. Nothing below is required to develop or preview it.

When you link a store and create the products, the same pages switch to live
prices and a real Shopify checkout. No code changes.

## 1. Link the storefront

```sh
npx shopify hydrogen link     # pick the store, then the Hydrogen storefront
npx shopify hydrogen env pull # writes the tokens into .env
npm run dev
```

Without this, `npm run dev` talks to Shopify's public `mock.shop` demo API. That
works — the site renders — but mock.shop has none of our products, so the
catalogue stays unlinked.

## 2. Create the products

Each bar is one Shopify product. Two rules matter, and only two:

| What | Must be |
| --- | --- |
| Product **handle** | the bar's `slug` in `app/data/catalogue.ts` — e.g. `salted-almond-noir` |
| Variant **option value** | `50g` and `100g` (the option can be named Size, Weight, anything) |

Everything else about the product in Shopify — title, description, images,
collections, tags — is ignored by this site. The name, story, tasting notes,
pack art and collection all come from the catalogue file, because they are
written prose and belong in the repo with the design that frames them. Shopify
owns price, availability, inventory and checkout.

The handles, in catalogue order:

```
salted-almond-noir          hazelnut-coffee-affair      hazelnut-heirloom
cashew-daydream             pistachio-after-midnight    monsoon-coffee-roast
whole-nut-parade            walnut-midnight             rose-pistachio-reverie
himachal-almond             ...and the rest of The Regional Collection
```

Run this to print the current list, whatever the catalogue holds:

```sh
node -e "const s=require('fs').readFileSync('app/data/catalogue.ts','utf8');console.log([...s.matchAll(/slug: \"(.+?)\"/g)].map(m=>m[1]).join('\n'))"
```

A bar with no Shopify product simply keeps its catalogue price and goes to
WhatsApp; the two can coexist while the store is filled in, though the cart
drawer commits to one mode for the whole session, so finish the catalogue
before launch.

## 3. Check it took

With the store linked, load any product page. If the price bar shows the price
you set in Shopify rather than the one in `catalogue.ts`, the match worked, and
"Add to my squares" now writes to a real Shopify cart with a Checkout button in
the drawer.

If it still shows the catalogue price, the handle does not match, the variant
options do not contain `50`/`100`, or the storefront token is missing. The
server logs a line beginning `[tds]` when the Storefront query itself fails.

## What is still not wired to Shopify

- **The contact form and both newsletter signups** post nowhere; they swap
  themselves for a thank-you, as they did before. Point them at a form backend
  or a Shopify customer-create mutation when there is a list to add people to.
- **The discount code** in the welcome popup (`SWEETSTART`) is copy only. Create
  a matching discount in Shopify for it to do anything at checkout.
- **The ₹90 / free-over-₹1,500 shipping line** in the cart drawer is display
  copy from `catalogue.ts`. Real shipping is whatever the store's rates say at
  checkout; keep the two in step by hand.
