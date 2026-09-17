/**
 * shop.tsx — the filter sidebar and the product grid.
 *
 * Ported from src/pages/shop.html and js/pages/shop.js. Filters still live in
 * the query string so a filtered view is linkable; the static build had to
 * push them there by hand with replaceState, here they are just the route's
 * search params.
 */

import {Link, useSearchParams} from 'react-router';
import type {Route} from './+types/shop';
import {COLS, PRODUCTS, type Product} from '~/data/catalogue';
import {useSite} from '~/lib/tds/cart';
import {productTileStyle} from '~/lib/tds/format';
import {productHref} from '~/lib/tds/links';

const OCCASIONS = ['All', 'Everyday', 'Gifting', 'Celebration', 'Corporate'];
const COLLECTIONS = ['All', ...COLS.map((c) => c.name)];

export const meta: Route.MetaFunction = () => [
  {title: 'Find Your Square · The Dark Square'},
  {
    name: 'description',
    content:
      'Nineteen small-batch bars in dark and milk chocolate, with whole nuts, fruit and spice — browse by collection and occasion.',
  },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();

  /* An unknown value in the URL is treated as absent rather than as a filter
     that matches nothing. */
  const rawCollection = params.get('collection');
  const rawOccasion = params.get('occasion');
  const collection = COLLECTIONS.includes(rawCollection ?? '')
    ? (rawCollection as string)
    : 'All';
  const occasion = OCCASIONS.includes(rawOccasion ?? '')
    ? (rawOccasion as string)
    : 'All';

  const setFilter = (kind: 'collection' | 'occasion', value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'All') next.delete(kind);
    else next.set(kind, value);
    // replace: filtering is not a place in history to go back to.
    setParams(next, {replace: true, preventScrollReset: true});
  };

  const filtered = PRODUCTS.filter(
    (p) =>
      (collection === 'All' || p.collection === collection) &&
      (occasion === 'All' || p.occasion === occasion),
  );

  const blurb =
    collection === 'All'
      ? 'Some days call for something bold. Some days need a little sweetness. And some days simply need chocolate. Explore the collection and find the square that feels like you.'
      : (COLS.find((c) => c.name === collection)?.line ?? '');

  return (
    <main className="page page--shop">
      <p className="page-kicker">The collection</p>
      <h1 className="shop__title">
        {collection === 'All' ? 'Find Your Square' : collection}
      </h1>
      <p className="shop__blurb">{blurb}</p>

      <div className="shop__layout">
        <aside className="shop__aside">
          <p className="shop__filter-heading">Collection</p>
          <div className="shop__collections">
            {COLLECTIONS.map((n) => (
              <button
                key={n}
                className={'filter-row' + (collection === n ? ' is-active' : '')}
                type="button"
                onClick={() => setFilter('collection', n)}
              >
                {n === 'All' ? 'All chocolates' : n}
              </button>
            ))}
          </div>

          <p className="shop__filter-heading">Occasion</p>
          <div className="shop__occasions">
            {OCCASIONS.map((n) => (
              <button
                key={n}
                className={'chip' + (occasion === n ? ' is-active' : '')}
                type="button"
                onClick={() => setFilter('occasion', n)}
              >
                {n === 'All' ? 'Any' : n}
              </button>
            ))}
          </div>
        </aside>

        <div className="shop__results">
          <p className="shop__count">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'chocolate' : 'chocolates'}
          </p>
          <div className="shop__grid">
            {filtered.length ? (
              filtered.map((p) => <ShopCard key={p.slug} product={p} />)
            ) : (
              <p className="empty">Nothing matches those filters yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ShopCard({product}: {product: Product}) {
  const {add, openQuickView, priceLabel} = useSite();

  return (
    <div className="shop-card">
      <div className="shop-card__figure">
        <Link
          className="shop-card__tile"
          to={productHref(product.slug)}
          style={productTileStyle(product)}
          aria-label={product.name}
        ></Link>
        <button
          className="shop-card__quick"
          type="button"
          onClick={() => openQuickView(product.slug)}
        >
          Quick view
        </button>
      </div>
      <Link className="shop-card__name" to={productHref(product.slug)}>
        {product.name}
      </Link>
      <p className="shop-card__pair">{product.pair}</p>
      <div className="shop-card__foot">
        <span className="shop-card__price">
          from {priceLabel(product.slug, 50)}
        </span>
        <button
          className="shop-card__add"
          type="button"
          onClick={() => add(product.slug, 100)}
        >
          Add
        </button>
      </div>
    </div>
  );
}
