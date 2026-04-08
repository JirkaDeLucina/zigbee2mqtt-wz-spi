const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const libColor = require('zigbee-herdsman-converters/lib/color');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const utils = require('zigbee-herdsman-converters/lib/utils');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const e = exposes.presets;

// ============================================================================
// LED STRIP CONFIGURATION:
// a) SK6812 24V RGBW+WW → chip_type=SK6812, light_bead_sequence=GRBW or WRGB
// b) WS2814 24V RGBW+NW → chip_type=WS2814 / SK6812 (RGBW), light_bead_sequence=RGBW or GRBW
// Pixel count = number of addressable pixels (e.g., 40cm strip cut every 10cm = 4 pixels)
// ============================================================================

// Default values for reset functionality
const DEFAULTS = {
    brightness: 127, color_temp: 500, lightpixel_number_set: 150,
    music_sensitivity: 50, countdown: 0, scene_speed: 50,
};

// ============================================================================
// SCENES
// ============================================================================
const SCENE_DATA = {
    // --- Preset scenes ---
    ice_land_blue:    [0x01,0x15,0x0a,0x52,0x52,0xe0,0x00,0x00,0x64,0x00,0xc1,0x61,0x00,0xb4,0x30,0x00,0xb5,0x52,0x00,0xc4,0x63],
    glacier_express:  [0x01,0x16,0x0a,0x64,0x64,0x60,0x00,0x00,0x64,0x00,0x92,0x5f,0x00,0xc6,0x60],
    sea_of_clouds:    [0x01,0x17,0x03,0x5e,0x5e,0x60,0x00,0x00,0x64,0x00,0x38,0x2f,0x00,0x1e,0x5c,0x00,0xd5,0x45,0x01,0x1a,0x64],
    fireworks_at_sea: [0x01,0x18,0x02,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0xb2,0x39,0x01,0x0a,0x64,0x01,0x2d,0x64,0x01,0x3f,0x64],
    firefly_night:    [0x01,0x1a,0x03,0x4b,0x4b,0xe0,0x00,0x00,0x64,0x00,0xe0,0x39,0x01,0x09,0x53],
    grass_land:       [0x01,0x1c,0x0a,0x5a,0x5a,0xe0,0x00,0x00,0x52,0x00,0x9d,0x64,0x00,0x8e,0x64],
    northern_lights:  [0x01,0x1d,0x03,0x52,0x52,0xe0,0x00,0x00,0x64,0x00,0xae,0x64,0x00,0xa6,0x64,0x00,0xc1,0x64,0x00,0xcc,0x64],
    late_autumn:      [0x01,0x1e,0x0a,0x52,0x52,0xe0,0x00,0x00,0x64,0x00,0x19,0x64,0x00,0x22,0x5e,0x00,0x2c,0x5b,0x00,0x14,0x64,0x00,0x0c,0x64],
    game:             [0x01,0x1f,0x02,0x5f,0x5f,0x60,0x00,0x00,0x64,0x01,0x10,0x64,0x00,0xd2,0x64,0x00,0xad,0x64,0x00,0x8b,0x64],
    holiday:          [0x01,0x20,0x0a,0x55,0x55,0x60,0x00,0x00,0x64,0x00,0xc2,0x58,0x01,0x3e,0x33,0x00,0xff,0x46,0x01,0x1d,0x64],
    party:            [0x01,0x22,0x04,0x64,0x64,0x60,0x00,0x00,0x64,0x00,0xd7,0x5c,0x00,0xbc,0x53,0x00,0x37,0x1e,0x00,0x2c,0x3f,0x01,0x61,0x3f],
    trend:            [0x01,0x23,0x02,0x64,0x64,0x60,0x00,0x00,0x64,0x01,0x08,0x4b,0x00,0xb1,0x2f,0x00,0xcd,0x57],
    meditation:       [0x01,0x25,0x03,0x43,0x43,0x60,0x00,0x00,0x64,0x00,0xb7,0x35,0x00,0x9b,0x54,0x00,0xcd,0x61],
    dating:           [0x01,0x26,0x01,0x59,0x59,0xe0,0x00,0x00,0x64,0x01,0x19,0x47,0x01,0x49,0x3d,0x00,0xcd,0x61,0x00,0x26,0x64],
    valentines_day:   [0x01,0x2a,0x01,0x64,0x64,0x60,0x00,0x00,0x64,0x01,0x15,0x64,0x01,0x05,0x64,0x01,0x45,0x64,0x01,0x2f,0x64],
    neon_world:       [0x01,0x37,0x0a,0x5a,0x5a,0x60,0x00,0x00,0x64,0x00,0x33,0x58,0x00,0x18,0x64,0x01,0x00,0x45,0x00,0xe3,0x5e,0x00,0xac,0x30],
    // --- Slow smooth scenes ---
    warm_flow:        [0x01,0x40,0x0a,0x62,0x5a,0xe0,0x00,0x00,0x64,0x00,0x1e,0x64,0x00,0x14,0x5a,0x00,0x2d,0x50,0x00,0x0a,0x64],
    ocean_wave:       [0x01,0x41,0x0a,0x62,0x58,0xe0,0x00,0x00,0x64,0x00,0xb4,0x64,0x00,0xc8,0x58,0x00,0xd2,0x4b,0x00,0xa0,0x60],
    sunset_dream:     [0x01,0x42,0x03,0x64,0x5a,0xe0,0x00,0x00,0x64,0x00,0x14,0x64,0x00,0x23,0x5a,0x01,0x18,0x50,0x00,0x05,0x64],
    forest_breath:    [0x01,0x43,0x02,0x5c,0x50,0xe0,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0x87,0x50,0x00,0x5a,0x5a],
    purple_haze:      [0x01,0x44,0x0a,0x62,0x55,0xe0,0x00,0x00,0x64,0x01,0x0e,0x64,0x01,0x22,0x50,0x00,0xf0,0x5a],
    candlelight:      [0x01,0x45,0x02,0x5a,0x40,0xe0,0x00,0x00,0x64,0x00,0x1e,0x50,0x00,0x14,0x3c],
    moonlit_sky:      [0x01,0x46,0x03,0x64,0x40,0xe0,0x00,0x00,0x64,0x00,0xd2,0x40,0x00,0xe6,0x30,0x00,0xc8,0x45],
    lavender_field:   [0x01,0x47,0x0a,0x62,0x50,0xe0,0x00,0x00,0x64,0x01,0x04,0x50,0x01,0x18,0x55,0x01,0x30,0x4b],
    // --- Pixel scenes — meteor (0x05) — moving point with trail ---
    pixel_red:        [0x01,0x50,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0x00,0x64,0x00,0x00,0x64],
    pixel_orange:     [0x01,0x51,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0x1e,0x64,0x00,0x1e,0x64],
    pixel_yellow:     [0x01,0x52,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0x3c,0x64,0x00,0x3c,0x64],
    pixel_green:      [0x01,0x53,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0x78,0x64],
    pixel_cyan:       [0x01,0x54,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0xb4,0x64,0x00,0xb4,0x64],
    pixel_blue:       [0x01,0x55,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0xf0,0x64,0x00,0xf0,0x64],
    pixel_purple:     [0x01,0x56,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x01,0x0e,0x64,0x01,0x0e,0x64],
    pixel_pink:       [0x01,0x57,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x01,0x4a,0x64,0x01,0x4a,0x64],
    pixel_white:      [0x01,0x58,0x05,0x64,0x64,0xe0,0x00,0x00,0x64,0x00,0x00,0x00,0x00,0x00,0x00],
};

