/**
 * shopify.ts — the bridge between the catalogue and the Storefront API.
 *
 * The editorial half of a product (story, tasting notes, collection, artwork)
 * lives in app/data/catalogue.ts and is authored here. The commercial half —
 * live price, availability and the variant id the cart needs — belongs to the
 * store. This module fetches the store's side and matches it to the catalogue
 * on `slug`, which is also the Shopify product handle.
 *
 * Until products with those handles exist, the match is simply empty: the site
 * renders the catalogue's own prices and orders go to WhatsApp, exactly as the
 * static build did. Create the products and the same pages switch to live
 * prices and a real Shopify checkout with no further changes. See SETUP.md.
 */

import type {Storefront} from '@shopify/hydrogen';
import {PRODUCTS, type Size} from '~/data/catalogue';

/** One buyable variant of a bar, as the store has it. */
export interface StoreVariant {
  id: string;
  available: boolean;
  amount: number;
  currencyCode: string;
}

/** A catalogue slug's commercial half: one entry per size we sell. */
export interface StoreProduct {
  id: string;
  handle: string;
  variants: Partial<Record<Size, StoreVariant>>;
}

/** slug -> store data, for every catalogue bar the store actually carries. */
export type StoreCatalogue = Record<string, StoreProduct>;

const CATALOGUE_QUERY = `#graphql
  query TdsCatalogue($country: CountryCode, $language: LanguageCode, $first: Int!)
  @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes {
        id
        handle
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
` as const;

/**
 * Which size a variant is, read from its options.
 *
 * Any option value containing "50" or "100" counts, so "50g", "50 g" and
 * "50 gram" all land in the same place; the variant title is checked too, for
 * stores that named the variant without a real option. Anything else is not a
 * size we sell and is ignored.
 */
function variantSize(
  title: string,
  options: {name: string; value: string}[],
): Size | null {
  const haystack = [...options.map((o) => o.value), title].join(' ');
  if (/\b100\s*g/i.test(haystack) || /\b100\b/.test(haystack)) return 100;
  if (/\b50\s*g/i.test(haystack) || /\b50\b/.test(haystack)) return 50;
  return null;
}

/**
 * Fetch the store's half of the catalogue.
 *
 * Never throws: a storefront that is unreachable, unconfigured or simply has
 * no matching products all mean the same thing to every caller — fall back to
 * the catalogue's own prices — so the failure is logged and swallowed.
 */
export async function loadStoreCatalogue(
  storefront: Storefront,
): Promise<StoreCatalogue> {
  const handles = new Set(PRODUCTS.map((p) => p.slug));

  try {
    const {products} = await storefront.query(CATALOGUE_QUERY, {
      cache: storefront.CacheShort(),
      variables: {first: 250},
    });

    const out: StoreCatalogue = {};
    for (const node of products?.nodes ?? []) {
      if (!handles.has(node.handle)) continue;

      const variants: StoreProduct['variants'] = {};
      for (const v of node.variants?.nodes ?? []) {
        const size = variantSize(v.title, v.selectedOptions ?? []);
        if (!size || variants[size]) continue;
        variants[size] = {
          id: v.id,
          available: v.availableForSale,
          amount: Number(v.price?.amount ?? 0),
          currencyCode: v.price?.currencyCode ?? 'INR',
        };
      }

      if (Object.keys(variants).length) {
        out[node.handle] = {id: node.id, handle: node.handle, variants};
      }
    }
    return out;
  } catch (error) {
    console.error('[tds] Storefront catalogue query failed', error);
    return {};
  }
}

/** The store's variant for a bar at a size, if the store carries it. */
export function storeVariant(
  store: StoreCatalogue,
  slug: string,
  size: Size,
): StoreVariant | null {
  return store[slug]?.variants[size] ?? null;
}
