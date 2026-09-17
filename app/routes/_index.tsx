/**
 * _index.tsx — the home page.
 *
 * Ported from src/pages/home.html plus js/pages/home.js: the intro loader, the
 * hero video, the collection cards and the moments list.
 */

import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/_index';
import {COLS, MOMENTS, PRODUCTS} from '~/data/catalogue';
import {IntroLoader} from '~/components/tds/IntroLoader';
import {CouponModal} from '~/components/tds/CouponModal';
import {bgImage, bgStyle, NO_IMAGE_FILL} from '~/lib/tds/format';
import {href} from '~/lib/tds/links';

const PHONE = 768; // portrait hero video below this width

export const meta: Route.MetaFunction = () => [
  {title: 'The Dark Square · Artisan Chocolates'},
  {
    name: 'description',
    content:
      'Small-batch dark chocolate made in India. Every square is built around one idea and one ingredient worth waiting for.',
  },
];

/** Cover art for a collection: the first bar in it that has a photograph. */
function collectionArt(name: string) {
  const withImage = PRODUCTS.find((p) => p.collection === name && p.img);
  return withImage ? bgImage(withImage.img, 'center 20%') : NO_IMAGE_FILL;
}

/**
 * The hero video, cropped portrait on phones and landscape above.
 *
 * The source is chosen after mount rather than during render: the server has
 * no window to measure, and shipping the landscape master in the HTML would
 * start a 3.5 MB download on a phone before the effect could swap it.
 */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const phone = window.innerWidth < PHONE;
    video.src = phone
      ? '/assets/hero-splash-mobile.mp4'
      : '/assets/hero-splash.mp4';
    video.poster = phone
      ? '/assets/hero-splash-mobile-poster.jpg'
      : '/assets/hero-splash-poster.jpg';
  }, []);

  return (
    <video
      ref={ref}
      className="hero-splash-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}

export default function Home() {
  return (
    <>
      <IntroLoader />

      <main>
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-splash-layer" aria-hidden="true">
            <HeroVideo />
            <div className="hero__scrim"></div>
          </div>

          <div className="hero-copy">
            <p className="hero__eyebrow">Small-batch · Made in India</p>
            <h1 className="hero__title">
              Every square
              <br />
              <span className="hero__title-em">holds a story.</span>
            </h1>
            <p className="hero__body">
              Each square is built around one idea and one ingredient worth
              waiting for. Prepared in small batches, tempered by hand, wrapped
              to be opened slowly.
            </p>
            <div className="hero__actions">
              <Link className="hero__cta" to={href('shop')}>
                Explore the Collection
              </Link>
              <Link className="hero__link" to={href('story')}>
                Our Story <span className="hero__arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── A little square ─────────────────────────────────────── */}
        <section className="pitch">
          <div className="pitch__inner">
            <h2 className="pitch__title">
              A little square.
              <br />
              <span className="pitch__title-em">A lot of story.</span>
            </h2>
            <p className="pitch__body">
              Chocolate has a way of making ordinary moments feel special. At The
              Dark Square, we create handcrafted chocolates with thoughtfully
              chosen flavours, beautiful textures and a touch of imagination.
            </p>
            <p className="pitch__note">
              Because sometimes, happiness comes in a small square.
            </p>
          </div>
        </section>

        {/* ── Meet the Squares ────────────────────────────────────── */}
        <section className="collections">
          <div className="collections__head">
            <div>
              <h2 className="collections__title">Meet the Squares</h2>
              <p className="collections__body">
                Every chocolate has its own personality. Some are bold. Some are
                playful. Some are comforting. And some are impossible to stop at
                just one.
              </p>
            </div>
            <Link className="collections__all" to={href('shop')}>
              View all chocolates
            </Link>
          </div>
          <div className="collections__grid">
            {COLS.map((c) => (
              <Link
                key={c.name}
                className="collection-card"
                to={href('shop', {collection: c.name})}
              >
                <div
                  className="collection-card__tile"
                  style={bgStyle(collectionArt(c.name))}
                ></div>
                <div className="collection-card__body">
                  <p className="collection-card__name">{c.name}</p>
                  <p className="collection-card__line">{c.line}</p>
                  <p className="collection-card__count">
                    {PRODUCTS.filter((p) => p.collection === c.name).length}{' '}
                    chocolates
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Lily & Leo ──────────────────────────────────────────── */}
        <section className="lily-teaser">
          <div className="lily-teaser__inner">
            <picture>
              <source srcSet="/assets/lilyleo-scene.avif" type="image/avif" />
              <source srcSet="/assets/lilyleo-scene.webp" type="image/webp" />
              <img
                className="lily-teaser__image"
                src="/assets/lilyleo-scene.jpg"
                alt="Lily reading aloud from a glowing book while Leo listens, cocoa farms and a globe drawn in light above them"
              />
            </picture>
            <div>
              <p className="lily-teaser__kicker">Meet Lily &amp; Leo</p>
              <h2 className="lily-teaser__title">
                Two curious little chocolate lovers
              </h2>
              <p className="lily-teaser__body">
                One big sweet tooth. And plenty of chocolate adventures waiting
                to happen.
              </p>
              <p className="lily-teaser__body lily-teaser__body--last">
                Lily &amp; Leo are the little characters behind The Dark Square —
                discovering flavours, sharing stories and getting into just
                enough chocolate trouble along the way.
              </p>
              <Link className="underline-link" to={href('lily')}>
                Enter their world
              </Link>
            </div>
          </div>
        </section>

        {/* ── Gifting / Story panels ──────────────────────────────── */}
        <section className="panels">
          <div className="panels__grid">
            <div className="panel">
              <p className="panel__kicker">Gifting</p>
              <h3 className="panel__title">Give a little happiness</h3>
              <p className="panel__body">
                Some gifts are opened. Some gifts are remembered. Ours are made
                for both.
              </p>
              <Link className="panel__cta" to={href('gifting')}>
                Discover gifting
              </Link>
            </div>

            <div className="panel">
              <p className="panel__kicker">Our story</p>
              <h3 className="panel__title">
                Some stories deserve a second chapter
              </h3>
              <p className="panel__body">
                The Dark Square was born from a love for chocolate that never
                really went away. There was a pause — a long one. But some
                passions don’t disappear. They wait.
              </p>
              <Link
                className="panel__cta panel__cta--strong"
                to={href('story')}
              >
                Read our story
              </Link>
            </div>
          </div>
        </section>

        {/* ── Made for moments ────────────────────────────────────── */}
        <section className="moments">
          <div className="moments__inner">
            <div>
              <h2 className="moments__title">Made for moments.</h2>
              <p className="moments__body">
                We believe every square deserves a moment.
              </p>
            </div>
            <div className="moments__list">
              {MOMENTS.map((m) => (
                <p className="moment" key={m}>
                  {m}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ──────────────────────────────────────────── */}
        <SignupBand />

        {/* ── Sign-off ────────────────────────────────────────────── */}
        <section className="signoff">
          <div className="signoff__inner">
            <p className="signoff__text">
              Take a square.
              <br />
              Make a moment.
              <br />
              <span className="signoff__em">Tell a story.</span>
            </p>
          </div>
        </section>
      </main>

      {/* Counts down COUPON.delayMs from mount, as main.js did from ready(). */}
      <CouponModal />
    </>
  );
}

function SignupBand() {
  const [sent, setSent] = useState(false);

  return (
    <section className="signup-band">
      <div className="signup-band__inner">
        <div>
          <h2 className="signup-band__title">Something delicious is coming.</h2>
          <p className="signup-band__body">
            Be the first to discover new flavours, chocolate stories, special
            collections and little surprises from The Dark Square.
          </p>
        </div>
        {sent ? (
          <p className="signup-band__body">
            Thank you — we&rsquo;ll be in touch.
          </p>
        ) : (
          <form
            className="signup-band__form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="visually-hidden" htmlFor="home-email">
              Your email address
            </label>
            <input
              className="signup-band__input"
              id="home-email"
              name="email"
              type="email"
              placeholder="Your email address"
            />
            <button className="signup-band__button" type="submit">
              Join the chocolate list
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
