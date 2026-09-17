/**
 * SiteLayout.tsx — the chrome every page shares.
 *
 * Replaces Hydrogen's scaffolded PageLayout. The header, footer, cart drawer
 * and quick view were four separate HTML partials inlined into every page by
 * the static build's build.js; here they are mounted once around the route
 * outlet, which is also why the cart drawer no longer has to re-read its state
 * on every navigation.
 */

import type {ReactNode} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {SiteProvider} from '~/lib/tds/cart';
import type {StoreCatalogue} from '~/lib/tds/shopify';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';
import {CartDrawer} from './CartDrawer';
import {QuickView} from './QuickView';

export function SiteLayout({
  children,
  cart,
  store,
}: {
  children: ReactNode;
  cart: CartApiQueryFragment | null;
  store: StoreCatalogue;
}) {
  return (
    <SiteProvider cart={cart} store={store}>
      <SiteHeader />
      {children}
      <SiteFooter />
      <CartDrawer />
      <QuickView />
    </SiteProvider>
  );
}
