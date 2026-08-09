#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("用法：node scripts/check-links.js [--limit 10] [--concurrency 6] [--timeout 8000] [--output report.json] [--no-fail]");
  process.exit(0);
}

function readOption(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const limit = Number(readOption("--limit", 0));
const concurrency = Math.max(1, Number(readOption("--concurrency", 6)));
const timeout = Math.max(1000, Number(readOption("--timeout", 8000)));
const outputArg = readOption("--output", "");
const noFail = args.includes("--no-fail");
const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "sites.json"), "utf8"));
const sites = limit > 0 ? data.sites.slice(0, limit) : data.sites;

async function requestSite(site) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    let response = await fetch(site.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "RoseTools-LinkChecker/1.0" },
    });
    if ([403, 405].includes(response.status)) {
      response = await fetch(site.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "RoseTools-LinkChecker/1.0" },
      });
    }
    const restricted = [401, 403, 429].includes(response.status);
    const redirected = response.url !== site.url;
    const sourceUrl = new URL(site.url);
    const finalUrl = new URL(response.url);
    const redirectKind = !redirected
      ? "none"
      : sourceUrl.protocol === "https:" && finalUrl.protocol === "http:"
        ? "insecure"
        : sourceUrl.hostname === finalUrl.hostname
          ? "same-host"
          : "cross-host";
    return {
      id: site.id,
      name: site.name,
      url: site.url,
      status: response.status,
      ok: response.ok,
      state: response.ok ? "healthy" : restricted ? "restricted" : "failed",
      finalUrl: response.url,
      redirected,
      redirectKind,
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      id: site.id,
      name: site.name,
      url: site.url,
      status: 0,
      ok: false,
      state: "failed",
      error: error.name === "AbortError" ? `timeout after ${timeout}ms` : error.message,
      durationMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runPool(items) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      const result = await requestSite(items[index]);
      results[index] = result;
      const marker = result.state === "healthy" ? "✓" : result.state === "restricted" ? "!" : "✗";
      console.log(`${marker} ${result.name}: ${result.status || result.error}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

(async () => {
  const checkedAt = new Date().toISOString();
  const results = await runPool(sites);
  const report = {
    checkedAt,
    total: results.length,
    healthy: results.filter((item) => item.state === "healthy").length,
    restricted: results.filter((item) => item.state === "restricted").length,
    failed: results.filter((item) => item.state === "failed").length,
    redirected: results.filter((item) => item.redirected).length,
    crossHostRedirected: results.filter((item) => item.redirectKind === "cross-host").length,
    insecureRedirected: results.filter((item) => item.redirectKind === "insecure").length,
    results,
  };
  const defaultName = `link-report-${checkedAt.slice(0, 10)}.json`;
  const output = path.resolve(root, outputArg || path.join("reports", defaultName));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`检查完成：${report.healthy} 正常，${report.restricted} 受限，${report.failed} 失败。报告：${output}`);
  if (report.failed && !noFail) process.exitCode = 1;
})();