const MUSIC_DATA = {
    rock:     [0x01,0x01,0x00,0x03,0x64,0x32,0x01,0x00,0x00,0x64,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0xf0,0x64,0x00,0x3c,0x64,0x00,0xb4,0x64,0x01,0x2c,0x64,0x00,0x00,0x00],
    jazz:     [0x01,0x01,0x00,0x02,0x64,0x32,0x01,0x00,0x00,0x64,0x00,0x00,0x50,0x00,0x78,0x50,0x00,0xf0,0x50,0x00,0x3c,0x50,0x00,0xb4,0x50,0x01,0x2c,0x50,0x00,0x00,0x00],
    classic:  [0x01,0x01,0x00,0x12,0x64,0x32,0x01,0x00,0x00,0x64,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0xf0,0x64,0x00,0x3c,0x64,0x00,0xb4,0x64,0x01,0x2c,0x64,0x00,0x00,0x00],
    rolling:  [0x01,0x01,0x01,0x12,0x64,0x32,0x01,0x00,0x00,0x64,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0xf0,0x64,0x00,0x3c,0x64,0x00,0xb4,0x64,0x01,0x2c,0x64,0x00,0x00,0x00],
    energy:   [0x01,0x01,0x02,0x12,0x64,0x32,0x01,0x00,0x00,0x64,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0xf0,0x64,0x00,0x3c,0x64,0x00,0xb4,0x64,0x01,0x2c,0x64,0x00,0x00,0x00],
    spectrum: [0x01,0x01,0x03,0x12,0x64,0x32,0x01,0x00,0x00,0x64,0x00,0x00,0x64,0x00,0x78,0x64,0x00,0xf0,0x64,0x00,0x3c,0x64,0x00,0xb4,0x64,0x01,0x2c,0x64,0x00,0x00,0x00],
};

const BRIGHTNESS_PRESETS = { '5%':13, '15%':38, '25%':64, '50%':127, '75%':191, '100%':254 };

const localValueConverter = {
    scene_data_converter: {
        to: (v) => { const d = SCENE_DATA[v]; if (!d) throw new Error(`Unknown scene: ${v}`); return d; },
        from: (v) => {
            // Identify scene by unique ID byte (byte 1), NOT whole data
            // Because byte 3 (speed) can be modified by the user via scene_speed
            const data = Buffer.isBuffer(v) ? Array.from(v) : v;
            if (!data || data.length < 2) return null;
            const sceneId = data[1];
            for (const [name, sd] of Object.entries(SCENE_DATA)) {
                if (sd[1] === sceneId) return name;
            }
            return null;
        },
    },
    music_data_converter: {
        to: (v) => { const d = MUSIC_DATA[v]; if (!d) throw new Error(`Unknown music mode: ${v}`); return d; },
        from: (v) => { const data = Buffer.isBuffer(v)?Array.from(v):v; for (const [n,m] of Object.entries(MUSIC_DATA)) { if (data.length>=4&&data[0]===m[0]&&data[1]===m[1]&&data[2]===m[2]&&data[3]===m[3]) return n; } return null; },
    },
};

// Helper function: convert Z2M brightness(0-254) -> device(10-1000)
function z2mToDevice(z2m) { return Math.max(10, Math.min(1000, Math.round(utils.mapNumberRange(Math.max(0,Math.min(254,z2m)), 0, 254, 10, 1000)))); }

// Speed conversion: UI 0-100 -> device 50-100 (below 50 is too slow to be smooth)
function uiSpeedToDevice(ui) { return Math.max(50, Math.min(100, 50 + Math.round(Number(ui) / 2))); }

