/* Shared by the browser and static builder; no network or storage access. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RoseToolsDiscovery = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function normalizeQuery(value) {
    return String(value || "").normalize("NFKC").trim().replace(/\s+/gu, " ");
  }

  function normalizeText(value) {
    return normalizeQuery(value).toLocaleLowerCase("zh-CN");
  }

  function queryTokens(value) {
    const query = normalizeText(value);
    return query ? [...new Set(query.split(" "))] : [];
  }

  function searchableText(site) {
    return normalizeText([
      site.name, site.description, site.category, site.subcategory,
      ...(site.tags || []), ...(site.aliases || []),
    ].join(" "));
  }

  function matchesQuery(site, query) {
    const text = searchableText(site);
    return queryTokens(query).every((token) => text.includes(token));
  }

  function filterSites(sites, state, favoriteIds = new Set(), collectionMatches) {
    const tokens = queryTokens(state.q);
    return sites.filter((site) => {
      if (collectionMatches && !collectionMatches(site)) return false;
      if (state.view === "favorites" && !favoriteIds.has(site.id)) return false;
      if (state.category !== "all" && site.category !== state.category) return false;
      if (state.pricing !== "all" && site.pricing !== state.pricing) return false;
      if (state.platform !== "all" && !site.platforms.includes(state.platform)) return false;
      if (state.tag && !site.tags.includes(state.tag)) return false;
      const text = searchableText(site);
      return tokens.every((token) => text.includes(token));
    });
  }

  function tagCounts(sites) {
    const counts = new Map();
    for (const site of sites) {
      for (const tag of new Set(site.tags)) counts.set(tag, (counts.get(tag) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]
      || a[0].localeCompare(b[0], "zh-CN") || compareStable(a[0], b[0]));
  }

  function compareStable(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function relatedScore(site, candidate) {
    if (site.id === candidate.id) return 0;
    const tags = new Set((site.tags || []).map(normalizeText));
    const shared = [...new Set((candidate.tags || []).map(normalizeText))]
      .filter((tag) => tags.has(tag)).length;
    return (site.subcategory === candidate.subcategory ? 3 : 0)
      + (site.category === candidate.category ? 1 : 0) + shared;
  }

  function relatedSites(site, sites) {
    return sites.filter((candidate) => candidate.id !== site.id)
      .map((candidate) => ({ candidate, score: relatedScore(site, candidate) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score
        || compareStable(a.candidate.slug || a.candidate.id, b.candidate.slug || b.candidate.id)
        || compareStable(a.candidate.id, b.candidate.id))
      .slice(0, 3).map(({ candidate }) => candidate);
  }

  // Keep meaningful query parameters; discard tracking and display-only redirects.
  // HTTP/HTTPS, www, trailing slash and fragment variants identify the same entry.
  function canonicalUrl(value) {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("仅支持 HTTP(S)");
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || /^(?:fbclid|gclid|noRedirect)$/i.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    const query = url.searchParams.toString();
    return `${url.host.toLowerCase().replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}${query ? `?${query}` : ""}`;
  }

  return { normalizeQuery, normalizeText, queryTokens, searchableText, matchesQuery,
    filterSites, tagCounts, relatedScore, relatedSites, canonicalUrl };
});
