/**
 * SiteFooter.tsx — link columns and the newsletter signup.
 *
 * Ported from components/footer.html; the columns come from the catalogue's
 * FOOTER_COLS so the links live with the rest of the site copy. Signing up
 * swaps the form for a thank-you, as it did before — there is no list to post
 * to yet.
 */

import {useState} from 'react';
import {Link} from 'react-router';
import {FOOTER_COLS} from '~/data/catalogue';
import {PAGES, type PageKey} from '~/lib/tds/links';

export function SiteFooter() {
  const [sent, setSent] = useState(false);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__cols">
          <div>
            <p className="site-footer__tagline">
              Every square
              <br />
              holds a story.
            </p>
            <p className="site-footer__blurb">
              Small-batch dark chocolate.
              <br />
              Shipping across India.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="site-footer__heading">{col.title}</p>
              <div className="site-footer__links">
                {col.links.map(([label, page]) => (
                  <Link key={`${col.title}-${label}`} to={PAGES[page as PageKey]}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="site-footer__signup">
          <div>
            <p className="site-footer__signup-title">Join the story</p>
            <p className="site-footer__blurb">
              New flavours and limited collections, first.
            </p>
          </div>
          {sent ? (
            <p className="site-footer__blurb">
              Thank you — we&rsquo;ll be in touch.
            </p>
          ) : (
            <form
              className="signup"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="visually-hidden" htmlFor="signup-email">
                Your email
              </label>
              <input
                className="signup__input"
                id="signup-email"
                name="email"
                type="email"
                placeholder="Your email"
              />
              <button className="btn btn--outline" type="submit">
                Subscribe
              </button>
            </form>
          )}
        </div>

        <p className="site-footer__legal">
          © 2026 The Dark Square · UPI, cards and netbanking accepted · India
          only
        </p>
      </div>
    </footer>
  );
}
