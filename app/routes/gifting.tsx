/**
 * gifting.tsx — the three gift routes and the corporate list.
 *
 * Ported from src/pages/gifting.html and js/pages/gifting.js.
 */

import {Link} from 'react-router';
import type {Route} from './+types/gifting';
import {CORP_LIST, GIFT_ROUTES} from '~/data/catalogue';
import {bgImageStyle} from '~/lib/tds/format';
import {href, type PageKey} from '~/lib/tds/links';

export const meta: Route.MetaFunction = () => [
  {title: 'Gifting · The Dark Square'},
  {
    name: 'description',
    content:
      'Chocolate gifts for celebrations, weddings and corporate occasions — handcrafted, thoughtfully packed, shipped across India.',
  },
];

export default function Gifting() {
  return (
    <main className="page">
      <p className="page-kicker">Gifting</p>
      <h1 className="gift__title">
        Chocolate is always
        <br />
        <span className="gift__title-em">a good idea.</span>
      </h1>
      <p className="gift__lede">
        Especially when it’s given with a little thought.
      </p>
      <p className="gift__sub">
        For birthdays. For celebrations. For milestones. For thank-yous. For
        clients. For teams. For festivals. For someone who needs cheering up. Or
        for absolutely no reason at all.
      </p>

      <div className="gift__routes">
        {GIFT_ROUTES.map((g) => (
          <div className="gift-card" key={g.title}>
            <div
              className="gift-card__tile"
              style={bgImageStyle(g.img, 'center 20%')}
            ></div>
            <div className="gift-card__body">
              <p className="gift-card__title">{g.title}</p>
              <p className="gift-card__text">{g.body}</p>
              <Link className="gift-card__cta" to={href(g.href as PageKey)}>
                {g.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="corp">
        <div>
          <p className="page-kicker">Corporate gifting</p>
          <h2 className="corp__title">
            Make your next gift a little more memorable.
          </h2>
          <p className="corp__body">
            A thoughtful gift doesn’t need to be complicated. Our handcrafted
            chocolates make a warm, elegant addition to any occasion.
          </p>
          <p className="corp__body corp__body--muted">
            We can also explore customised chocolate and personalised packaging
            for larger orders.
          </p>
          <Link className="btn-filled" to={href('contact')}>
            Talk to us
          </Link>
        </div>
        <div className="corp__list">
          {CORP_LIST.map((item) => (
            <p className="corp__item" key={item}>
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
