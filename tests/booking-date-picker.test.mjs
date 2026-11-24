import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function picker() {
  const states = [];
  let cursor = 0;
  let selected = '';
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
      return [states[index], value => { states[index] = value; }];
    },
    useRef: initial => ({ current: initial }),
    useId: () => 'calendar',
    useEffect() {},
  };
  const module = { exports: {} };
  const source = ts.transpileModule(readFileSync(new URL('../app/booking-date-picker.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name === 'react' ? react : require(name) });
  const render = () => {
    cursor = 0;
    return module.exports.default({ value: selected, onChange: value => { selected = value; }, min: '2026-11-24', lang: 'it', labelId: 'date' });
  };
  return { render, selected: () => selected };
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  const children = [tree.props?.children].flat(Infinity);
  return [tree, ...children.flatMap(nodes)];
}

test('calendar stays open for day clicks and fills all date segments', () => {
  const instance = picker();
  let tree = instance.render();
  assert.equal(tree.props.onBlur, undefined, 'blur must not remove the panel before a Safari button click');
  nodes(tree).find(node => node.props?.className === 'booking-calendar-toggle').props.onClick();
  tree = instance.render();
  const day = nodes(tree).find(node => node.type === 'button' && node.props.children === 25);
  day.props.onClick();
  assert.equal(instance.selected(), '25/11/2026');
  assert(!nodes(instance.render()).some(node => node.props?.className === 'booking-calendar-panel'));
});

test('month selector changes days; previous dates remain disabled', () => {
  const instance = picker();
  nodes(instance.render()).find(node => node.props?.className === 'booking-calendar-toggle').props.onClick();
  let tree = instance.render();
  assert(nodes(tree).find(node => node.type === 'button' && node.props.children === 23).props.disabled);
  nodes(tree).find(node => node.type === 'select' && node.props['aria-label'] === 'Mese').props.onChange({ target: { value: '12' } });
  tree = instance.render();
  nodes(tree).find(node => node.type === 'button' && node.props.children === 1).props.onClick();
  assert.equal(instance.selected(), '01/12/2026');
});
