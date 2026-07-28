/**
 * Next.js static export can request flat RSC payloads like:
 *   /shop/__next.shop.__PAGE__.txt
 * while emitting nested files:
 *   /shop/__next.shop/__PAGE__.txt
 * This script mirrors nested flight files to the flat names Cloudflare/Pages expects.
 */
const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "out");

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const pageTxtFiles = walk(outDir).filter((file) =>
  file.replace(/\\/g, "/").match(/__next\.[^/]+\/__PAGE__\.txt$/)
);

let mirrored = 0;
for (const nested of pageTxtFiles) {
  const normalized = nested.replace(/\\/g, "/");
  const flat = normalized.replace(/\/(__next\.[^/]+)\/__PAGE__\.txt$/, "/$1.__PAGE__.txt");
  if (flat === normalized) continue;
  fs.mkdirSync(path.dirname(flat), { recursive: true });
  fs.copyFileSync(nested, flat);
  mirrored += 1;
}

console.log(`Mirrored ${mirrored} RSC payload file(s) for Cloudflare Pages.`);
