import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, filename);
const { normalizeMenu } = require('../app/content/menu-content.ts');
const { formatOpeningHours } = require('../app/content/opening-hours.ts');
const { cmsIsConfigured } = require('../lib/cms-configured.ts');
const menu = JSON.parse(readFileSync(new URL('../content/menu.json', import.meta.url)));
const hours = JSON.parse(readFileSync(new URL('../content/hours.json', import.meta.url)));

test('all existing menu content survives the CMS boundary', () => {
  assert.deepEqual(normalizeMenu(menu.sections), menu.sections);
});
test('CMS blank optional fields do not create zero prices or empty descriptions', () => {
  const [section] = normalizeMenu([{ title: { it: 'Test' }, items: [{ name: { it: 'Caffè', en: '' }, price: null, description: { it: '' }, allergens: [], priceNote: '' }] }]);
  assert.equal(section.items[0].name.en, 'Caffè');
  assert.equal(section.items[0].price, undefined);
  assert.equal(section.items[0].description, undefined);
  assert.equal(section.items[0].allergens, undefined);
});
test('invalid prices fail rather than publish incorrect amounts', () => {
  for (const price of [-1, '2', NaN]) assert.throws(() => normalizeMenu([{ title: { it: 'Test' }, items: [{ name: { it: 'Test' }, price }] }]));
});
test('weekly hours group matching adjacent days and react to an edited day', () => {
  const schedule = Object.fromEntries(Object.keys(hours).map(key => [key, { closed: false, opens: '06:00', closes: '21:30' }]));
  schedule.sunday.closed = true;
  assert.equal(formatOpeningHours(schedule, 'it'), 'Lun.–Sab. 6:00–21:30\nDom. chiuso');
  schedule.wednesday.closes = '20:00';
  assert.equal(formatOpeningHours(schedule, 'en'), 'Mon.–Tue. 6:00–21:30\nWed. 6:00–20:00\nThu.–Sat. 6:00–21:30\nSun. closed');
});
test('production admin stays closed until every credential is configured', () => {
  const keys = ['NODE_ENV', 'KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET', 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG'];
  const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    process.env.NODE_ENV = 'production';
    for (const key of keys.slice(1)) delete process.env[key];
    assert.equal(cmsIsConfigured(), false);
    for (const key of keys.slice(1)) process.env[key] = 'test-only';
    assert.equal(cmsIsConfigured(), true);
    delete process.env.KEYSTATIC_SECRET;
    assert.equal(cmsIsConfigured(), false);
  } finally {
    for (const key of keys) if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
  }
});
test('Keystatic reads all managed files with the configured schemas', async () => {
  const { createReader } = require('@keystatic/core/reader');
  const config = require('../keystatic.config.ts').default;
  const reader = createReader(process.cwd(), config);
  const parsedMenu = await reader.singletons.menu.read();
  const parsedHours = await reader.singletons.hours.read();
  assert.equal(parsedMenu.sections.length, menu.sections.length);
  assert.deepEqual(parsedHours, hours);
});
