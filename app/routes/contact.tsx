/**
 * contact.tsx — details list, enquiry form and its sent state.
 *
 * Ported from src/pages/contact.html and js/pages/contact.js. The form still
 * has no backend: submitting swaps it for the confirmation panel.
 */

import {useState} from 'react';
import type {Route} from './+types/contact';
import {CONTACT_FIELDS, CONTACT_ROWS} from '~/data/catalogue';

export const meta: Route.MetaFunction = () => [
  {title: 'Contact · The Dark Square'},
  {
    name: 'description',
    content:
      'Questions, gifting orders or something special in the works — get in touch with The Dark Square.',
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main className="contact">
      <div>
        <p className="page-kicker">Contact</p>
        <h1 className="contact__title">Let’s talk chocolate.</h1>
        <p className="contact__body">
          Have a question? Want to place a gifting order? Planning something
          special? Or simply want to say hello?
        </p>
        <p className="contact__note">We’d love to hear from you.</p>

        <div className="contact__rows">
          {CONTACT_ROWS.map((c) => (
            <div className="contact-row" key={c.label}>
              <span className="contact-row__label">{c.label}</span>
              <span className="contact-row__value">{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="contact__panel">
        {sent ? (
          <div className="contact__sent">
            <picture>
              <source srcSet="/assets/lily-new.avif" type="image/avif" />
              <source srcSet="/assets/lily-new.webp" type="image/webp" />
              <img
                className="contact__sent-avatar"
                src="/assets/lily-new.png"
                alt="Lily reading aloud from a glowing book"
              />
            </picture>
            <p className="contact__sent-title">Message received.</p>
            <p className="contact__sent-body">
              We’ll write back soon — a person replies, not a bot.
            </p>
          </div>
        ) : (
          <form
            className="contact__form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div>
              {CONTACT_FIELDS.map((f) => (
                <label className="field" key={f.label}>
                  <span className="field__label">{f.label}</span>
                  <input
                    className="field__input"
                    type="text"
                    name={f.label.toLowerCase().replace(/\W+/g, '-')}
                    placeholder={f.ph}
                  />
                </label>
              ))}
            </div>
            <label className="field">
              <span className="field__label">Message</span>
              <textarea
                className="field__input field__input--area"
                name="message"
                rows={5}
                placeholder="Tell us what you’re planning."
              ></textarea>
            </label>
            <button className="contact__send" type="submit">
              Send message
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
