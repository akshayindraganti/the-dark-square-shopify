/**
 * IntroLoader.tsx — the intro progress bar.
 *
 * Ported from components/loader.html and runLoader() in js/pages/home.js.
 * Purely decorative: it counts up in random steps and clears. Home page only —
 * a bar on every navigation would be worse than the single-page original.
 */

import {useEffect, useState} from 'react';

export function IntroLoader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let value = 0;
    const tick = setInterval(() => {
      value = Math.min(100, value + 4 + Math.random() * 9);
      setPct(value);
      if (value < 100) return;

      clearInterval(tick);
      timers.push(
        setTimeout(() => {
          setDone(true);
          timers.push(setTimeout(() => setGone(true), 500));
        }, 480),
      );
    }, 90);

    return () => {
      clearInterval(tick);
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={'loader' + (done ? ' is-done' : '')} id="loader">
      <div className="loader__inner">
        <p className="loader__brand">THE DARK SQUARE</p>
        <p className="loader__sub">ARTISAN CHOCOLATES</p>
        <p className="loader__label">Progress</p>

        <div className="loader__drip">
          <div className="loader__drip-stream"></div>
          <div className="loader__drip-pool"></div>
        </div>

        <div className="loader__track">
          <div className="loader__bar" style={{width: `${Math.round(pct)}%`}}></div>
        </div>

        <p className="loader__status">
          Flavours loading<span className="loader__dots">…</span>
        </p>
      </div>
    </div>
  );
}
