import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, mocks, extras = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
  }).outputText, { module, exports: module.exports, require: name => mocks[name] || {}, URL, ...extras });
  return module.exports;
}

test('old, absent, invalid or inaccessible stored consent never authorizes analytics', () => {
  let stored = null;
  const { readPreferences } = load('../app/cookie-consent.tsx', { react: { createContext: () => ({}) } }, {
    window: { localStorage: { getItem: () => stored } }
  });
  for (const value of [null, 'accepted', 'rejected', '{}', '{"maps":true}', 'false']) {
    stored = value;
    assert.equal(readPreferences(), null);
  }
  stored = '{"maps":true,"analytics":false}';
  assert.equal(readPreferences().analytics, false);
  stored = '{"maps":false,"analytics":true}';
  assert.equal(readPreferences().analytics, true);
});

test('analytics waits for explicit consent, excludes admin and strips URL parameters', () => {
  let state = { isReady: false, analytics: false };
  let persisted = { analytics: true };
  const env = { NODE_ENV: 'production' };
  const { SiteAnalytics } = load('../app/site-analytics.tsx', {
    './cookie-consent': { useCookieConsent: () => state, readPreferences: () => persisted },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    '@vercel/analytics/react': { Analytics: () => null }
  }, { process: { env } });
  assert.equal(SiteAnalytics(), null);
  state = { isReady: true, analytics: false };
  assert.equal(SiteAnalytics(), null);
  state.analytics = true;
  const send = SiteAnalytics().props.beforeSend;
  assert.equal(send({ url: 'https://www.bardaluciano.it/menu?email=test#private' }).url, 'https://www.bardaluciano.it/menu');
  for (const path of ['/admin', '/keystatic', '/keystatic/branch/main', '/api/keystatic']) {
    assert.equal(send({ url: 'https://www.bardaluciano.it' + path }), null);
  }
  persisted = { analytics: false };
  assert.equal(send({ url: 'https://www.bardaluciano.it/' }), null);
  persisted = null;
  assert.equal(send({ url: 'https://www.bardaluciano.it/' }), null);
  env.NODE_ENV = 'development';
  assert.equal(SiteAnalytics(), null);
});