// Effect mapping according to GitHub issue #23991 — Gradient = 0x01 (0x00 = unknown/none)
const EFFECT_MAP = {
    gradient:0x01, jump:0x02, breathe:0x03, flashing:0x04,
    meteor:0x05, pile_up:0x06, falling:0x07, follow:0x08,
    flutter:0x09, flowing:0x0a, rainbow:0x0b, flash:0x0c,
    rebound:0x0d, shuttle:0x0e, random:0x0f, switch:0x10
};

// Flags (byte 5) based on analysis of working scenes
// 0xe0 = directional effects (flowing, flutter, meteor, etc.)
// 0x60 = segment effects (gradient, jump, breathe, flashing, flash)
const EFFECT_FLAGS = {
    gradient:0x60, jump:0x60, breathe:0x60, flashing:0x60, flash:0x60,
    flowing:0xe0, rainbow:0xe0, follow:0xe0, flutter:0xe0, meteor:0xe0,
    pile_up:0xe0, falling:0xe0, rebound:0x60, shuttle:0x60, random:0x60, switch:0x60
};

const tzLocal = {
    // Scene selection + scene speed (merged into a single converter)
    wzspi_scene: {
        key: ['scene', 'scene_speed'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            if (meta.state?.work_mode !== 'scene') await tuya.sendDataPointEnum(ep, 2, 2);
            let sceneName, userSpd;
            if (key === 'scene') {
                sceneName = value;
                userSpd = meta.state?.scene_speed;
            } else {
                sceneName = meta.state?.scene || 'ice_land_blue';
                userSpd = Number(value);
            }
            const sd = SCENE_DATA[sceneName];
            if (!sd) throw new Error(`Unknown scene: ${sceneName}`);
            const payload = [...sd];
            // Bytes 3+4 = speed (both identical!) according to GitHub reference
            if (userSpd !== undefined && userSpd !== null && !isNaN(userSpd)) {
                const s = uiSpeedToDevice(userSpd);
                payload[3] = s;
                payload[4] = s;
            }
            // Byte 8 = brightness (0-100%)
            const briPct = Math.max(1, Math.min(100, Number(meta.state?.brightness_manual ?? Math.round((meta.state?.brightness ?? 254) / 254 * 100))));
            payload[8] = Math.round(briPct);

            await tuya.sendDataPointRaw(ep, 51, Buffer.from(payload));
            const st = { state: 'ON', work_mode: 'scene', scene: sceneName };
            if (key === 'scene_speed') st.scene_speed = Math.max(0, Math.min(100, Number(value)));
            return { state: st };
        },
    },

    // ═══════════════════════════════════════════════════════════════
    // CUSTOM SCENE GENERATOR
    // Main color = Fallback color. Used only if colors 1-4 are unused.
    // Colors 1-4 = Explicit colors that REPLACE the main color.
    //   Value -1 = color is not used.
    //   If no explicit colors are set = monochromatic effect.
    //   Protocol requires min 2 colors → the last one is duplicated if necessary.
    // ═══════════════════════════════════════════════════════════════
    wzspi_scene_gen: {
        key: ['scene_gen_effect', 'scene_gen_effect2', 'scene_gen_effect3',
              'scene_gen_hue', 'scene_gen_main_sat', 'scene_gen_speed',
              'scene_gen_color1', 'scene_gen_color2', 'scene_gen_color3', 'scene_gen_color4',
              'scene_gen_sat1', 'scene_gen_sat2', 'scene_gen_sat3', 'scene_gen_sat4'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];

            // ── One-time migration — clear stale values from older versions ──
            if (!meta.state?._scene_gen_v3) {
                meta.state = meta.state || {};
                for (let i = 1; i <= 4; i++) {
                    if (key !== `scene_gen_color${i}`) meta.state[`scene_gen_color${i}`] = -1;
                    if (key !== `scene_gen_sat${i}`) delete meta.state[`scene_gen_sat${i}`];
                }
                if (key !== 'scene_gen_main_sat') delete meta.state.scene_gen_main_sat;
                delete meta.state.scene_gen_main_white;
                delete meta.state.scene_gen_white1;
                delete meta.state.scene_gen_white2;
                delete meta.state.scene_gen_white3;
                delete meta.state.scene_gen_white4;
                delete meta.state.scene_gen_saturation;
                delete meta.state.scene_gen_sat;
                delete meta.state.scene_gen_brightness;
            }

            // ── Effect — save to correct group ──
            let eff, effKey;
            if (key === 'scene_gen_effect')  { eff = value; effKey = 'scene_gen_effect'; }
            else if (key === 'scene_gen_effect2') { eff = value; effKey = 'scene_gen_effect2'; }
            else if (key === 'scene_gen_effect3') { eff = value; effKey = 'scene_gen_effect3'; }
            else {
                if (meta.state?.scene_gen_effect3) { eff = meta.state.scene_gen_effect3; effKey = 'scene_gen_effect3'; }
                else if (meta.state?.scene_gen_effect2) { eff = meta.state.scene_gen_effect2; effKey = 'scene_gen_effect2'; }
                else if (meta.state?.scene_gen_effect) { eff = meta.state.scene_gen_effect; effKey = 'scene_gen_effect'; }
                else { eff = 'flutter'; effKey = 'scene_gen_effect'; }
            }

            // ── Speed (UI 0-100 -> device 50-100) ──
            const spdUi = Math.max(0, Math.min(100, Number(key === 'scene_gen_speed' ? value : (meta.state?.scene_gen_speed ?? 50))));
            const spd = uiSpeedToDevice(spdUi);

            // ── Brightness — use current brightness from main slider ──
            const briPct = Math.max(1, Math.min(100, Number(meta.state?.brightness_manual ?? Math.round((meta.state?.brightness ?? 254) / 254 * 100))));

            // ── Main color (scene_gen_hue) ──
            let mainHue;
            if (key === 'scene_gen_hue') mainHue = Number(value);
            else if (meta.state?.scene_gen_hue !== undefined && meta.state?.scene_gen_hue !== null) mainHue = Number(meta.state.scene_gen_hue);
            else mainHue = Number(meta.state?.color?.hue ?? 0);
            mainHue = Math.max(0, Math.min(360, Math.round(mainHue)));

            // ── Main saturation (scene_gen_main_sat) ──
            let mainSat;
            if (key === 'scene_gen_main_sat') {
                mainSat = Number(value);
            } else {
                const sv = meta.state?.scene_gen_main_sat;
                mainSat = (sv !== undefined && sv !== null && sv > 0) ? Number(sv) : 100;
            }
            mainSat = Math.max(0, Math.min(100, Math.round(mainSat)));

            // ── Color N — returns null if unset (-1) ──
            const getColor = (n) => {
                const k = `scene_gen_color${n}`;
                const v = key === k ? Number(value) : Number(meta.state?.[k] ?? -1);
                return isNaN(v) || v < 0 ? null : Math.max(0, Math.min(360, Math.round(v)));
            };

            // ── Saturation for Color N — EACH COLOR HAS ITS OWN INDEPENDENT SATURATION ──
            const getSat = (n) => {
                const k = `scene_gen_sat${n}`;
                if (key === k) return Math.max(0, Math.min(100, Math.round(Number(value))));
                const v = meta.state?.[k];
                if (v === undefined || v === null || Number(v) <= 0) return 100;
                return Math.max(0, Math.min(100, Math.round(Number(v))));
            };

            // ── Build payload ──
            // Colors 1-4 REPLACE the main color (if at least one is explicitly set).
            // Main color is used ONLY if all colors 1-4 are set to -1.
            const activeColors = [];
            const c1set = getColor(1);
            const c2set = getColor(2);
            const c3set = getColor(3);
            const c4set = getColor(4);
            if (c1set !== null) activeColors.push({ hue: c1set, sat: getSat(1) });
            if (c2set !== null) activeColors.push({ hue: c2set, sat: getSat(2) });
            if (c3set !== null) activeColors.push({ hue: c3set, sat: getSat(3) });
            if (c4set !== null) activeColors.push({ hue: c4set, sat: getSat(4) });
            // No color 1-4 is set -> use main color fallback
            if (activeColors.length === 0) {
                activeColors.push({ hue: mainHue, sat: mainSat });
            }
            // Payload needs at least 2 colors -> duplicate the last one if necessary
            while (activeColors.length < 2) {
                activeColors.push({ ...activeColors[activeColors.length - 1] });
            }

            // ── Effect bytes ──
            const effectByte = EFFECT_MAP[eff] || 0x09;
            const flagsByte = EFFECT_FLAGS[eff] || 0xe0;

            // ── Transmission ──
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            if (meta.state?.work_mode !== 'scene') await tuya.sendDataPointEnum(ep, 2, 2);

            // Payload bytes: byte 8 = brightness (1-100%)
            const payload = [0x01, 0xFE, effectByte, spd, spd, flagsByte, 0x00, 0x00, Math.round(briPct)];
            for (const c of activeColors) {
                payload.push((c.hue >> 8) & 0xff, c.hue & 0xff, c.sat);
            }
            await tuya.sendDataPointRaw(ep, 51, Buffer.from(payload));

            // ── State ──
            const st = {
                state: 'ON', work_mode: 'scene',
                _scene_gen_v3: true,
                scene_gen_hue: mainHue,
                scene_gen_main_sat: mainSat,
                scene_gen_speed: spdUi,
                scene_gen_color1: c1set ?? -1, scene_gen_sat1: getSat(1),
                scene_gen_color2: c2set ?? -1, scene_gen_sat2: getSat(2),
                scene_gen_color3: c3set ?? -1, scene_gen_sat3: getSat(3),
                scene_gen_color4: c4set ?? -1, scene_gen_sat4: getSat(4),
            };
            // Effect: save to correct key, clear others -> Z2M will display the selection correctly
            st.scene_gen_effect = effKey === 'scene_gen_effect' ? eff : undefined;
            st.scene_gen_effect2 = effKey === 'scene_gen_effect2' ? eff : undefined;
            st.scene_gen_effect3 = effKey === 'scene_gen_effect3' ? eff : undefined;
            return { state: st };
        },
    },


    wzspi_music: {
        key: ['music_mode', 'music_sensitivity'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            if (meta.state?.work_mode !== 'music') await tuya.sendDataPointEnum(ep, 2, 3);
            let mode = String(meta.state?.music_mode || 'rock');
            let sens = Number(meta.state?.music_sensitivity) || 50;
            if (key === 'music_mode') mode = String(value); else sens = Number(value);
            const base = MUSIC_DATA[mode];
            if (!base) throw new Error(`Unknown mode: ${mode}`);
            const briPct = Math.max(1, Math.min(100, Number(meta.state?.brightness_manual ?? Math.round((meta.state?.brightness ?? 254) / 254 * 100))));
            const p = [...base]; 
            p[4] = Math.round(briPct); // Byte 4 = brightness (1-100%)
            p[5] = Math.max(1, Math.min(100, sens)); // Byte 5 = sensitivity (1-100%)
            await tuya.sendDataPointRaw(ep, 52, Buffer.from(p));
            return { state: { state:'ON', work_mode:'music', music_mode:mode, music_sensitivity:sens } };
        },
    },

    wzspi_brightness_color: {
        key: ['color', 'brightness'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            let mode = meta.state?.work_mode || 'white';
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            const hasBri = meta.message.hasOwnProperty('brightness');
            const hasCol = meta.message.hasOwnProperty('color') || key === 'color';
            if (hasCol && mode !== 'colour') { await tuya.sendDataPointEnum(ep, 2, 1); mode = 'colour'; }
            let st = { state: 'ON', work_mode: mode };
            
            meta.state = meta.state || {};
            let z = hasBri ? Number(meta.message.brightness) : (Number(meta.state.brightness)||254);
            z = Math.max(0, Math.min(254, z));
            let pct = Math.round((z / 254) * 100);
            let d = z2mToDevice(z);
            
            if (hasBri) { 
                meta.state.brightness = z; 
                meta.state.brightness_manual = pct; 
                st.brightness = z; 
                st.brightness_manual = pct; 
            }

            if (hasCol || (hasBri && mode === 'colour')) {
                const cd = meta.message.color ?? meta.state.color ?? {h:0,s:100};
                const c = libColor.Color.fromConverterArg(cd);
                const hsv = c.isRGB() ? c.rgb.toHSV() : c.hsv;
                const h = Math.max(0,Math.min(360,Math.round(hsv.hue)));
                const s = Math.max(0,Math.min(1000,Math.round((hsv.saturation/100)*1000)));
                await tuya.sendDataPointRaw(ep, 61, Buffer.from([0x00,0x01,0x01,0x14,0x00,(h>>8)&0xff,h&0xff,(s>>8)&0xff,s&0xff,(d>>8)&0xff,d&0xff]));
                if (hasCol) st.color = cd;
            } else if (hasBri && mode === 'scene') {
                if (meta.state._scene_gen_v3) {
                    await tzLocal.wzspi_scene_gen.convertSet(entity, 'scene_gen_speed', meta.state.scene_gen_speed ?? 50, meta);
                } else {
                    await tzLocal.wzspi_scene.convertSet(entity, 'scene', meta.state.scene || 'ice_land_blue', meta);
                }
            } else if (hasBri && mode === 'music') {
                await tzLocal.wzspi_music.convertSet(entity, 'music_mode', meta.state.music_mode || 'rock', meta);
            } else if (hasBri) {
                await tuya.sendDataPointValue(ep, 3, d);
            }
            return { state: st };
        },
    },

    wzspi_brightness_preset: {
        key: ['brightness_preset'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            const z = BRIGHTNESS_PRESETS[value]; if (z===undefined) throw new Error(`Unknown preset: ${value}`);
            const pct = Math.round((z / 254) * 100);
            const d = z2mToDevice(z); const mode = meta.state?.work_mode || 'white';
            
            meta.state = meta.state || {};
            meta.state.brightness = z;
            meta.state.brightness_manual = pct;

            if (mode === 'colour') {
                const cd = meta.state?.color ?? {h:0,s:100}; const c = libColor.Color.fromConverterArg(cd);
                const hsv = c.isRGB()?c.rgb.toHSV():c.hsv; const h=Math.round(hsv.hue); const s=Math.round((hsv.saturation/100)*1000);
                await tuya.sendDataPointRaw(ep, 61, Buffer.from([0x00,0x01,0x01,0x14,0x00,(h>>8)&0xff,h&0xff,(s>>8)&0xff,s&0xff,(d>>8)&0xff,d&0xff]));
            } else if (mode === 'scene') {
                if (meta.state._scene_gen_v3) {
                    await tzLocal.wzspi_scene_gen.convertSet(entity, 'scene_gen_speed', meta.state.scene_gen_speed ?? 50, meta);
                } else {
                    await tzLocal.wzspi_scene.convertSet(entity, 'scene', meta.state.scene || 'ice_land_blue', meta);
                }
            } else if (mode === 'music') {
                await tzLocal.wzspi_music.convertSet(entity, 'music_mode', meta.state.music_mode || 'rock', meta);
            } else { 
                await tuya.sendDataPointValue(ep, 3, d); 
            }
            return { state: { state:'ON', brightness:z, brightness_preset:value, brightness_manual: pct } };
        },
    },

    // Manual brightness slider 1-100%
    wzspi_brightness_manual: {
        key: ['brightness_manual'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            const pct = Math.max(1, Math.min(100, Number(value)));
            const z = Math.round(254 * pct / 100);
            const d = z2mToDevice(z); const mode = meta.state?.work_mode || 'white';

            meta.state = meta.state || {};
            meta.state.brightness = z;
            meta.state.brightness_manual = pct;

            if (mode === 'colour') {
                const cd = meta.state?.color ?? {h:0,s:100}; const c = libColor.Color.fromConverterArg(cd);
                const hsv = c.isRGB()?c.rgb.toHSV():c.hsv; const h=Math.round(hsv.hue); const s=Math.round((hsv.saturation/100)*1000);
                await tuya.sendDataPointRaw(ep, 61, Buffer.from([0x00,0x01,0x01,0x14,0x00,(h>>8)&0xff,h&0xff,(s>>8)&0xff,s&0xff,(d>>8)&0xff,d&0xff]));
            } else if (mode === 'scene') {
                if (meta.state._scene_gen_v3) {
                    await tzLocal.wzspi_scene_gen.convertSet(entity, 'scene_gen_speed', meta.state.scene_gen_speed ?? 50, meta);
                } else {
                    await tzLocal.wzspi_scene.convertSet(entity, 'scene', meta.state.scene || 'ice_land_blue', meta);
                }
            } else if (mode === 'music') {
                await tzLocal.wzspi_music.convertSet(entity, 'music_mode', meta.state.music_mode || 'rock', meta);
            } else { 
                await tuya.sendDataPointValue(ep, 3, d); 
            }
            return { state: { state:'ON', brightness:z, brightness_manual:pct, brightness_preset: undefined } };
        },
    },

    // White only — exclusively activates the W channel (pure white #ffffff)
    wzspi_white_only: {
        key: ['white_only'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (value === 'ON' || value === true) {
                if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
                await tuya.sendDataPointEnum(ep, 2, 0); // white mode
                await tuya.sendDataPointValue(ep, 4, 500); // color_temp=500 -> neutral white
                return { state: { state:'ON', work_mode:'white', white_only:'ON', color_temp: 500 } };
            } else {
                return { state: { white_only:'OFF' } };
            }
        },
    },

    // Color temperature — automatically switches to white mode
    wzspi_color_temp: {
        key: ['color_temp'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (meta.state?.state !== 'ON') await tuya.sendDataPointBool(ep, 1, true);
            if (meta.state?.work_mode !== 'white') await tuya.sendDataPointEnum(ep, 2, 0);
            const ct = Math.max(0, Math.min(1000, Number(value)));
            await tuya.sendDataPointValue(ep, 4, ct);
            return { state: { state:'ON', work_mode:'white', color_temp:ct } };
        },
    },

    // Reset settings to default values
    wzspi_reset: {
        key: ['reset_settings'],
        convertSet: async (entity, key, value, meta) => {
            const ep = meta.device.endpoints[0];
            if (value === 'brightness') { await tuya.sendDataPointValue(ep, 3, z2mToDevice(DEFAULTS.brightness)); return { state:{brightness:DEFAULTS.brightness} }; }
            if (value === 'color_temp') { await tuya.sendDataPointValue(ep, 4, DEFAULTS.color_temp); return { state:{color_temp:DEFAULTS.color_temp} }; }
            if (value === 'pixel_count') { await tuya.sendDataPointValue(ep, 53, DEFAULTS.lightpixel_number_set); return { state:{lightpixel_number_set:DEFAULTS.lightpixel_number_set} }; }
            if (value === 'music_sensitivity') { return { state:{music_sensitivity:DEFAULTS.music_sensitivity} }; }
            if (value === 'countdown') { await tuya.sendDataPointValue(ep, 7, 0); return { state:{countdown:0} }; }
            if (value === 'scene_speed') { return { state:{scene_speed:DEFAULTS.scene_speed} }; }
            return {};
        },
    },
};

