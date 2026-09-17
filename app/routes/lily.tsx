/**
 * lily.tsx — Lily & Leo, in two story treatments.
 *
 * Ported from src/pages/lily.html and js/pages/lily.js. 'a' (Storybook Spread)
 * stays the default and the choice is kept in the URL so a treatment can be
 * linked to; the static build pushed that with replaceState, here it is just a
 * search param.
 */

import {Link, useSearchParams} from 'react-router';
import type {Route} from './+types/lily';
import {LILY_BEATS, LILY_QUESTIONS, SPREADS} from '~/data/catalogue';
import {bgImageStyle} from '~/lib/tds/format';
import {href} from '~/lib/tds/links';

export const meta: Route.MetaFunction = () => [
  {title: 'Lily & Leo · The Dark Square'},
  {
    name: 'description',
    content:
      'Meet Lily and Leo — curious, playful, chocolate-loving, and full of questions.',
  },
];

export default function Lily() {
  const [params, setParams] = useSearchParams();
  const mode = params.get('treatment') === 'b' ? 'b' : 'a';

  const setMode = (next: 'a' | 'b') => {
    const search = new URLSearchParams(params);
    if (next === 'a') search.delete('treatment');
    else search.set('treatment', next);
    setParams(search, {replace: true, preventScrollReset: true});
  };

  return (
    <main>
      <div className="lily__switch">
        <span className="lily__switch-label">Story treatment</span>
        <button
          className={'chip' + (mode === 'a' ? ' is-active' : '')}
          type="button"
          onClick={() => setMode('a')}
        >
          Storybook Spread
        </button>
        <button
          className={'chip' + (mode === 'b' ? ' is-active' : '')}
          type="button"
          onClick={() => setMode('b')}
        >
          Midnight Kitchen
        </button>
      </div>

      {/* Variation A — The Storybook Spread */}
      <div className="lily-a" hidden={mode !== 'a'}>
        <section className="lily-a__intro">
          <p className="lily-a__kicker">
            Where every chocolate becomes an adventure
          </p>
          <h1 className="lily-a__title">Welcome to Lily &amp; Leo’s world</h1>
          <p className="lily-a__lede">
            Meet Lily and Leo. They are curious. They are playful. They love
            chocolate. And they have a LOT of questions.
          </p>
        </section>

        <div>
          {SPREADS.map((sp, i) => (
            <section
              key={sp.title}
              className={'spread' + (i % 2 ? ' spread--tinted' : '')}
            >
              <div className="spread__inner">
                <div
                  className={'spread__figure' + (sp.flip ? ' is-flipped' : '')}
                >
                  <div className="spread__circle">
                    <div
                      className="spread__image"
                      role="img"
                      aria-label={sp.alt}
                      style={bgImageStyle(sp.img, 'center')}
                    ></div>
                  </div>
                </div>
                <div className={'spread__copy' + (sp.flip ? ' is-flipped' : '')}>
                  <p className="spread__caption">{sp.caption}</p>
                  <h2 className="spread__title">{sp.title}</h2>
                  <p className="spread__body">{sp.body}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="lily-a__questions">
          <div className="lily-a__question-list">
            {LILY_QUESTIONS.map((q) => (
              <p className="lily-a__question" key={q}>
                {q}
              </p>
            ))}
          </div>
          <p className="lily-a__last">
            And most importantly… who ate the last square?
          </p>
        </section>

        <section className="lily-a__cta">
          <p className="lily-a__soon">Coming soon</p>
          <p className="lily-a__soon-title">
            Lily &amp; Leo’s Chocolate Adventures
          </p>
          <p className="lily-a__soon-body">
            Stories · Games · Chocolate facts · Little surprises
          </p>
          <Link className="lily-a__button" to={href('shop')}>
            Find your square
          </Link>
        </section>
      </div>

      {/* Variation B — The Midnight Kitchen */}
      <div className="lily-b" hidden={mode !== 'b'}>
        <section className="lily-b__hero">
          <div>
            <p className="lily-b__kicker">
              Where every chocolate becomes an adventure
            </p>
            <h1 className="lily-b__title">Lily &amp; Leo</h1>
            <p className="lily-b__lede">
              They are curious. They are playful. They love chocolate. And they
              have a LOT of questions.
            </p>
          </div>
          <picture>
            <source srcSet="/assets/lilyleo-scene.avif" type="image/avif" />
            <source srcSet="/assets/lilyleo-scene.webp" type="image/webp" />
            <img
              className="lily-b__hero-image"
              src="/assets/lilyleo-scene.jpg"
              alt="Lily and Leo in chef’s hats and aprons beside the The Dark Square emblem, surrounded by cocoa pods and chocolate"
            />
          </picture>
        </section>

        <section className="lily-b__beats-section">
          <p className="lily-b__body">
            Lily &amp; Leo discover the world of The Dark Square one flavour at a
            time. Every adventure introduces them to a new chocolate, a new story
            and sometimes a little bit of chocolate-covered mischief.
          </p>
          <div className="lily-b__beats">
            {LILY_BEATS.map((b) => (
              <div className="beat" key={b.num}>
                <div className="beat__frame">
                  <div
                    className="beat__image"
                    role="img"
                    aria-label={b.alt}
                    style={bgImageStyle(b.img, 'center')}
                  ></div>
                </div>
                <p className="beat__num">{b.num}</p>
                <p className="beat__title">{b.title}</p>
                <p className="beat__body">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lily-b__cta">
          <div className="lily-b__cta-inner">
            <p className="lily-b__rule">
              Their favourite rule? There are no rules when it comes to choosing
              your favourite square.
            </p>
            <p className="lily-b__soon">
              Coming soon · Stories · Games · Chocolate facts
            </p>
            <Link className="btn-filled" to={href('shop')}>
              Find your square
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
