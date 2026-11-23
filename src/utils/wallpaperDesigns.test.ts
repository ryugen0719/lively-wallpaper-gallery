import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_DESIGN_CONFIGS,
  DESIGN_LIST,
  DESIGN_PRESETS,
  createRandomDesignConfig,
  getBackgroundColorForDesign,
  parseStudioUrlQuery,
  serializeStudioUrlQuery,
} from './wallpaperDesigns';
import { DEFAULT_CLOCK_CONFIG } from './wallpaperConfig';

test('all 13 React Bits designs exist and have curated presets including light mode', () => {
  assert.equal(DESIGN_LIST.length, 13);
  for (const design of DESIGN_LIST) {
    const presets = DESIGN_PRESETS[design.id];
    assert.ok(presets.length >= 4, `${design.id} should have at least 4 presets`);
    assert.ok(
      presets.some((p) => p.lightMode),
      `${design.id} should include a lightMode preset`
    );
  }
});

test('Lively Wallpaper URL serialization round-trips design, clock style/size/position, unlock guard, and hide flag', () => {
  const scannerPreset = DESIGN_PRESETS.scanner[1];
  const query = serializeStudioUrlQuery({
    designId: 'scanner',
    presetId: scannerPreset.id,
    config: scannerPreset.config,
    clock: {
      ...DEFAULT_CLOCK_CONFIG,
      position: 'bottom-right',
      size: 'lg',
      style: 'flip',
      showSeconds: true,
    },
    lively: true,
    autoHideSeconds: 5,
    uiUnlockMode: 'locked',
  });

  assert.ok(query.includes('lively=1'));
  assert.ok(query.includes('design=scanner'));
  assert.ok(query.includes('unlock=locked'));
  assert.ok(query.includes('cst=flip'));

  const parsed = parseStudioUrlQuery(query);
  assert.equal(parsed.hasParams, true);
  assert.equal(parsed.designId, 'scanner');
  assert.equal(parsed.presetId, scannerPreset.id);
  assert.equal(parsed.uiHidden, true);
  assert.equal(parsed.autoHideSeconds, 5);
  assert.equal(parsed.uiUnlockMode, 'locked');
  assert.equal(parsed.clock.position, 'bottom-right');
  assert.equal(parsed.clock.size, 'lg');
  assert.equal(parsed.clock.style, 'flip');
  assert.equal(parsed.clock.showSeconds, true);
});

test('parseStudioUrlQuery hides UI by default and parses unlock guard modes safely', () => {
  assert.equal(parseStudioUrlQuery('').uiHidden, true);
  assert.equal(parseStudioUrlQuery('').uiUnlockMode, 'triple-tap');
  assert.equal(parseStudioUrlQuery('?unlock=hold').uiUnlockMode, 'long-press');
  assert.equal(parseStudioUrlQuery('?unlock=corner').uiUnlockMode, 'corner-double');
  assert.equal(parseStudioUrlQuery('?unlock=locked').uiUnlockMode, 'locked');
  assert.equal(parseStudioUrlQuery('?unlock=invalid').uiUnlockMode, 'triple-tap');
  assert.equal(parseStudioUrlQuery('?zen=1').uiHidden, true);
  assert.equal(parseStudioUrlQuery('?clean=1').uiHidden, true);
  assert.equal(parseStudioUrlQuery('?lively=1').uiHidden, true);
  assert.equal(parseStudioUrlQuery('?ui=1').uiHidden, false);
  assert.equal(parseStudioUrlQuery('?edit=1').uiHidden, false);
  assert.equal(parseStudioUrlQuery('?lively=0').uiHidden, false);
});

test('createRandomDesignConfig returns valid configuration for every design', () => {
  let seed = 0.17;
  const rng = () => {
    seed = (seed + 0.31) % 1;
    return seed;
  };
  for (const design of DESIGN_LIST) {
    const cfg = createRandomDesignConfig(design.id, rng);
    assert.ok(cfg && typeof cfg === 'object');
    const bg = getBackgroundColorForDesign(design.id, {
      ...DEFAULT_DESIGN_CONFIGS,
      [design.id]: cfg,
    });
    assert.match(bg, /^#[0-9a-fA-F]{6}$/);
  }
});
