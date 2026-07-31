import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
mkdirSync(publicDir, { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#1d4ed8"/>
  <circle cx="256" cy="196" r="88" fill="none" stroke="#ffffff" stroke-width="24"/>
  <circle cx="256" cy="196" r="30" fill="#ffffff"/>
  <path d="M120 392c24-72 88-112 136-112s112 40 136 112" fill="none" stroke="#ffffff" stroke-width="24" stroke-linecap="round"/>
</svg>
`.trim();

const sizes = [192, 512];

for (const size of sizes) {
  const outPath = join(publicDir, `icon-${size}x${size}.png`);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log(`Wrote ${outPath}`);
}
