import test from "node:test";
import assert from "node:assert/strict";
import { inferAllergens, itemMatchesAnyAllergen, toggleAllergenFilter } from "../.test-dist/menu-logic.js";

const known = new Set([
  "latte",
  "uova",
  "soia",
  "pesce",
  "crostacei",
  "sedano",
  "molluschi",
  "solfiti",
  "lupini",
  "senape",
  "sesamo",
  "glutine",
  "frutta_guscio",
  "alcol",
  "congelato",
  "vegano",
  "vegetariano",
  "halal",
  "kosher",
  "bio",
  "piccante",
  "abbattuto",
]);

const order = {
  latte: 0,
  uova: 1,
  soia: 2,
  pesce: 3,
  crostacei: 4,
  sedano: 5,
  molluschi: 6,
  glutine: 7,
  alcol: 8,
};

function makeText(it) {
  return { it, en: it, fr: it, de: it, es: it };
}

test("inferAllergens adds alcohol for wine sections", () => {
  const section = { title: makeText("Vini Bianchi"), items: [] };
  const item = { name: makeText("Cremant brut") };
  const result = inferAllergens(section, item, { knownAllergens: known, sortOrder: order });
  assert.deepEqual(result, ["alcol"]);
});

test("inferAllergens applies seafood and manual remove override", () => {
  const section = { id: "pesce", title: makeText("Pesce"), items: [] };
  const item = {
    name: makeText("Carpaccio di piovra"),
    allergens: ["molluschi"],
    allergenRemove: ["pesce"],
  };
  const result = inferAllergens(section, item, { knownAllergens: known, sortOrder: order });
  assert.deepEqual(result, ["molluschi"]);
});

test("toggleAllergenFilter toggles selected key", () => {
  assert.deepEqual(toggleAllergenFilter([], "pesce"), ["pesce"]);
  assert.deepEqual(toggleAllergenFilter(["pesce", "latte"], "pesce"), ["latte"]);
});

test("itemMatchesAnyAllergen matches OR logic across selected allergens", () => {
  const item = { name: makeText("Salmone e Philadelphia"), allergens: ["pesce", "latte"] };
  assert.equal(itemMatchesAnyAllergen(item, new Set(["molluschi", "latte"])), true);
  assert.equal(itemMatchesAnyAllergen(item, new Set(["molluschi"])), false);
});
