/**
 * cart.tsx — cart state and the site's shared UI state.
 *
 * There are two cart backends, and exactly one of them is live at a time:
 *
 *   'shopify' — the store carries products whose handles match the catalogue,
 *               so lines live in a real Shopify cart and Order goes to the
 *               Shopify checkout.
 *   'local'   — no matching products yet. Lines live in localStorage against
 *               the catalogue's own prices and Order hands off to WhatsApp,
 *               exactly as the static site did.
 *
 * Which one is in play is decided by the root loader (see loadStoreCatalogue)
 * and is invisible to every component: they all read `snapshot` and call
 * `add()` / `bump()`.
 *
 * Line keys are opaque strings. Locally they are `<slug>-<size>`, as they were
 * before, so the same bar in 50 g and 100 g are two lines; on Shopify they are
 * cart line ids.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {useFetcher} from 'react-router';
import {CartForm, useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_OVER,
  PRODUCTS,
  findProduct,
  type Size,
} from '~/data/catalogue';
import {money} from './format';
import {read, write} from './storage';
import {storeVariant, type StoreCatalogue} from './shopify';
import {clearRef} from './whatsapp';

const KEY = 'cart';

/** One line, resolved against the catalogue and ready to render. */
export interface CartLineView {
  key: string;
  slug: string;
  name: string;
  img: string;
  /** "50g" / "100g". */
  size: string;
  qty: number;
  priceLabel: string;
  lineTotal: string;
}

/** Everything a cart view needs. */
export interface CartSnapshot {
  items: CartLineView[];
  isEmpty: boolean;
  count: number;
  subtotal: number;
  subtotalLabel: string;
  shippingLabel: string;
}

const EMPTY: CartSnapshot = {
  items: [],
  isEmpty: true,
  count: 0,
  subtotal: 0,
  subtotalLabel: money(0),
  shippingLabel: money(FLAT_SHIPPING),
};

interface StoredLine {
  key: string;
  slug: string;
  size: Size;
  qty: number;
}

interface SiteValue {
  snapshot: CartSnapshot;
  mode: 'shopify' | 'local';
  /** The Shopify checkout URL, when there is a Shopify cart to check out. */
  checkoutUrl: string | null;
  store: StoreCatalogue;
  add: (slug: string, size: Size) => void;
  bump: (key: string, delta: number) => void;
  /** Live price for a bar at a size — the store's if linked, else the catalogue's. */
  priceOf: (slug: string, size: Size) => number;
  /** The same price, formatted in whatever currency it is quoted in. */
  priceLabel: (slug: string, size: Size) => string;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  quickSlug: string | null;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
}

const SiteContext = createContext<SiteValue | null>(null);

/** Shipping copy, from the same rule in both modes. */
function shippingLabel(subtotal: number) {
  return subtotal >= FREE_SHIPPING_OVER
    ? 'Free across India'
    : money(FLAT_SHIPPING);
}

/** Drop anything that no longer matches a real product or a real size. */
function sanitise(raw: unknown): StoredLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is StoredLine => {
    const i = entry as Partial<StoredLine> | null;
    return (
      !!i &&
      typeof i.slug === 'string' &&
      PRODUCTS.some((p) => p.slug === i.slug) &&
      (i.size === 50 || i.size === 100) &&
      Number.isFinite(i.qty) &&
      (i.qty as number) > 0
    );
  });
}

/** Which size a Shopify cart line is, from its options or its variant title. */
function lineSize(line: {
  merchandise?: {title?: string; selectedOptions?: {value: string}[]};
}): Size {
  const haystack = [
    ...(line.merchandise?.selectedOptions?.map((o) => o.value) ?? []),
    line.merchandise?.title ?? '',
  ].join(' ');
  return /\b50\b/.test(haystack) ? 50 : 100;
}

/** Format a Storefront money value in the store's own currency. */
function storeMoney(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return money(Math.round(amount));
  }
}

