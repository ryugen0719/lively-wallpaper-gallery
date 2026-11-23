import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BEAMS_CONFIG,
  DEFAULT_CLOCK_CONFIG,
  WALLPAPER_PRESETS,
  buildWallpaperFilename,
  createRandomConfig,
  formatJapaneseClock,
  parseConfigFromQuery,
  sanitizeBeamsConfig,
  serializeConfigToQuery,
} from './wallpaperConfig';

test('sanitizeBeamsConfig clamps out-of-range numbers and validates hex colors', () => {
  const result = sanitizeBeamsConfig({
    color: 'not-a-color',
    backgroundColor: '#123ABC',
    beamWidth: 999,
    rotation: -400,
    speed: -5,
    sharpness: 3.5,
    twist: 5,
    grain: -1,
    fade: 2,
    brightness: 0.01,
  });

  assert.equal(result.color, DEFAULT_BEAMS_CONFIG.color);
  assert.equal(result.backgroundColor, '#123abc');
  assert.equal(result.beamWidth, 320);
  assert.equal(result.rotation, -180);
  assert.equal(result.speed, 0);
  assert.equal(result.sharpness, 1);
  assert.equal(result.twist, 2);
  assert.equal(result.grain, 0);
  assert.equal(result.fade, 0.6);
  assert.equal(result.brightness, 0.4);
});

test('URL query serialization and parsing round-trips BeamsConfig, ClockConfig, and zen mode', () => {
  const samplePreset = WALLPAPER_PRESETS.find((p) => p.id === 'washi-ink')!;
  const clock = {
    position: 'center' as const,
    use24Hour: false,
    showSeconds: true,
    showDate: true,
    osFrame: 'none' as const,
  };

  const query = serializeConfigToQuery(samplePreset.config, clock, true);
  const parsed = parseConfigFromQuery(query);

  assert.equal(parsed.hasCustomParams, true);
  assert.equal(parsed.zen, true);
  assert.equal(parsed.config.color, samplePreset.config.color);
  assert.equal(parsed.config.backgroundColor, samplePreset.config.backgroundColor);
  assert.equal(parsed.config.lightMode, true);
  assert.equal(parsed.config.beamWidth, samplePreset.config.beamWidth);
  assert.equal(parsed.config.rotation, samplePreset.config.rotation);
  assert.equal(parsed.clock.position, 'center');
  assert.equal(parsed.clock.use24Hour, false);
  assert.equal(parsed.clock.showSeconds, true);
});

test('parseConfigFromQuery falls back cleanly on empty query', () => {
  const parsed = parseConfigFromQuery('');
  assert.equal(parsed.hasCustomParams, false);
  assert.equal(parsed.zen, false);
  assert.deepEqual(parsed.config, DEFAULT_BEAMS_CONFIG);
  assert.deepEqual(parsed.clock, DEFAULT_CLOCK_CONFIG);
});

test('createRandomConfig stays within valid studio bounds deterministically', () => {
  let step = 0.1;
  const fakeRng = () => {
    step = (step + 0.23) % 1;
    return step;
  };
  const cfg = createRandomConfig(fakeRng);

  assert.match(cfg.color, /^#[0-9a-f]{6}$/);
  assert.match(cfg.backgroundColor, /^#[0-9a-f]{6}$/);
  assert.ok(cfg.beamWidth >= 30 && cfg.beamWidth <= 320);
  assert.ok(cfg.rotation >= -180 && cfg.rotation <= 180);
  assert.ok(cfg.brightness >= 0.4 && cfg.brightness <= 3);
});

test('buildWallpaperFilename sanitizes slug and appends resolution and format', () => {
  assert.equal(
    buildWallpaperFilename('Obsidian White!!', 3840, 2160, 'png'),
    'kosen-obsidian-white-3840x2160.png'
  );
  assert.equal(
    buildWallpaperFilename('', 2560, 1440, 'jpeg'),
    'kosen-custom-2560x1440.jpg'
  );
});

test('formatJapaneseClock formats 24h and 12h modes with Japanese date', () => {
  const sampleDate = new Date(2026, 10, 22, 16, 5, 9); // 2026-11-22 (Sun) 16:05:09

  const f24 = formatJapaneseClock(sampleDate, true, false);
  assert.equal(f24.timeText, '16:05');
  assert.equal(f24.periodText, '');
  assert.equal(f24.dateText, '2026年11月22日 (日)');

  const f12 = formatJapaneseClock(sampleDate, false, true);
  assert.equal(f12.timeText, '04:05:09');
  assert.equal(f12.periodText, 'PM');
});
