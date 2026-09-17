/**
 * format.ts — value formatting shared across the site.
 *
 * Ported from the static build's js/modules/format.js. The one change is
 * asset(): the static site had to resolve "assets/..." relative to the current
 * document, but here everything is served from the app root, so a leading
 * slash is all it takes.
 */

import type {Product} from '~/data/catalogue';

/** Resolve a catalogue image path ("assets/bars/p01.png") to a URL. */
export function asset(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

/** Rupees, Indian digit grouping. Matches the original `money()`. */
export function money(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

/**
 * Background shorthand serving AVIF -> WebP -> original.
 *
 * Returns a two-declaration string: a plain `background` shorthand that every
 * browser understands, followed by an `image-set()` override that modern
 * browsers use to pick the better format. Browsers that cannot parse
 * `image-set` simply keep the plain url().
 *
 * React's `style` prop is a single-property-per-key setter and would drop the
 * extra declarations, so anything using this renders it through
 * `styleFromBackground()` below, which splits it back into React properties.
 */
export function bgImage(src: string, pos = 'center') {
  const url = asset(src);
  const base = url.replace(/\.(png|jpe?g)$/i, '');
  const origType = /\.png$/i.test(url) ? 'image/png' : 'image/jpeg';
  const set =
    `url('${base}.avif') type('image/avif'), ` +
    `url('${base}.webp') type('image/webp'), ` +
    `url('${url}') type('${origType}')`;
  return (
    `url('${url}') ${pos} / cover no-repeat` +
    `; background-image: -webkit-image-set(${set})` +
    `; background-image: image-set(${set})`
  );
}

/** The hatched placeholder used when a bar has no photograph. */
export const NO_IMAGE_FILL =
  'repeating-linear-gradient(135deg, var(--bg3) 0 12px, var(--bg4) 12px 24px)';

/** Tile background for a product, photograph or placeholder. */
export function productTile(product: Product, pos = 'center 20%') {
  return product.img ? bgImage(product.img, pos) : NO_IMAGE_FILL;
}

/**
 * Turn a bgImage()/productTile() shorthand into a React style object.
 *
 * The shorthand is several declarations joined by ";" — `background:` first,
 * then the two `background-image` overrides. Later declarations win in CSS, so
 * the last `background-image` that this browser could parse is the one that
 * applies; React keeps only one value per key, so the webkit prefix goes in
 * under its own React property name and the standard one overwrites the
 * shorthand's image.
 */
export function bgStyle(shorthand: string): React.CSSProperties {
  const style: Record<string, string> = {};
  for (const part of shorthand.split(';')) {
    const decl = part.trim();
    if (!decl) continue;
    const colon = decl.indexOf(':');
    if (colon === -1) {
      style.background = decl;
      continue;
    }
    const prop = decl.slice(0, colon).trim();
    const value = decl.slice(colon + 1).trim();
    if (prop === 'background') style.background = value;
    else if (prop === 'background-image') {
      // The webkit-prefixed override comes first; keep the two apart so React
      // does not collapse them onto one key and drop the prefixed form.
      if (value.startsWith('-webkit-')) style.WebkitBackgroundImage = value;
      else style.backgroundImage = value;
    }
  }
  return style as React.CSSProperties;
}

/** Shorthand for the common `style={bgStyle(bgImage(src, pos))}` pairing. */
export function bgImageStyle(src: string, pos = 'center') {
  return bgStyle(bgImage(src, pos));
}

/** Shorthand for a product tile's style object. */
export function productTileStyle(product: Product, pos = 'center 20%') {
  return bgStyle(productTile(product, pos));
}
