/**
 * SiteHeader.tsx — the brand, the nav, the cart button and the mobile menu.
 *
 * Ported from components/header.html plus the initNav/initMenu half of
 * js/main.js. The active nav item comes from the current route rather than
 * from the filename.
 */

import {useEffect} from 'react';
import {Link, NavLink, useLocation} from 'react-router';
import {NAV_LINKS} from '~/data/catalogue';
import {useSite} from '~/lib/tds/cart';
import {PAGES, type PageKey} from '~/lib/tds/links';

export function SiteHeader() {
  const {snapshot, setCartOpen, menuOpen, setMenuOpen} = useSite();
  const location = useLocation();

  /* The menu is a full-screen overlay, so the page behind it must not scroll.
     Cleared on unmount too, or an unmount mid-open would leave the body
     locked. */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen]);

  /* A navigation always closes the menu — the link that caused it is inside. */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search, setMenuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/" aria-label="The Dark Square — home">
            <span className="brand__name">THE DARK SQUARE</span>
            <span className="brand__sub">ARTISAN CHOCOLATES</span>
          </Link>

          <nav className="site-nav" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.page}
                className={({isActive}) =>
                  'site-nav__link' + (isActive ? ' is-active' : '')
                }
                to={PAGES[link.page as PageKey]}
                data-page={link.page}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <button
              className="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
            >
              <span className="cart-button__label-full">
                Your Squares ({snapshot.count})
              </span>
              <span className="cart-button__label-short">
                Squares ({snapshot.count})
              </span>
            </button>

            <button
              className="burger"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="burger__bar"></span>
              <span className="burger__bar"></span>
              <span className="burger__bar"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" hidden={!menuOpen}>
        <div className="mobile-menu__top">
          <button
            className="mobile-menu__close"
            type="button"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
        </div>
        <nav className="mobile-menu__nav" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.page}
              className="mobile-menu__link"
              to={PAGES[link.page as PageKey]}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mobile-menu__tagline">Every square holds a story.</p>
      </div>
    </>
  );
}
