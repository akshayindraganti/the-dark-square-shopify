/**
 * products.$handle.tsx — the detail page for one bar.
 *
 * Ported from src/pages/product.html and js/pages/product.js. The bar used to
 * be chosen by a ?slug query parameter; it is a real path segment now, and
 * that segment is also the Shopify product handle, so the same URL works once
 * the catalogue is linked to a store.
 */

import {useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {PRODUCTS, findProduct, type Size} from '~/data/catalogue';
import {useSite} from '~/lib/tds/cart';
import {productTileStyle} from '~/lib/tds/format';
import {href, productHref} from '~/lib/tds/links';

export async function loader({params}: Route.LoaderArgs) {
  const product = PRODUCTS.find((p) => p.slug === params.handle);
  if (!product) {
    throw new Response('Not found', {status: 404});
  }
  return {slug: product.slug};
}

export const meta: Route.MetaFunction = ({data}) => {
  const product = findProduct(data?.slug);
  return [
    {title: `${product.name} · The Dark Square`},
    {name: 'description', content: product.story},
  ];
};

export default function ProductPage({loaderData}: Route.ComponentProps) {
  const product = findProduct(loaderData.slug);
  const {add, priceLabel} = useSite();
  const [size, setSize] = useState<Size>(100);

  const related = PRODUCTS.filter(
    (p) => p.collection === product.collection && p.slug !== product.slug,
  ).slice(0, 3);

  return (
    <main>
      <div className="pdp">
        <div className="pdp__media">
          <div className="pdp__hero" style={productTileStyle(product)}></div>
        </div>

        <div className="pdp__body">
          <p className="pdp__crumbs">
            <Link to={href('shop')}>Shop</Link> / <span>{product.collection}</span>
          </p>
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__meta">{product.pair}</p>
          <p className="pdp__line">{product.line}</p>
          <p className="pdp__story">{product.story}</p>
          <p className="pdp__story2">{product.story2}</p>

          <div className="pdp__notes">
            {(
              [
                ['Cocoa', product.cocoa],
                ['Texture', product.texture],
                ['Finish', product.finish],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <p className="pdp__note-label">{label}</p>
                <p className="pdp__note-value">{value}</p>
              </div>
            ))}
          </div>

          <div className="pdp__pack">
            <div className="pdp__pack-inner">
              <picture>
                <source srcSet="/assets/leo-new.avif" type="image/avif" />
                <source srcSet="/assets/leo-new.webp" type="image/webp" />
                <img
                  className="pdp__pack-avatar"
                  src="/assets/leo-new.png"
                  alt="Leo resting his chin on his hands, daydreaming"
                />
              </picture>
              <div>
                <p className="pdp__pack-title">From the back of the pack</p>
                <p className="pdp__pack-note">{product.leoNote}</p>
              </div>
            </div>
          </div>

          <div className="buybar">
            <div className="buybar__inner">
              <div className="buybar__sizes">
                <p className="buybar__label">Size</p>
                <div className="buybar__chips">
                  {([50, 100] as Size[]).map((n) => (
                    <button
                      key={n}
                      className={'chip' + (size === n ? ' is-active' : '')}
                      type="button"
                      onClick={() => setSize(n)}
                    >
                      {n}g
                    </button>
                  ))}
                </div>
              </div>
              <div className="buybar__price">
                <p className="buybar__label">Price</p>
                <p className="buybar__amount">{priceLabel(product.slug, size)}</p>
              </div>
              <button
                className="buybar__add"
                type="button"
                onClick={() => add(product.slug, size)}
              >
                Add to my squares
              </button>
            </div>
            <p className="buybar__ship">
              Ships across India in 3–5 days · Cool-chain packing included
            </p>
          </div>

          <div className="pdp__related">
            <h2 className="pdp__related-title">
              Others from <span>{product.collection}</span>
            </h2>
            <div className="pdp__related-grid">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  className="pdp__related-card"
                  to={productHref(p.slug)}
                >
                  <div
                    className="pdp__related-tile"
                    style={productTileStyle(p)}
                  ></div>
                  <p className="pdp__related-name">{p.name}</p>
                  <p className="pdp__related-price">
                    from {priceLabel(p.slug, 50)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