export function SiteProvider({
  children,
  cart,
  store,
}: {
  children: ReactNode;
  cart: CartApiQueryFragment | null;
  store: StoreCatalogue;
}) {
  const mode: 'shopify' | 'local' =
    Object.keys(store).length > 0 ? 'shopify' : 'local';

  /* Optimistic lines mean the drawer updates on the click rather than on the
     server round-trip, which is what the local cart has always done. */
  const optimisticCart = useOptimisticCart(cart);
  const fetcher = useFetcher();

  const [local, setLocal] = useState<StoredLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /* The stored cart is read after mount, never during render: the server has
     no localStorage, and seeding state from it directly would make the first
     client render disagree with the server's HTML. */
  useEffect(() => {
    setLocal(sanitise(read<unknown>(KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(KEY, local);
  }, [local, hydrated]);

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickSlug, setQuickSlug] = useState<string | null>(null);

  const priceOf = useCallback(
    (slug: string, size: Size) => {
      const variant = storeVariant(store, slug, size);
      if (variant) return variant.amount;
      const p = findProduct(slug);
      return size === 50 ? p.p50 : p.p100;
    },
    [store],
  );

  const priceLabel = useCallback(
    (slug: string, size: Size) => {
      const variant = storeVariant(store, slug, size);
      return variant
        ? storeMoney(variant.amount, variant.currencyCode)
        : money(priceOf(slug, size));
    },
    [store, priceOf],
  );

  const snapshot = useMemo<CartSnapshot>(() => {
    if (mode === 'shopify') {
      const lines = (optimisticCart?.lines?.nodes ?? []).map((line) => {
        const handle = line.merchandise?.product?.handle ?? '';
        const product = findProduct(handle);
        const currency =
          line.cost?.totalAmount?.currencyCode ??
          line.merchandise?.price?.currencyCode ??
          'INR';
        const unit = Number(line.cost?.amountPerQuantity?.amount ?? 0);
        const total = Number(line.cost?.totalAmount?.amount ?? 0);
        return {
          key: line.id,
          slug: product.slug,
          name: product.name || line.merchandise?.product?.title || '',
          img: product.img,
          size: `${lineSize(line)}g`,
          qty: line.quantity,
          priceLabel: storeMoney(unit, currency),
          lineTotal: storeMoney(total, currency),
        };
      });
      const subtotal = Number(optimisticCart?.cost?.subtotalAmount?.amount ?? 0);
      const currency =
        optimisticCart?.cost?.subtotalAmount?.currencyCode ?? 'INR';
      return {
        items: lines,
        isEmpty: lines.length === 0,
        count: lines.reduce((n, l) => n + l.qty, 0),
        subtotal,
        subtotalLabel: storeMoney(subtotal, currency),
        shippingLabel: shippingLabel(subtotal),
      };
    }

    const lines = local.map((i) => {
      const product = findProduct(i.slug);
      const unit = i.size === 50 ? product.p50 : product.p100;
      return {
        key: i.key,
        slug: i.slug,
        name: product.name,
        img: product.img,
        size: `${i.size}g`,
        qty: i.qty,
        priceLabel: money(unit),
        lineTotal: money(unit * i.qty),
      };
    });
    const subtotal = local.reduce((total, i) => {
      const product = findProduct(i.slug);
      return total + (i.size === 50 ? product.p50 : product.p100) * i.qty;
    }, 0);
    return {
      items: lines,
      isEmpty: lines.length === 0,
      count: local.reduce((n, i) => n + i.qty, 0),
      subtotal,
      subtotalLabel: money(subtotal),
      shippingLabel: shippingLabel(subtotal),
    };
  }, [mode, optimisticCart, local]);

  /* An emptied cart ends that order, so the next one gets a fresh reference. */
  useEffect(() => {
    if (hydrated && snapshot.isEmpty) clearRef();
  }, [hydrated, snapshot.isEmpty]);

  /** Post a cart mutation to the /cart route, the shape CartForm expects. */
  const submitCart = useCallback(
    (action: string, inputs: Record<string, unknown>) => {
      void fetcher.submit(
        {[CartForm.INPUT_NAME]: JSON.stringify({action, inputs})},
        {method: 'POST', action: '/cart'},
      );
    },
    [fetcher],
  );

  const add = useCallback(
    (slug: string, size: Size) => {
      const variant = storeVariant(store, slug, size);
      if (variant) {
        submitCart(CartForm.ACTIONS.LinesAdd, {
          lines: [{merchandiseId: variant.id, quantity: 1}],
        });
        setCartOpen(true);
        return;
      }

      const key = `${slug}-${size}`;
      setLocal((items) =>
        items.some((i) => i.key === key)
          ? items.map((i) => (i.key === key ? {...i, qty: i.qty + 1} : i))
          : [...items, {key, slug, size, qty: 1}],
      );
      setCartOpen(true);
    },
    [store, submitCart],
  );

  const bump = useCallback(
    (key: string, delta: number) => {
      if (mode === 'shopify') {
        const line = (optimisticCart?.lines?.nodes ?? []).find(
          (l) => l.id === key,
        );
        if (!line) return;
        const quantity = line.quantity + delta;
        if (quantity < 1) {
          submitCart(CartForm.ACTIONS.LinesRemove, {lineIds: [key]});
        } else {
          submitCart(CartForm.ACTIONS.LinesUpdate, {
            lines: [{id: key, quantity}],
          });
        }
        return;
      }

      setLocal((items) =>
        items
          .map((i) => (i.key === key ? {...i, qty: i.qty + delta} : i))
          .filter((i) => i.qty > 0),
      );
    },
    [mode, optimisticCart, submitCart],
  );

  const value = useMemo<SiteValue>(
    () => ({
      snapshot,
      mode,
      checkoutUrl: mode === 'shopify' ? (cart?.checkoutUrl ?? null) : null,
      store,
      add,
      bump,
      priceOf,
      priceLabel,
      cartOpen,
      setCartOpen,
      menuOpen,
      setMenuOpen,
      quickSlug,
      openQuickView: (slug: string) => setQuickSlug(slug),
      closeQuickView: () => setQuickSlug(null),
    }),
    [
      snapshot,
      mode,
      cart,
      store,
      add,
      bump,
      priceOf,
      priceLabel,
      cartOpen,
      menuOpen,
      quickSlug,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error('useSite must be used inside <SiteProvider>');
  return value;
}

export {EMPTY as EMPTY_CART};
