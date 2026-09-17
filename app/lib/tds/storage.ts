/**
 * storage.ts — guarded localStorage.
 *
 * Private-browsing modes and blocked site-data both make localStorage throw on
 * access rather than return null, so every call is wrapped. A failed read is
 * indistinguishable from "nothing stored", which is the behaviour every caller
 * here wants. On the server there is no window at all, which lands in the same
 * branch.
 */

const PREFIX = 'tds:';

function available() {
  try {
    const k = PREFIX + '__probe';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function read<T>(key: string, fallback: T): T {
  if (!available()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function write(key: string, value: unknown) {
  if (!available()) return false;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string) {
  if (!available()) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* nothing to do */
  }
}
