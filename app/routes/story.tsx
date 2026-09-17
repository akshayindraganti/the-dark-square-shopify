/**
 * story.tsx — Our Story.
 *
 * Ported from src/pages/story.html and js/pages/story.js. `flip` on a block
 * swaps the figure and copy columns, as the `is-flipped` modifier.
 */

import type {Route} from './+types/story';
import {STORY_BLOCKS} from '~/data/catalogue';
import {bgImageStyle} from '~/lib/tds/format';

export const meta: Route.MetaFunction = () => [
  {title: 'Our Story · The Dark Square'},
  {
    name: 'description',
    content:
      'It started with chocolate — a love of making it, a five-year pause, and the second chapter that became The Dark Square.',
  },
];

export default function Story() {
  return (
    <main className="story">
      <section className="story__hero">
        <div>
          <p className="page-kicker">Our story</p>
          <h1 className="story__title">
            It started
            <br />
            <span className="story__title-em">with chocolate.</span>
          </h1>
          <div className="story__intro">
            <p className="story__intro-lead">
              Before The Dark Square had a name, there was simply a love for
              making chocolate. For years, chocolate-making was a creative
              journey — experimenting with flavours, making handmade chocolates
              and watching people’s faces light up when they tasted them.
            </p>
            <p className="story__intro-body">
              Then life happened. The chocolate-making stopped. For five years,
              there was a pause. But the love for chocolate never really left.
            </p>
            <p className="story__intro-note">And then came the second chapter.</p>
          </div>
        </div>

        <figure className="story__figure">
          <div
            className="story__hero-image"
            role="img"
            aria-label="Three moments side by side: Lily and Leo filling a chocolate mould, the same kitchen empty and still during the pause, and the two of them back at a finished tray of chocolates"
            style={bgImageStyle('assets/story/story-hero.jpg', 'center')}
          ></div>
          <figcaption className="story__caption">
            Before the pause · the quiet years · and after.
          </figcaption>
        </figure>
      </section>

      <div>
        {STORY_BLOCKS.map((b) => (
          <section
            key={b.title}
            className={'story-block' + (b.flip ? ' is-flipped' : '')}
          >
            <div className="story-block__figure">
              <div
                className="story-block__tile"
                role="img"
                aria-label={b.alt}
                style={bgImageStyle(b.img, 'center')}
              ></div>
            </div>
            <div className="story-block__copy">
              <p className="story-block__kicker">{b.kicker}</p>
              <h2 className="story-block__title">{b.title}</h2>
              <p className="story-block__body">{b.body}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
