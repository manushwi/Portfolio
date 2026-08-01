import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "ghibli.png");
const OUT_DIR = join(ROOT, "public", "ascii");
const OUT = join(OUT_DIR, "portrait.json");

// 72 cols × 108 rows keeps the 2:3 portrait aspect with square glyph cells.
const COLS = 72;
const ROWS = 108;
const RAMP = " .:-=+*#%@"; // sparse → dense

const meta = await sharp(SRC).metadata();
if (!meta.width || !meta.height) throw new Error(`no image at ${SRC}`);

const { data, info } = await sharp(SRC)
  .resize(COLS, ROWS, { fit: "fill" })
  .grayscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

if (info.channels !== 1) throw new Error("expected grayscale");

const chars = new Array(COLS * ROWS);
const b = new Array(COLS * ROWS);
const rampLen = RAMP.length;

for (let i = 0; i < data.length; i++) {
  const v = data[i]; // 0..255
  b[i] = v;
  const idx = Math.min(rampLen - 1, Math.round((v / 255) * (rampLen - 1)));
  chars[i] = RAMP[idx];
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({
    cols: COLS,
    rows: ROWS,
    ramp: RAMP,
    chars: chars.join(""),
    b,
  })
);

console.log(
  `ascii portrait: ${COLS}x${ROWS} (${COLS * ROWS} cells) -> ${OUT}`
);
