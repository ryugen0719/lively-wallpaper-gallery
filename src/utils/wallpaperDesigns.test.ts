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

test('all 7 React Bits designs exist and have curated presets including light mode', () => {
  assert.equal(DESIGN_LIST.length, 7);
  for (const design of DESIGN_LIST) {
    const presets = DESIGN_PRESETS[design.id];
    assert.ok(presets.length >= 4, `${design.id} should have at least 4 presets`);
    assert.ok(
      presets.some((p) => p.lightMode),
      `${design.id} should include a lightMode preset`
    );
  }
});

test('Lively Wallpaper URL serialization round-trips non-Beams design, clock, and lively=1 hide flag', () => {
  const auroraPreset = DESIGN_PRESETS.aurora[1];
  const query = serializeStudioUrlQuery({
    designId: 'aurora',
    presetId: auroraPreset.id,
    config: auroraPreset.config,
    clock: { ...DEFAULT_CLOCK_CONFIG, position: 'center', showSeconds: true },
    lively: true,
    autoHideSeconds: 5,
  });

  assert.ok(query.includes('lively=1'));
  assert.ok(query.includes('design=aurora'));

  const parsed = parseStudioUrlQuery(query);
  assert.equal(parsed.hasParams, true);
  assert.equal(parsed.designId, 'aurora');
  assert.equal(parsed.presetId, auroraPreset.id);
  assert.equal(parsed.uiHidden, true);
  assert.equal(parsed.autoHideSeconds, 5);
  assert.equal(parsed.clock.position, 'center');
  assert.equal(parsed.clock.showSeconds, true);
  assert.deepEqual(parsed.configs.aurora.colorStops, ['#5227ff', '#c084fc', '#38bdf8']);
});

test('parseStudioUrlQuery supports ?zen=1 and ?clean=1 aliases for complete UI hide', () => {
  assert.equal(parseStudioUrlQuery('?zen=1').uiHidden, true);
  assert.equal(parseStudioUrlQuery('?clean=1').uiHidden, true);
  assert.equal(parseStudioUrlQuery('?lively=1').uiHidden, true);
  assert.equal(parseStudioUrlQuery('').uiHidden, false);
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
