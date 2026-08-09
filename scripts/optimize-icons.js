#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("用法：node scripts/optimize-icons.js [--max-size 64]");
  process.exit(0);
}

function readOption(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const maxSize = Math.max(32, Math.min(256, Number(readOption("--max-size", 64)) || 64));
const root = path.resolve(__dirname, "..");
const iconRoot = path.join(root, "src", "assets", "icons");
const dataFile = path.join(root, "src", "data", "sites.json");
const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));

function isPng(buffer, offset = 0) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return signature.every((byte, index) => buffer[offset + index] === byte);
}

function extractPngFromIco(buffer) {
  if (buffer.length < 22 || buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) return null;
  const count = buffer.readUInt16LE(4);
  const candidates = [];
  for (let index = 0; index < count; index += 1) {
    const entry = 6 + (index * 16);
    if (entry + 16 > buffer.length) break;
    const width = buffer[entry] || 256;
    const height = buffer[entry + 1] || 256;
    const length = buffer.readUInt32LE(entry + 8);
    const offset = buffer.readUInt32LE(entry + 12);
    if (offset + length <= buffer.length && isPng(buffer, offset)) {
      candidates.push({ width, height, length, offset });
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const aDelta = Math.abs(Math.max(a.width, a.height) - maxSize);
    const bDelta = Math.abs(Math.max(b.width, b.height) - maxSize);
    return aDelta - bDelta || b.length - a.length;
  });
  const best = candidates[0];
  return buffer.subarray(best.offset, best.offset + best.length);
}

function extractDibFromIco(buffer) {
  if (buffer.length < 22 || buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) return null;
  const count = buffer.readUInt16LE(4);
  const candidates = [];
  for (let index = 0; index < count; index += 1) {
    const entry = 6 + (index * 16);
    if (entry + 16 > buffer.length) break;
    const length = buffer.readUInt32LE(entry + 8);
    const offset = buffer.readUInt32LE(entry + 12);
    if (offset + length > buffer.length || isPng(buffer, offset) || offset + 40 > buffer.length) continue;
    const headerSize = buffer.readUInt32LE(offset);
    const width = Math.abs(buffer.readInt32LE(offset + 4));
    const height = Math.abs(buffer.readInt32LE(offset + 8)) / 2;
    const bitDepth = buffer.readUInt16LE(offset + 14);
    const compression = buffer.readUInt32LE(offset + 16);
    if (headerSize < 40 || !Number.isInteger(height) || !width || !height || bitDepth !== 32 || compression !== 0) continue;
    const pixelOffset = offset + headerSize;
    const pixelLength = width * height * 4;
    if (pixelOffset + pixelLength > offset + length) continue;
    candidates.push({ width, height, pixelOffset });
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const aDelta = Math.abs(Math.max(a.width, a.height) - maxSize);
    const bDelta = Math.abs(Math.max(b.width, b.height) - maxSize);
    return aDelta - bDelta;
  });
  const best = candidates[0];
  const pixels = Buffer.alloc(best.width * best.height * 4);
  let hasAlpha = false;
  for (let y = 0; y < best.height; y += 1) {
    const sourceY = best.height - y - 1;
    for (let x = 0; x < best.width; x += 1) {
      const source = best.pixelOffset + ((sourceY * best.width + x) * 4);
      const target = (y * best.width + x) * 4;
      pixels[target] = buffer[source + 2];
      pixels[target + 1] = buffer[source + 1];
      pixels[target + 2] = buffer[source];
      pixels[target + 3] = buffer[source + 3];
      if (buffer[source + 3]) hasAlpha = true;
    }
  }
  if (!hasAlpha) {
    for (let index = 3; index < pixels.length; index += 4) pixels[index] = 255;
  }
  return { data: pixels, raw: { width: best.width, height: best.height, channels: 4 } };
}

async function optimize(inputPath) {
  const original = fs.readFileSync(inputPath);
  const extension = path.extname(inputPath).toLowerCase();
  if (extension === ".svg") return null;
  const pngSource = extension === ".ico" ? extractPngFromIco(original) : null;
  const dibSource = extension === ".ico" && !pngSource ? extractDibFromIco(original) : null;
  const source = pngSource || dibSource?.data || original;
  const sourceOptions = dibSource ? { raw: dibSource.raw } : { animated: false };
  const output = await sharp(source, sourceOptions)
    .rotate()
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  return output.length < original.length ? output : null;
}

(async () => {
  const iconPaths = [...new Set(data.sites.map((site) => site.icon).filter(Boolean))];
  const conversions = new Map();
  let originalBytes = 0;
  let optimizedBytes = 0;
  let skipped = 0;

  for (const relativePath of iconPaths) {
    const inputPath = path.resolve(root, "src", "assets", relativePath);
    if (!inputPath.startsWith(`${iconRoot}${path.sep}`) || !fs.existsSync(inputPath)) {
      console.warn(`跳过无效图标路径：${relativePath}`);
      skipped += 1;
      continue;
    }
    const originalSize = fs.statSync(inputPath).size;
    originalBytes += originalSize;
    try {
      const output = await optimize(inputPath);
      if (!output) {
        optimizedBytes += originalSize;
        skipped += 1;
        continue;
      }
      const outputPath = path.join(iconRoot, `${path.parse(inputPath).name}.webp`);
      fs.writeFileSync(outputPath, output);
      optimizedBytes += output.length;
      conversions.set(relativePath, {
        nextPath: `icons/${path.basename(outputPath)}`,
        inputPath,
        outputPath,
      });
      console.log(`优化 ${path.basename(inputPath)}：${originalSize} B → ${output.length} B`);
    } catch (error) {
      optimizedBytes += originalSize;
      skipped += 1;
      console.warn(`无法优化 ${path.basename(inputPath)}：${error.message}`);
    }
  }

  data.sites.forEach((site) => {
    const conversion = conversions.get(site.icon);
    if (conversion) site.icon = conversion.nextPath;
  });
  fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  conversions.forEach(({ inputPath, outputPath }) => {
    if (inputPath !== outputPath && fs.existsSync(inputPath)) fs.rmSync(inputPath);
  });

  const saved = originalBytes - optimizedBytes;
  console.log(`完成：优化 ${conversions.size} 个，保留 ${skipped} 个，节省 ${(saved / 1024).toFixed(1)} KiB。`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
