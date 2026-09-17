/** faq.tsx — the question list, from src/pages/faq.html and js/pages/faq.js. */

import {Link} from 'react-router';
import type {Route} from './+types/faq';
import {FAQS} from '~/data/catalogue';
import {href} from '~/lib/tds/links';

export const meta: Route.MetaFunction = () => [
  {title: 'FAQ · The Dark Square'},
  {
    name: 'description',
    content:
      'Answers about our small-batch dark chocolate — custom orders, corporate gifting, storage and what’s coming next.',
  },
];

export default function Faq() {
  return (
    <main className="prose-page">
      <p className="page-kicker">Questions</p>
      <h1 className="page-title">Everything you might ask</h1>

      <div className="faq-list">
        {FAQS.map((item) => (
          <div className="faq-item" key={item.q}>
            <p className="faq-item__q">{item.q}</p>
            <p className="faq-item__a">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="faq-outro">
        <p className="faq-outro__note">Still wondering something?</p>
        <Link className="btn-ghost" to={href('contact')}>
          Get in touch
        </Link>
      </div>
    </main>
  );
}
