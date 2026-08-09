#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
const dns = require("node:dns").promises;

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src", "data", "sites.json");
const ICON_DIR = path.join(ROOT, "src", "assets", "icons");
const REPORT_DIR = path.join(ROOT, "reports");
const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log("用法：node scripts/sync-icons.js [--refresh] [--limit 10] [--concurrency 6] [--timeout 10000]");
  process.exit(0);
}

function readOption(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const refresh = args.includes("--refresh");
const limit = Math.max(0, Number(readOption("--limit", 0)) || 0);
const concurrency = Math.min(12, Math.max(1, Number(readOption("--concurrency", 6)) || 6));
const timeout = Math.min(30000, Math.max(2000, Number(readOption("--timeout", 10000)) || 10000));
const maxHtmlBytes = 768 * 1024;
const maxIconBytes = 512 * 1024;

function isPrivateIp(address) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return a === 10
      || a === 127
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168)
      || a === 0;
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return normalized === "::1"
      || normalized === "::"
      || normalized.startsWith("fc")
      || normalized.startsWith("fd")
      || normalized.startsWith("fe8")
      || normalized.startsWith("fe9")
      || normalized.startsWith("fea")
      || normalized.startsWith("feb");
  }
  return true;
}

async function assertSafeRemoteUrl(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("仅支持 HTTP(S)");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new Error("拒绝访问本地主机");
  }
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("拒绝访问私有地址");
  } else {
    const addresses = await dns.lookup(hostname, { all: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) {
      throw new Error("域名解析到了私有地址");
    }
  }
  return url;
}

async function safeFetch(value, init = {}) {
  let current = await assertSafeRemoteUrl(value);
  for (let redirects = 0; redirects <= 5; redirects += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(current, {
        ...init,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": "RoseTools-IconSync/1.0",
          ...init.headers,
        },
      });
      if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
        current = await assertSafeRemoteUrl(new URL(response.headers.get("location"), current).href);
        continue;
      }
      return response;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("重定向次数过多");
}

async function readLimited(response, maximum) {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > maximum) throw new Error("响应文件过大");
  const chunks = [];
  let total = 0;
  for await (const chunk of response.body) {
    total += chunk.length;
    if (total > maximum) throw new Error("响应文件过大");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;
  while ((match = pattern.exec(tag))) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attributes;
}

function discoverIconUrls(html, pageUrl) {
  const candidates = [];
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const attributes = parseAttributes(tag);
    if (!/(^|\s)(shortcut\s+)?icon(\s|$)/i.test(attributes.rel || "")) continue;
    if (!attributes.href || /^data:/i.test(attributes.href)) continue;
    try {
      const url = new URL(attributes.href, pageUrl);
      const size = Math.max(...String(attributes.sizes || "0").match(/\d+/g)?.map(Number) || [0]);
      candidates.push({ url: url.href, size });
    } catch (_) {}
  }
  return candidates.sort((a, b) => b.size - a.size).map(({ url }) => url);
}

function detectIcon(buffer, contentType) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (buffer.length >= 4 && buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 1 && buffer[3] === 0) return "ico";
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "jpg";
  if (buffer.subarray(0, 6).toString("ascii").startsWith("GIF8")) return "gif";
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF"
    && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "webp";

  if (/image\/svg\+xml/i.test(contentType || "")) {
    const svg = buffer.toString("utf8").trim();
    const unsafeMarkup = /<script|<foreignObject|\son\w+\s*=|(?:href|xlink:href)\s*=\s*["']https?:/i;
    const unsafeCssUrl = [...svg.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)]
      .some((match) => !match[2].trim().startsWith("#") && !match[2].trim().startsWith("data:image/"));
    if (/<svg\b/i.test(svg.slice(0, 2048)) && !unsafeMarkup.test(svg) && !unsafeCssUrl) return "svg";
  }
  return "";
}

async function downloadIcon(value) {
  const response = await safeFetch(value, {
    headers: { accept: "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5" },
  });
  if (!response.ok) throw new Error(`图标 HTTP ${response.status}`);
  const buffer = await readLimited(response, maxIconBytes);
  const extension = detectIcon(buffer, response.headers.get("content-type"));
  if (!extension) throw new Error("响应不是支持的图标格式");
  return { buffer, extension, sourceUrl: response.url || value };
}

async function resolveSiteIcon(site) {
  const candidates = [];
  let pageUrl = site.url;
  try {
    const response = await safeFetch(site.url, {
      headers: { accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5" },
    });
    if (response.ok) {
      pageUrl = response.url || site.url;
      const html = (await readLimited(response, maxHtmlBytes)).toString("utf8");
      candidates.push(...discoverIconUrls(html, pageUrl));
    }
  } catch (_) {}

  const origin = new URL(pageUrl).origin;
  candidates.push(new URL("/favicon.ico", origin).href, new URL("/favicon.png", origin).href);
  const hostname = new URL(site.url).hostname;
  candidates.push(`https://icon.horse/icon/${encodeURIComponent(hostname)}?status_code_404=true`);
  const uniqueCandidates = [...new Set(candidates)].slice(0, 8);
  const errors = [];
  for (const candidate of uniqueCandidates) {
    try {
      return await downloadIcon(candidate);
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
    }
  }
  throw new Error(errors.at(-1) || "未发现可用图标");
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  fs.mkdirSync(ICON_DIR, { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const selected = limit ? data.sites.slice(0, limit) : data.sites;
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < selected.length) {
      const site = selected[nextIndex++];
      const existingFile = site.icon ? path.join(ROOT, "src", "assets", site.icon) : "";
      if (!refresh && existingFile && fs.existsSync(existingFile)) {
        results.push({ id: site.id, name: site.name, status: "cached", icon: site.icon });
        continue;
      }
      try {
        const icon = await resolveSiteIcon(site);
        const relativeIcon = `icons/${site.slug}.${icon.extension}`;
        fs.writeFileSync(path.join(ICON_DIR, `${site.slug}.${icon.extension}`), icon.buffer);
        site.icon = relativeIcon;
        results.push({ id: site.id, name: site.name, status: "downloaded", icon: relativeIcon, sourceUrl: icon.sourceUrl });
        console.log(`✓ ${site.name} -> ${relativeIcon}`);
      } catch (error) {
        results.push({ id: site.id, name: site.name, status: "fallback", error: error.message });
        console.warn(`- ${site.name}: 使用首字母占位（${error.message}）`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, () => worker()));
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  const report = {
    checkedAt: new Date().toISOString(),
    total: selected.length,
    downloaded: results.filter((item) => item.status === "downloaded").length,
    cached: results.filter((item) => item.status === "cached").length,
    fallback: results.filter((item) => item.status === "fallback").length,
    results,
  };
  const reportPath = path.join(REPORT_DIR, `icon-report-${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`图标同步完成：${report.downloaded} 个下载，${report.cached} 个缓存，${report.fallback} 个继续使用占位。`);
  console.log(`报告：${path.relative(ROOT, reportPath)}`);
}

main().catch((error) => {
  console.error(`图标同步失败：${error.message}`);
  process.exitCode = 1;
});
