/**
 * CouponModal.tsx — the welcome offer.
 *
 * Ported from components/coupon-modal.html and the initCoupon half of
 * js/main.js. Home page only, once every COUPON.seenDays; ?coupon=1 forces it
 * open and ?coupon=0 suppresses it for one page view, so the popup can be
 * previewed and styled without clearing storage or waiting out the delay.
 */

import {useCallback, useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router';
import {COUPON} from '~/data/catalogue';
import {bgImageStyle} from '~/lib/tds/format';
import {href} from '~/lib/tds/links';
import {read, write} from '~/lib/tds/storage';

const SEEN_KEY = 'couponSeen';

/**
 * Has the visitor dismissed the offer recently enough to stay suppressed?
 *
 * The stored value is the timestamp of the dismissal, so the offer comes back
 * after COUPON.seenDays rather than being gone for good. Anything unparseable
 * counts as "not seen" — better to show the offer once too often than to
 * suppress it forever because of a bad value.
 */
function suppressed() {
  const seenAt = read<number | null>(SEEN_KEY, null);
  if (typeof seenAt !== 'number') return false;
  const days = (Date.now() - seenAt) / 86400000;
  return days >= 0 && days < COUPON.seenDays;
}

export function CouponModal() {
  const [params] = useSearchParams();
  const forced = params.get('coupon');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (forced === '1') {
      setOpen(true);
      return;
    }
    if (forced === '0' || suppressed()) return;
    const timer = setTimeout(() => setOpen(true), COUPON.delayMs);
    return () => clearTimeout(timer);
  }, [forced]);

  const close = useCallback(() => {
    setOpen(false);
    write(SEEN_KEY, Date.now());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="overlay coupon" id="coupon-modal">
      <button
        className="overlay__scrim"
        type="button"
        aria-label="Close offer"
        onClick={close}
      ></button>
      <div
        className="coupon__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome offer"
      >
        <button
          className="coupon__close"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          &times;
        </button>

        <div className="coupon__copy">
          <p className="coupon__brand">{COUPON.brand}</p>
          <p className="coupon__brand-sub">{COUPON.brandSub}</p>
          <p className="coupon__headline">{COUPON.headline}</p>
          <p className="coupon__enjoy">{COUPON.enjoy}</p>
          <p className="coupon__offer">{COUPON.offer}</p>
          <p className="coupon__offer-sub">{COUPON.offerSub}</p>

          <button
            className="coupon__code"
            type="button"
            onClick={() => {
              /* Fire and forget: the code is on screen either way, so a
                 clipboard that is unavailable or refused changes nothing
                 except the hint below the button. */
              void navigator.clipboard
                ?.writeText(COUPON.code)
                .catch(() => {});
              setCopied(true);
            }}
          >
            <span>{COUPON.codeLabel}</span>
            <b>{COUPON.code}</b>
          </button>
          <p className="coupon__hint">
            {copied ? 'Code copied' : 'Tap the code to copy'}
          </p>

          <Link className="coupon__cta" to={href('shop')} onClick={close}>
            <span>{COUPON.cta}</span>{' '}
            <span className="coupon__arrow">&#8594;</span>
          </Link>

          <p className="coupon__tagline">{COUPON.tagline}</p>
          <p className="coupon__terms">{COUPON.terms}</p>
        </div>

        <div
          className="coupon__art"
          role="img"
          aria-label="Lily and Leo peeking out of a dark chocolate gift box"
          style={bgImageStyle(COUPON.art, 'center')}
        ></div>
      </div>
    </div>
  );
}