// ============================================================================
// DEVICE DEFINITION
// ============================================================================
const definition = {
    fingerprint: tuya.fingerprint('TS0601', ['_TZE204_8fffc3kb']),
    model: 'WZ-SPI',
    vendor: 'Skydance',
    description: 'Zigbee WZ-SPI RGBW digital LED strip controller',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [
        tzLocal.wzspi_brightness_color, tzLocal.wzspi_brightness_preset, tzLocal.wzspi_brightness_manual,
        tzLocal.wzspi_music, tzLocal.wzspi_scene, tzLocal.wzspi_scene_gen,
        tzLocal.wzspi_white_only, tzLocal.wzspi_color_temp, tzLocal.wzspi_reset,
        tuya.tz.datapoints,
    ],
    configure: tuya.configureMagicPacket,

    exposes: [
        // ══════════════════════════════════════════════
        //  BASIC CONTROLS
        // ══════════════════════════════════════════════
        e.light_colorhs(),

        e.numeric('brightness_manual', exposes.access.STATE_SET)
            .withValueMin(1).withValueMax(100).withUnit('%')
            .withLabel('💡 Brightness (manual)')
            .withDescription('Manual brightness setting in percentage. 1% = almost off, 100% = max brightness.'),

        e.enum('brightness_preset', exposes.access.SET, ['5%','15%','25%','50%','75%','100%'])
            .withLabel('💡 Brightness (preset)')
            .withDescription('Quick brightness selection preset. Choose the desired level of brightness.'),

        e.binary('white_only', exposes.access.STATE_SET, 'ON', 'OFF')
            .withLabel('⬜ White only')
            .withDescription('Turns on pure white light. On RGBW strips, this activates the dedicated white LED chip (W channel). All colors are turned off.'),

        e.numeric('color_temp', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(1000)
            .withLabel('🌡️ White temperature')
            .withDescription('Controls the shade of white (switches to white mode). Value 0 = warm white (W channel), 1000 = cold white (mixed from RGB).'),

        // ══════════════════════════════════════════════
        //  PRESET SCENES
        // ══════════════════════════════════════════════
        e.enum('scene', exposes.access.STATE_SET, Object.keys(SCENE_DATA))
            .withLabel('🎬 Preset scene')
            .withDescription('Select a preset lighting scene. Once selected, the scene will instantly play on the LED strip.'),

        e.numeric('scene_speed', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100)
            .withLabel('⏩ Scene speed')
            .withDescription('Animation speed of the preset scene. 0 = slowest, 100 = fastest.'),

        // ══════════════════════════════════════════════════════
        //  CUSTOM SCENE GENERATOR
        //  Main color = fallback (used only when colors 1-4 are not set)
        //  Colors 1-4 = REPLACE main color. Each has its own hue + saturation.
        //    -1 = color is not used. Only explicitly set colors enter the effect.
        // ══════════════════════════════════════════════════════

        // --- Main custom scene color ---
        e.numeric('scene_gen_hue', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(360).withUnit('°')
            .withCategory('config')
            .withLabel('🎨 Custom scene main color')
            .withDescription('Fallback color for the effect. Used ONLY if none of colors 1-4 are set. Once you set color 1 (or any other), the main color is IGNORED. Color wheel: 0° = red, 60° = yellow, 120° = green, 180° = cyan, 240° = blue, 300° = pink.'),

        e.numeric('scene_gen_main_sat', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100).withUnit('%')
            .withCategory('config')
            .withLabel('🎨 Main color saturation')
            .withDescription('Saturation of the fallback main color. 100% = fully saturated, 0% = white. Applies only if colors 1-4 are not set.'),

        // --- Color 1 (first color in effect) ---
        e.numeric('scene_gen_color1', exposes.access.STATE_SET)
            .withValueMin(-1).withValueMax(360).withUnit('°')
            .withCategory('config')
            .withLabel('🔴 Color 1 — hue')
            .withDescription('First color in the effect. When set, the main color is IGNORED. Value -1 = color is not used. Values 0-360° = custom color.'),

        e.numeric('scene_gen_sat1', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100).withUnit('%')
            .withCategory('config')
            .withLabel('🔴 Color 1 — saturation')
            .withDescription('Custom saturation for color 1. 100% = full color, 0% = white. Default: 100%. Applies only if color 1 is set (not -1).'),

        // --- Color 2 (second color in effect) ---
        e.numeric('scene_gen_color2', exposes.access.STATE_SET)
            .withValueMin(-1).withValueMax(360).withUnit('°')
            .withCategory('config')
            .withLabel('🟢 Color 2 — hue')
            .withDescription('Second color in the effect. Value -1 = color 2 is NOT USED. Values 0-360° = custom color.'),

        e.numeric('scene_gen_sat2', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100).withUnit('%')
            .withCategory('config')
            .withLabel('🟢 Color 2 — saturation')
            .withDescription('Saturation for color 2. 100% = full color, 0% = white. Default: 100%.'),

        // --- Color 3 (optional third color) ---
        e.numeric('scene_gen_color3', exposes.access.STATE_SET)
            .withValueMin(-1).withValueMax(360).withUnit('°')
            .withCategory('config')
            .withLabel('🔵 Color 3 — hue (optional)')
            .withDescription('Third color in the effect (optional). Value -1 = color 3 is not used and the effect will only have 2 colors. Values 0-360° = custom color.'),

        e.numeric('scene_gen_sat3', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100).withUnit('%')
            .withCategory('config')
            .withLabel('🔵 Color 3 — saturation')
            .withDescription('Saturation for color 3. 100% = full color, 0% = white. Default: 100%.'),

        // --- Color 4 (optional fourth color) ---
        e.numeric('scene_gen_color4', exposes.access.STATE_SET)
            .withValueMin(-1).withValueMax(360).withUnit('°')
            .withCategory('config')
            .withLabel('🟡 Color 4 — hue (optional)')
            .withDescription('Fourth color in the effect (optional). Value -1 = color 4 is not used. If you set color 4 without color 3, color 3 will automatically fallback to the main color. Values 0-360° = custom color.'),

        e.numeric('scene_gen_sat4', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100).withUnit('%')
            .withCategory('config')
            .withLabel('🟡 Color 4 — saturation')
            .withDescription('Saturation for color 4. 100% = full color, 0% = white. Default: 100%.'),

        // --- Effects ---
        e.enum('scene_gen_effect', exposes.access.STATE_SET, [
            'gradient','breathe','flowing','rainbow','flutter',
        ]).withCategory('config')
          .withLabel('✨ Smooth effects')
          .withDescription('Smooth lighting effects: gradient = smooth transition, breathe = breathing, flowing = flow, rainbow = rainbow, flutter = fluttering.'),

        e.enum('scene_gen_effect2', exposes.access.STATE_SET, [
            'jump','flashing','meteor','follow','flash',
        ]).withCategory('config')
          .withLabel('⚡ Dynamic effects')
          .withDescription('Dynamic lighting effects: jump = jump, flashing = flashing, meteor = meteor, follow = follow, flash = flash.'),

        e.enum('scene_gen_effect3', exposes.access.STATE_SET, [
            'pile_up','falling','rebound','shuttle','random','switch',
        ]).withCategory('config')
          .withLabel('🌟 Special effects')
          .withDescription('Special lighting effects: pile_up = pile up, falling = falling, rebound = rebound, shuttle = shuttle, random = random, switch = switch.'),

        e.numeric('scene_gen_speed', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(100)
            .withCategory('config')
            .withLabel('⏩ Custom scene speed')
            .withDescription('Animation speed of the custom scene. 0 = slowest, 100 = fastest.'),


        // ══════════════════════════════════════════════
        //  MUSIC MODE
        // ══════════════════════════════════════════════
        e.enum('music_mode', exposes.access.STATE_SET, ['rock','jazz','classic','rolling','energy','spectrum'])
            .withLabel('🎵 Music mode')
            .withDescription('Lighting effect reacting to music. NOTE: WZ-SPI does not have a built-in microphone — it uses your phone microphone via the Tuya / Smart Life app. This mode does not work without the app.'),

        e.numeric('music_sensitivity', exposes.access.STATE_SET)
            .withValueMin(1).withValueMax(100)
            .withLabel('🎵 Music sensitivity')
            .withDescription('Sensitivity to sound from the app. 1 = low sensitivity (reacts only to loud sounds), 100 = high sensitivity (reacts to quiet sounds too).'),

        // ══════════════════════════════════════════════
        //  ADVANCED SETTINGS
        // ══════════════════════════════════════════════
        e.enum('work_mode', exposes.access.STATE_SET, ['white','colour','scene','music'])
            .withLabel('⚙️ Working mode')
            .withDescription('Current working mode of the controller: white = white light, colour = selected color, scene = scene, music = music mode (requires Tuya app).'),

        e.numeric('countdown', exposes.access.STATE_SET)
            .withValueMin(0).withValueMax(86400).withUnit('s')
            .withLabel('⏲️ Power-off countdown')
            .withDescription('Automatic power-off after the specified number of seconds. Value 0 = countdown disabled. Max 86 400 seconds = 24 hours.'),



        e.numeric('lightpixel_number_set', exposes.access.ALL)
            .withValueMin(1).withValueMax(1000).withUnit('pxl')
            .withLabel('📏 Pixel count')
            .withDescription('Total number of addressable pixels (LED points) on the connected strip. For example, a 40cm strip cut every 10cm = 4 pixels.'),

        e.enum('chip_type', exposes.access.ALL, [
            'WS2814 / SK6812 (RGBW)','TM1814B','TM1829','UCS8904B','UCS2904',
            'SM16904','SM16825','TM1914A','UCS7604','UCS7804',
            'TM1803','TM1809','TLS3001','GW6205','MBI6120',
            'LPD6803','LPD8806','WS2801','P9813','SK9822','MBI6020',
            'GS8206','UCS5603','UCS2603','SM16714','SM16714D',
        ]).withLabel('🔧 LED chip type')
          .withDescription('Type of LED chip on your strip. The WS2814 chip works best under the SK6812 (800 kHz, Return-to-zero) protocol on this controller. If you have a WS2814 or SK6812 strip, use this combined option.'),

        e.enum('light_bead_sequence', exposes.access.ALL, [
            'RGB','RBG','GRB','GBR','BRG','BGR',
            'RGBW','RBGW','GRBW','GBRW','BRGW','BGRW',
            'WRGB','WRBG','WGRB','WGBR','WBRG','WBGR',
        ]).withLabel('🔧 Color channel sequence')
          .withDescription('Color channel sequence of your LED strip. For RGBW strips (WS2814, SK6812), pick an option containing W. Most common: RGBW or GRBW. If colors do not match, try another combination.'),

        // Reset settings
        e.enum('reset_settings', exposes.access.SET, ['brightness','color_temp','pixel_count','music_sensitivity','countdown','scene_speed'])
            .withLabel('🔄 Restore default value')
            .withDescription('Restores the selected configuration to its default (factory) value. Select which item to reset.'),
    ],

    meta: {
        tuyaDatapoints: [
            [1, 'state', tuya.valueConverter.onOff],
            [2, 'work_mode', tuya.valueConverterBasic.lookup({ white:tuya.enum(0), colour:tuya.enum(1), scene:tuya.enum(2), music:tuya.enum(3) })],
            [3, 'brightness', tuya.valueConverter.scale0_254to0_1000],
            [4, 'color_temp', tuya.valueConverter.raw],
            [7, 'countdown', tuya.valueConverter.countdown],
            [51, 'scene', localValueConverter.scene_data_converter],
            [52, 'music_mode', localValueConverter.music_data_converter],
            [53, 'lightpixel_number_set', tuya.valueConverter.raw],
            [61, 'color_hs_segmented', tuya.valueConverter.raw],
            [101, 'chip_type', {
                // Skydance WZ-SPI uses the same profile for WS2814 as for SK6812
                from: (v) => {
                    const MAP = {
                        0:'TM1803',1:'TM1809',2:'TM1829',3:'TLS3001',
                        4:'GW6205',5:'MBI6120',6:'TM1814B',7:'WS2814 / SK6812 (RGBW)',
                        8:'UCS8904B',9:'LPD6803',10:'LPD8806',11:'WS2801',
                        12:'P9813',13:'SK9822',14:'MBI6020',15:'TM1914A',
                        16:'GS8206',17:'UCS2904',18:'SM16904',19:'SM16825',
                        20:'SM16714',21:'UCS5603',22:'UCS2603',23:'SM16714D',
                        24:'UCS7604',25:'UCS7804',
                    };
                    return MAP[v] || 'WS2814 / SK6812 (RGBW)';
                },
                to: (v) => {
                    const MAP = {
                        'WS2814 / SK6812 (RGBW)':7,'TM1814B':6,
                        'TM1803':0,'TM1809':1,'TM1829':2,'TLS3001':3,
                        'GW6205':4,'MBI6120':5,'UCS8904B':8,
                        'LPD6803':9,'LPD8806':10,'WS2801':11,
                        'P9813':12,'SK9822':13,'MBI6020':14,'TM1914A':15,
                        'GS8206':16,'UCS2904':17,'SM16904':18,'SM16825':19,
                        'SM16714':20,'UCS5603':21,'UCS2603':22,'SM16714D':23,
                        'UCS7604':24,'UCS7804':25,
                    };
                    return tuya.enum(MAP[v] ?? 7);
                },
            }],
            [102, 'light_bead_sequence', tuya.valueConverterBasic.lookup({
                RGB:tuya.enum(0),RBG:tuya.enum(1),GRB:tuya.enum(2),GBR:tuya.enum(3),
                BRG:tuya.enum(4),BGR:tuya.enum(5),RGBW:tuya.enum(6),RBGW:tuya.enum(7),
                GRBW:tuya.enum(8),GBRW:tuya.enum(9),BRGW:tuya.enum(10),BGRW:tuya.enum(11),
                WRGB:tuya.enum(12),WRBG:tuya.enum(13),WGRB:tuya.enum(14),WGBR:tuya.enum(15),
                WBRG:tuya.enum(16),WBGR:tuya.enum(17),
            })],

        ],
    },
};

module.exports = definition;
