# The Dark Square — Hydrogen storefront

The Dark Square site, ported from the static multi-page build
(`the-dark-square-1`) onto Shopify Hydrogen (React Router 7 on Oxygen).

The design is unchanged: the same stylesheets, the same markup, the same copy.
What changed is where the pieces live.

```sh
npm run dev        # http://localhost:3000
npm run build      # production build
npm run preview    # build, then serve it the way Oxygen will
npm run typecheck  # react-router typegen && tsc
npm run lint
```

## Where things are

| | |
| --- | --- |
| `app/data/catalogue.ts` | Every bar, collection, FAQ, story block and the welcome offer. Ported verbatim from `js/modules/products.js`. This is the only owner of product copy. |
| `app/routes/` | One file per page: `_index` (home), `shop`, `products.$handle`, `story`, `lily`, `gifting`, `contact`, `faq`. `cart.tsx` is the cart mutation endpoint, not a page. |
| `app/components/tds/` | The chrome: header, footer, cart drawer, quick view, coupon modal, intro loader. Mounted once in `SiteLayout`, not inlined per page as `build.js` used to. |
| `app/lib/tds/` | `cart.tsx` (cart + shared UI state), `shopify.ts` (Storefront bridge), `format.ts`, `links.ts`, `storage.ts`, `whatsapp.ts`. |
| `app/styles/tds/` | The stylesheets, copied across unchanged. `main.css` still imports them in the same order. |
| `public/assets/` | Photography, video and artwork. `assets/raw/` (the untracked video masters) was left behind. |

## The two cart modes

The cart has one interface and two backends, and picks between them on its own:

- **Shopify** — the store carries products whose handles match the catalogue.
  Lines live in a real Shopify cart, and the drawer's button goes to the Shopify
  checkout.
- **Local** — no matching products yet. Lines live in `localStorage` against the
  catalogue's own prices, and the button hands the order to WhatsApp, exactly as
  the static site did.

Components never ask which is in play: they read `snapshot` and call `add()` /
`bump()` from `useSite()`. **[SETUP.md](./SETUP.md)** covers linking the store
and the two rules a product must follow to be matched.

## Notable differences from the static build

- `build.js` and the `@include` markers are gone; partials are React components.
- Pages are server-rendered per request instead of pre-inlined, so the cart
  count in the header is correct on first paint.
- Product pages moved from `product.html?slug=x` to `/products/x`, which is also
  the Shopify product URL.
- Shop filters and the Lily & Leo treatment toggle live in the route's search
  params rather than being pushed with `history.replaceState`.
- Hydrogen's scaffolded routes and components (account, search, blogs,
  collections, policies, sitemaps) were removed; `cart.tsx` and `[robots.txt]`
  are what remain of them.
