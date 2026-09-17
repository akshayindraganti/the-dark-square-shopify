/**
 * CartDrawer.tsx — "Your Squares".
 *
 * Ported from components/cart-drawer.html and the initCart half of
 * js/main.js. The one addition is the checkout half: when the catalogue is
 * linked to a store the footer sends people to the Shopify checkout, and only
 * falls back to the WhatsApp hand-off when it is not.
 */

import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {useSite} from '~/lib/tds/cart';
import {bgImageStyle} from '~/lib/tds/format';
import {href} from '~/lib/tds/links';
import {isConfigured, orderUrl} from '~/lib/tds/whatsapp';

export function CartDrawer() {
  const {snapshot, bump, cartOpen, setCartOpen, mode, checkoutUrl} = useSite();

  useEffect(() => {
    if (!cartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  /* The WhatsApp link is rebuilt from scratch on every change: the message
     carries the line items and the total, so a stale href would send the
     previous cart. It is built after mount because the order reference it
     quotes comes from localStorage, which the server cannot see. */
  const [waUrl, setWaUrl] = useState<string | null>(null);
  useEffect(() => {
    if (mode !== 'local' || snapshot.isEmpty || !isConfigured()) {
      setWaUrl(null);
      return;
    }
    setWaUrl(orderUrl(snapshot));
  }, [mode, snapshot]);

  const orderHref = mode === 'shopify' ? checkoutUrl : waUrl;
  const orderLabel =
    mode === 'shopify' ? 'Checkout' : 'Order on WhatsApp';
  const orderNote =
    mode === 'shopify'
      ? 'Payment and delivery details are collected at checkout.'
      : "We'll confirm stock and share payment details in the chat.";

  return (
    <div
      className="drawer"
      id="cart-drawer"
      role="dialog"
      aria-label="Your squares"
      hidden={!cartOpen}
    >
      <button
        className="overlay__scrim"
        type="button"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
      ></button>
      <div className="drawer__panel">
        <div className="drawer__head">
          <p className="drawer__title">Your Squares</p>
          <button
            className="icon-button"
            type="button"
            onClick={() => setCartOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="drawer__body">
          {snapshot.isEmpty ? (
            <div className="empty">
              <p>Nothing here yet.</p>
              <Link className="btn btn--outline" to={href('shop')}>
                Choose chocolates
              </Link>
            </div>
          ) : (
            snapshot.items.map((line) => (
              <div className="cart-line" key={line.key}>
                <div
                  className="cart-line__tile"
                  style={line.img ? bgImageStyle(line.img, 'center 18%') : undefined}
                ></div>
                <div style={{flex: 1}}>
                  <p className="cart-line__name">{line.name}</p>
                  <p className="cart-line__meta">
                    {line.size} · {line.priceLabel}
                  </p>
                  <div
                    style={{display: 'flex', alignItems: 'center', gap: '12px'}}
                  >
                    <div className="qty">
                      <button
                        className="qty__btn"
                        type="button"
                        aria-label={`Remove one ${line.name}`}
                        onClick={() => bump(line.key, -1)}
                      >
                        −
                      </button>
                      <span className="qty__value">{line.qty}</span>
                      <button
                        className="qty__btn"
                        type="button"
                        aria-label={`Add one ${line.name}`}
                        onClick={() => bump(line.key, 1)}
                      >
                        +
                      </button>
                    </div>
                    <span style={{marginLeft: 'auto', fontSize: '14px'}}>
                      {line.lineTotal}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer__foot" hidden={snapshot.isEmpty}>
          <div className="cart-total">
            <span>Subtotal</span>
            <span>{snapshot.subtotalLabel}</span>
          </div>
          <div className="cart-total cart-total--muted">
            <span>Shipping</span>
            <span>{snapshot.shippingLabel}</span>
          </div>

          {/* An <a>, not a <button>: ordering is a hand-off — to Shopify's
              checkout or to WhatsApp — and a real link can be opened in a new
              tab or long-pressed. Hidden entirely when there is nowhere to
              hand off to, rather than leading nowhere. */}
          {orderHref ? (
            <>
              <a
                className="btn btn--solid btn--block"
                href={orderHref}
                target={mode === 'local' ? '_blank' : undefined}
                rel={mode === 'local' ? 'noopener noreferrer' : undefined}
              >
                {orderLabel}
              </a>
              <p className="cart-total cart-total--muted">
                <span>{orderNote}</span>
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
