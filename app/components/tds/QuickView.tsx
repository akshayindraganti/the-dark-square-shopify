/**
 * QuickView.tsx — the product peek opened from a shop card.
 *
 * Ported from components/quick-view.html and js/modules/quick-view.js. Lives
 * in the layout rather than on the shop page because the shop grid and the
 * home page's featured row both open it.
 */

import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {findProduct, type Size} from '~/data/catalogue';
import {useSite} from '~/lib/tds/cart';
import {productTileStyle} from '~/lib/tds/format';
import {productHref} from '~/lib/tds/links';

export function QuickView() {
  const {quickSlug, closeQuickView, add, priceLabel} = useSite();
  const [size, setSize] = useState<Size>(100);

  /* Every open starts at 100 g, as the original did. */
  useEffect(() => {
    if (quickSlug) setSize(100);
  }, [quickSlug]);

  useEffect(() => {
    if (!quickSlug) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [quickSlug, closeQuickView]);

  if (!quickSlug) return null;
  const p = findProduct(quickSlug);

  return (
    <div className="overlay quick" id="quick-view">
      <button
        className="overlay__scrim quick__scrim"
        type="button"
        aria-label="Close"
        onClick={closeQuickView}
      ></button>
      <div
        className="quick__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Chocolate details"
      >
        <button
          className="quick__close"
          type="button"
          aria-label="Close"
          onClick={closeQuickView}
        >
          &times;
        </button>
        <div className="quick__grid">
          <div className="quick__media" style={productTileStyle(p)}></div>
          <div className="quick__body">
            <p className="quick__eyebrow">
              {p.collection} · {p.pct}% cacao
            </p>
            <p className="quick__name">{p.name}</p>
            <p className="quick__pair">{p.pair}</p>
            <p className="quick__line">{p.line}</p>
            <p className="quick__story">{p.story}</p>

            <div className="quick__notes">
              {(
                [
                  ['Cocoa', p.cocoa],
                  ['Texture', p.texture],
                  ['Finish', p.finish],
                ] as const
              ).map(([label, value]) => (
                <div className="note" key={label}>
                  <p className="note__label">{label}</p>
                  <p className="note__value">{value}</p>
                </div>
              ))}
            </div>

            <div className="quick__sizes">
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
              <span className="quick__price">{priceLabel(p.slug, size)}</span>
            </div>

            <div className="quick__actions">
              <button
                className="quick__add"
                type="button"
                onClick={() => {
                  add(p.slug, size);
                  closeQuickView();
                }}
              >
                Add to my squares
              </button>
              <Link className="quick__details" to={productHref(p.slug)}>
                Full details
              </Link>
            </div>

            <p className="quick__note">{p.leoNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
