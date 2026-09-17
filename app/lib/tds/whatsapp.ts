/**
 * whatsapp.ts — hand a cart off to WhatsApp as a prefilled message.
 *
 * This is the ordering path used while the catalogue is not linked to a
 * Shopify store: there is no checkout to send anyone to, so the order link
 * opens a chat with the shop and types the order out. Once products exist in
 * the store, CartDrawer sends people to the real Shopify checkout instead and
 * none of this runs.
 *
 * Two things this deliberately does NOT do, because it cannot:
 *
 *   - It never clears the cart. Opening WhatsApp is not sending a message;
 *     the customer may close it, and losing their cart for a message they
 *     never sent would be worse than a duplicate.
 *   - It is not a record of the order. The prefilled text is editable before
 *     sending, so the order of record is whatever actually arrives in the
 *     chat. Always confirm the lines and the total back to the customer.
 *
 * The order reference exists so both sides can name the same order once the
 * chat has scrolled. It persists until the cart empties, so re-opening the
 * link for an unchanged cart quotes the same reference rather than inventing
 * a second one for the same order.
 */

import {WHATSAPP} from '~/data/catalogue';
import {read, write, remove} from './storage';
import type {CartSnapshot} from './cart';

const REF_KEY = 'orderRef';

/* Ambiguous characters left out: no O/0, no I/1, so a reference read aloud
   or retyped from a screenshot survives the trip. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomRef() {
  const n = 4;
  const out = new Array<string>(n);
  const rand = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint32Array(n))
    : Array.from({length: n}, () => Math.floor(Math.random() * 2 ** 32));
  for (let i = 0; i < n; i++) out[i] = ALPHABET[rand[i] % ALPHABET.length];
  return `TDS-${out.join('')}`;
}

/**
 * Reduce a configured number to the digits wa.me wants.
 *
 * Accepts the shapes people naturally paste — "+91 98765 43210",
 * "+91-98765-43210" — and strips them down to "919876543210".
 */
function digits() {
  return String(WHATSAPP.number || '').replace(/\D/g, '');
}

let warned = false;

/**
 * Whether a usable number has been configured.
 *
 * A bare national number is the trap here: "7386508742" is a perfectly good
 * Indian mobile, but wa.me needs the country code too, and without it WhatsApp
 * answers "Phone number shared via url is invalid". Ten digits or fewer almost
 * always means the country code was left off, so it is refused — and said out
 * loud once, because a silently missing button is the hardest kind of bug to
 * chase.
 */
export function isConfigured() {
  const n = digits();
  if (n.length >= 11 && n.length <= 15) return true;

  if (n.length && !warned) {
    warned = true;
    console.warn(
      `[whatsapp] WHATSAPP.number is "${WHATSAPP.number}" (${n.length} digits). ` +
        'wa.me needs the country code: an Indian number is 91 + 10 digits, ' +
        'e.g. "919876543210". The order link stays hidden until this is fixed.',
    );
  }
  return false;
}

/** The current order's reference, generating and storing one if needed. */
export function orderRef() {
  const saved = read<string | null>(REF_KEY, null);
  if (typeof saved === 'string' && /^TDS-[A-Z0-9]{4}$/.test(saved)) return saved;
  const ref = randomRef();
  write(REF_KEY, ref);
  return ref;
}

/** Drop the reference so the next order gets a fresh one. */
export function clearRef() {
  remove(REF_KEY);
}

/**
 * Build the message body for a cart snapshot.
 *
 * Kept compact on purpose: the whole thing travels in a URL, and a very long
 * query string risks being truncated by the browser or by WhatsApp itself.
 */
export function orderMessage(snap: CartSnapshot, ref: string) {
  const lines = snap.items.map(
    (item, i) =>
      `${i + 1}. ${item.name} (${item.size}) x${item.qty} — ${item.lineTotal}`,
  );

  return [
    `Hi ${WHATSAPP.shopName}! I'd like to order:`,
    '',
    ...lines,
    '',
    `Subtotal: ${snap.subtotalLabel}`,
    `Shipping: ${snap.shippingLabel}`,
    '',
    `Order ref: ${ref}`,
  ].join('\n');
}

/**
 * The wa.me link for a cart snapshot, or null when there is nothing to order.
 *
 * wa.me is WhatsApp's own click-to-chat host: on a phone it opens the app, on
 * a desktop it opens WhatsApp Web. The number must be in international format
 * with no "+", spaces or dashes.
 */
export function orderUrl(snap: CartSnapshot | null) {
  if (!snap || snap.isEmpty) return null;
  if (!isConfigured()) return null;
  const text = orderMessage(snap, orderRef());
  return `https://wa.me/${digits()}?text=${encodeURIComponent(text)}`;
}
