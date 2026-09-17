/**
 * links.ts — page keys to paths.
 *
 * The static build addressed pages by key (`href('shop')`) because the same
 * link had to resolve from index.html and from pages/*.html alike. The keys
 * stay, because the catalogue's own data still refers to pages by key
 * (GIFT_ROUTES, FOOTER_COLS), and because they keep link targets in one place.
 */

export const PAGES = {
  home: '/',
  shop: '/shop',
  story: '/story',
  lily: '/lily',
  gifting: '/gifting',
  faq: '/faq',
  contact: '/contact',
} as const;

export type PageKey = keyof typeof PAGES;

/** Resolve a page key, optionally with query parameters. */
export function href(page: PageKey, params?: Record<string, string>) {
  const target = PAGES[page];
  if (!target) throw new Error(`links: unknown page "${page}"`);
  const query = params ? '?' + new URLSearchParams(params) : '';
  return target + query;
}

/** Link to a single bar's detail page. */
export function productHref(slug: string) {
  return `/products/${slug}`;
}
