// Full page-load timing for a Volto (or any) site, in headless Chromium
// (needs the playwright package and its Chromium; see README.md).
// Usage: node devops/perf/loadtime.js [--runs N] [--throttle] URL...
// For each URL and profile (desktop / phone): cold load in a fresh context,
// then a warm reload (browser cache). Prints medians of N runs.
// Metrics: TTFB, FCP, LCP, DOMContentLoaded, load event, network idle,
// request count and bytes over the wire (compressed).
const { chromium, devices } = require("playwright");

const args = process.argv.slice(2);
let runs = 3,
  throttle = false;
const urls = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--runs") runs = +args[++i];
  else if (args[i] === "--throttle") throttle = true;
  else urls.push(args[i]);
}

const profiles = [
  { name: "desktop", ctx: { viewport: { width: 1366, height: 900 } } },
  {
    name: "phone",
    ctx: { ...devices["iPhone 13"], defaultBrowserType: undefined },
  },
];

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

async function measure(page, cdp, action) {
  let bytes = 0,
    reqs = 0;
  const onDone = (e) => {
    bytes += e.encodedDataLength;
    reqs++;
  };
  cdp.on("Network.loadingFinished", onDone);
  await action();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);
  const m = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const nav = performance.getEntriesByType("navigation")[0];
        const fcp = performance.getEntriesByName("first-contentful-paint")[0];
        let lcp = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(
          () =>
            resolve({
              ttfb: nav.responseStart,
              fcp: fcp ? fcp.startTime : NaN,
              lcp,
              dcl: nav.domContentLoadedEventEnd,
              load: nav.loadEventEnd,
              // last resource finished (relative to navigation start)
              idle: Math.max(
                nav.loadEventEnd,
                ...performance
                  .getEntriesByType("resource")
                  .map((e) => e.responseEnd),
              ),
            }),
          50,
        );
      }),
  );
  cdp.off("Network.loadingFinished", onDone);
  return { ...m, reqs, kb: bytes / 1024 };
}

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const url of urls)
    for (const p of profiles) {
      const cold = [],
        warm = [];
      for (let r = 0; r < runs; r++) {
        const ctx = await browser.newContext(p.ctx);
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.enable");
        if (throttle) {
          // Lighthouse-like "slow 4G" + 4x CPU slowdown
          await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 150,
            downloadThroughput: (1.6 * 1024 * 1024) / 8,
            uploadThroughput: (750 * 1024) / 8,
          });
          await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        }
        cold.push(
          await measure(page, cdp, () =>
            page.goto(url, { waitUntil: "commit" }),
          ),
        );
        warm.push(
          await measure(page, cdp, () => page.reload({ waitUntil: "commit" })),
        );
        await ctx.close();
      }
      for (const [kind, set] of [
        ["cold", cold],
        ["warm", warm],
      ]) {
        const row = {
          url: url.replace(/^https?:\/\/[^/]+/, "") || "/",
          profile: p.name,
          kind,
        };
        for (const k of [
          "ttfb",
          "fcp",
          "lcp",
          "dcl",
          "load",
          "idle",
          "reqs",
          "kb",
        ])
          row[k] = Math.round(median(set.map((x) => x[k])));
        rows.push(row);
        console.error(JSON.stringify(row));
      }
    }
  await browser.close();
  const cols = [
    "url",
    "profile",
    "kind",
    "ttfb",
    "fcp",
    "lcp",
    "dcl",
    "load",
    "idle",
    "reqs",
    "kb",
  ];
  console.log(cols.join("\t"));
  for (const r of rows) console.log(cols.map((c) => r[c]).join("\t"));
})();
