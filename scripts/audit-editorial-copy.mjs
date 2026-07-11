import { loadEditorialGuideLists } from "./editorial-guides-data.mjs";

const META_GUIDE_PATTERN = /\b(this guide|this list|these stops|the guide|the list)\b/i;
const ROUTE_FILLER_PATTERN = new RegExp(
  [
    "earns? [^.!?]{0,50}(?:place|spot|slot|inclusion)",
    "earns? (?:its fame|the (?:trip|detour|crowd|attention|train ride))",
    "belongs (?:here|in (?:this|the) (?:guide|list|route))",
    "gives? the (?:route|day|night)",
    "anchors? the (?:route|day|night)",
    "keeps? the (?:route|day|night)",
    "the (?:route|day|night) needs",
    "role in (?:this|the) (?:guide|list|route)",
    "use (?:it|this|the place) (?:as|when|before|after)",
    "before or after",
    "fits? (?:into|the) route",
    "builds? the (?:day|night)",
    "trip logic",
    "real utility",
    "utility stop",
    "meal role",
    "defined role",
    "clear role",
    "base strategy",
  ].join("|"),
  "i",
);
const PERFORMED_VOICE_PATTERN = new RegExp(
  [
    "fuel,? not ceremony",
    "bad decisions",
    "not a dare",
    "berlin'?s scruff",
    "patience (?:is|runs) thin",
    "swallowed a .* collection",
    "airport energy",
    "street tax",
    "without the blur",
  ].join("|"),
  "i",
);
const STOP_ROLE_PATTERN = new RegExp(
  [
    "(?:is|remains|becomes) (?:the|a|an) (?:(?!\\b(?:for|with|that|where|because|when)\\b)[^.!?]){0,90}\\b(?:stop|pick|choice|option|anchor)\\b",
    "belongs because",
    "belongs here",
    "earns (?:its|the|a) (?:place|slot|spot)",
    "fills? (?:the|a) [^.!?]{0,50} role",
    "reason to save",
    "real use in (?:a|the) [^.!?]{0,30}guide",
    "worth saving",
    "worth a saved-map",
    "useful because",
    "still useful because",
    "it works best",
    "it works when",
    "makes sense (?:as|when|for)",
    "book it for",
    "choose it when",
    "save it for",
    "treat it as",
    "(?:in|for|from) (?:this|the) (?:guide|list)",
    "(?:gives?|keeps?|adds?|brings?) (?:(?:this|the) )?(?:[A-Za-z-]+ )?(?:guide|list)",
    "fits? (?:this|the) guide",
  ].join("|"),
  "i",
);
const SOURCE_PROCESS_PATTERN = new RegExp(
  [
    "(?:included|selected|chosen) (?:because|for|as)",
    "(?:supported|validated) by",
    "source material",
    "source-backed (?:quality|support|evidence|selection)",
    "source-consistent",
    "review strength",
    "map signals",
    "geo-tags",
    "editorial reputation",
    "(?:hotel|travel|guide|official) sources? (?:connect|consistently|treat|position|highlight|support)",
  ].join("|"),
  "i",
);
const GUIDE_ROLE_PATTERN = /\b(route|itinerary|plan|use this|works best when|anchor|backups?|these stops?)\b/i;
const ITINERARY_LANGUAGE_PATTERN = /\b(?:route|itinerary)\b|\b(?:before|after) (?:another|the next|the first|dinner|lunch|brunch|drinks?|a show|the show|theatre|the museum|nearby plans?|a nearby|your next)\b/i;
const BELONGS_PATTERN = /\bbelongs\b/i;
const LITERAL_BELONGS_PATTERN = /\b(?:belongs to|where you belong|dinner belongs)\b/i;
const GUIDE_CONTAINER_PATTERN = /\bguide\b/i;
const ITINERARY_META_PATTERN = new RegExp(
  [
    "belongs in (?:a|the) [^.!?]{0,40}(?:trip|plan)",
    "(?:useful|works) in (?:a|the) [^.!?]{0,40}route",
    "in the things-to-do route",
    "(?:gives?|anchors?) the (?:weekend|day|route)",
    "(?:for|from) the weekend route",
    "the weekend route'?s",
    "itinerary engine",
    "route opener",
    "make [^.!?]{0,50} the [^.!?]{0,30} stop",
    "start the (?:week|day|night)",
  ].join("|"),
  "i",
);
const ABSTRACT_PLANNING_PATTERN = new RegExp(
  [
    "\\b(?:logic|utility|counterpoint|pacing)\\b",
    "\\b(?:station|transit|location|base|route|trip|neighborhood|district|weekend|itinerary) logic\\b",
    "\\bthe (?:move|answer)\\b",
    "\\buse it for\\b",
    "\\b(?:day|night|trip|weekend|neighborhood|district) (?:wants|needs|calls for|asks for)\\b",
    "\\bfor (?:travelers|people|anyone|groups|couples|visitors) who (?:want|need)\\b",
    "\\bfor travelers (?:using|choosing|seeking)\\b",
    "\\buse case\\b",
    "\\bfor to\\b",
    "\\bwhen you (?:want|need)\\b",
    "\\bworks? in (?:food|nightlife|stay|culture)\\b",
    "\\bworks? because\\b",
  ].join("|"),
  "i",
);
const METAPHORICAL_ANCHOR_PATTERN = /\banchors?\b/i;
const GUIDE_SOFT_META_PATTERN = /\buseful\b|\bworks? (?:best|when|for|as|because)\b|\banchors?\b|\b(?:logic|utility|counterpoint)\b|\bthe (?:appeal|value|draw|point) is\b|\buse case\b/i;
const IMPERATIVE_USE_PATTERN = /(?:^|[.!?]\s+)Use (?:it|this|the|[A-Z])/;
const GENERIC_OPENER_PATTERN = /^(it is (?:best|strongest|useful) for|it works (?:best )?(?:for|when)|go when|save it for|use [A-Z][^ ]+ when)\b/i;
const SUBJECTLESS_OPENER_PATTERN = /^(?:it\b|use\b|choose\b|start\b|build\b|make\b|save\b|treat\b)/i;
const REPEATED_FRAMES = [
  ["for travelers who want", /\bfor travelers who want\b/i],
  ["when you want or need", /\bwhen you (?:want|need)\b/i],
  ["useful when", /\buseful when\b/i],
  ["works best or works when", /\bworks (?:best|when)\b/i],
  ["the draw, appeal, value, or point is", /\bthe (?:draw|appeal|value|point) is\b/i],
];
const MAX_GUIDE_CHARACTERS = 320;
const MIN_STOP_WORDS = 16;
const MAX_STOP_WORDS = 100;

function parseArgs(argv) {
  const options = { city: null, category: null, errorsOnly: false, json: false, strict: false, limit: 200 };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--city") options.city = argv[++index] ?? null;
    else if (arg === "--category") options.category = argv[++index] ?? null;
    else if (arg === "--errors-only") options.errorsOnly = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--strict") options.strict = true;
    else if (arg === "--limit") options.limit = Number.parseInt(argv[++index] ?? "200", 10);
    else throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function normalize(value) {
  return String(value ?? "").trim();
}

function wordCount(value) {
  return normalize(value).split(/\s+/).filter(Boolean).length;
}

function splitSentences(value) {
  return normalize(value).split(/(?<=[.!?])\s+/).filter(Boolean);
}

function visitStops(stops, callback) {
  for (const stop of stops ?? []) {
    callback(stop);
    visitStops(stop.places, callback);
  }
}

function locationLabel(guide) {
  return [guide.location?.city, guide.location?.neighborhood].filter(Boolean).join(" / ") || guide.location?.country || "Global";
}

function issue({ severity = "warning", code, guide, stop = null, detail }) {
  return {
    severity,
    code,
    location: locationLabel(guide),
    guideId: guide.id,
    guideTitle: guide.title,
    stopName: stop?.name ?? null,
    detail,
  };
}

function guideRollCall(guide) {
  const description = normalize(guide.description).toLocaleLowerCase();
  const names = [];
  visitStops(guide.stops, (stop) => {
    const name = normalize(stop.name);
    if (name.length >= 4 && description.includes(name.toLocaleLowerCase())) names.push(name);
  });
  return [...new Set(names)];
}

function auditGuide(guide) {
  const issues = [];
  const description = normalize(guide.description);
  const frameMatches = new Map(REPEATED_FRAMES.map(([label]) => [label, []]));
  let stopCount = 0;

  if (META_GUIDE_PATTERN.test(description)) {
    issues.push(issue({ severity: "error", code: "guide-meta-copy", guide, detail: description }));
  }
  if (SOURCE_PROCESS_PATTERN.test(description)) {
    issues.push(issue({ severity: "error", code: "guide-source-process", guide, detail: description }));
  }
  if (ABSTRACT_PLANNING_PATTERN.test(description)) {
    issues.push(issue({ severity: "error", code: "guide-abstract-planning", guide, detail: description }));
  }
  if (GUIDE_SOFT_META_PATTERN.test(description) || IMPERATIVE_USE_PATTERN.test(description)) {
    issues.push(issue({ severity: "error", code: "guide-soft-meta", guide, detail: description }));
  }
  if (
    guide.location?.city &&
    ["Food", "Nightlife", "Stay", "Culture"].includes(guide.category) &&
    guide.submissionType !== "itinerary" &&
    GUIDE_ROLE_PATTERN.test(description)
  ) {
    issues.push(issue({ severity: "error", code: "guide-role-language", guide, detail: description }));
  }
  if (description.length > MAX_GUIDE_CHARACTERS) {
    issues.push(
      issue({
        code: "guide-too-long",
        guide,
        detail: `${description.length} characters (target <= ${MAX_GUIDE_CHARACTERS})`,
      }),
    );
  }

  const namedStops = guideRollCall(guide);
  if (namedStops.length >= 3) {
    issues.push(
      issue({
        severity: "error",
        code: "guide-venue-roll-call",
        guide,
        detail: namedStops.join(", "),
      }),
    );
  }

  visitStops(guide.stops, (stop) => {
    const stopDescription = normalize(stop.description);
    const words = wordCount(stopDescription);
    stopCount += 1;
    for (const [label, pattern] of REPEATED_FRAMES) {
      if (pattern.test(stopDescription)) frameMatches.get(label).push(stop.name);
    }

    if (ROUTE_FILLER_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-route-filler", guide, stop, detail: stopDescription }));
    }
    if (PERFORMED_VOICE_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-performed-voice", guide, stop, detail: stopDescription }));
    }
    if (STOP_ROLE_PATTERN.test(stopDescription) && stop.venueKind !== "transport") {
      issues.push(issue({ severity: "error", code: "stop-role-language", guide, stop, detail: stopDescription }));
    }
    if (SOURCE_PROCESS_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-source-process", guide, stop, detail: stopDescription }));
    }
    if (META_GUIDE_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-meta-copy", guide, stop, detail: stopDescription }));
    }
    if (ITINERARY_META_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-itinerary-meta", guide, stop, detail: stopDescription }));
    }
    if (ABSTRACT_PLANNING_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-abstract-planning", guide, stop, detail: stopDescription }));
    }
    if (IMPERATIVE_USE_PATTERN.test(stopDescription) && stop.venueKind !== "transport") {
      issues.push(issue({ severity: "error", code: "stop-imperative-use", guide, stop, detail: stopDescription }));
    }
    if (METAPHORICAL_ANCHOR_PATTERN.test(stopDescription) && !/\banchor\b/i.test(normalize(stop.name))) {
      issues.push(issue({ severity: "error", code: "stop-metaphorical-anchor", guide, stop, detail: stopDescription }));
    }
    if (guide.location?.city && BELONGS_PATTERN.test(stopDescription) && !LITERAL_BELONGS_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-selection-belongs", guide, stop, detail: stopDescription }));
    }
    if (guide.category !== "Essentials" && SUBJECTLESS_OPENER_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-subjectless-opener", guide, stop, detail: stopDescription }));
    }
    if (GUIDE_CONTAINER_PATTERN.test(stopDescription)) {
      issues.push(issue({ severity: "error", code: "stop-guide-container", guide, stop, detail: stopDescription }));
    }
    if (
      guide.location?.city &&
      !["Activities", "Essentials", "Routes"].includes(guide.category) &&
      ITINERARY_LANGUAGE_PATTERN.test(stopDescription)
    ) {
      issues.push(issue({ severity: "error", code: "stop-itinerary-language", guide, stop, detail: stopDescription }));
    }
    if (words < MIN_STOP_WORDS) {
      issues.push(
        issue({ code: "stop-too-thin", guide, stop, detail: `${words} words (target ${MIN_STOP_WORDS}-${MAX_STOP_WORDS})` }),
      );
    }
    if (words > MAX_STOP_WORDS) {
      issues.push(
        issue({ code: "stop-too-long", guide, stop, detail: `${words} words (target ${MIN_STOP_WORDS}-${MAX_STOP_WORDS})` }),
      );
    }

    for (const sentence of splitSentences(stopDescription)) {
      if (GENERIC_OPENER_PATTERN.test(sentence)) {
        issues.push(issue({ code: "stop-generic-opener", guide, stop, detail: sentence }));
      }
    }
  });

  for (const [label, stopNames] of frameMatches) {
    if (stopNames.length < 3 || stopNames.length / Math.max(stopCount, 1) < 0.3) continue;
    issues.push(
      issue({
        severity: "error",
        code: "guide-repeated-frame",
        guide,
        detail: `${label}: ${stopNames.length}/${stopCount} stops (${stopNames.join(", ")})`,
      }),
    );
  }

  return issues;
}

function duplicateGuideDescriptionIssues(guides) {
  const byDescription = new Map();
  for (const guide of guides) {
    const description = normalize(guide.description);
    if (!description) continue;
    const group = byDescription.get(description) ?? [];
    group.push(guide);
    byDescription.set(description, group);
  }

  return [...byDescription.entries()].flatMap(([description, group]) => {
    if (group.length < 2) return [];
    return group.map((guide) =>
      issue({
        severity: "error",
        code: "guide-duplicate-description",
        guide,
        detail: `${group.length} guides share: ${description}`,
      }),
    );
  });
}

function duplicateStopDescriptionIssues(guides) {
  const byDescription = new Map();
  for (const guide of guides) {
    visitStops(guide.stops, (stop) => {
      const description = normalize(stop.description);
      if (!description || description.length <= 80) return;
      const group = byDescription.get(description) ?? [];
      group.push({ guide, stop, name: normalize(stop.name).toLocaleLowerCase() });
      byDescription.set(description, group);
    });
  }

  return [...byDescription.entries()].flatMap(([description, group]) => {
    if (group.length < 2 || new Set(group.map((item) => item.name)).size < 2) return [];
    return group.map(({ guide, stop }) =>
      issue({
        severity: "error",
        code: "stop-duplicate-across-venues",
        guide,
        stop,
        detail: `${group.length} different venues share: ${description}`,
      }),
    );
  });
}

function summarize(issues) {
  const byCode = {};
  const byCity = {};
  for (const current of issues) {
    byCode[current.code] = (byCode[current.code] ?? 0) + 1;
    const city = current.location.split(" / ")[0];
    byCity[city] = (byCity[city] ?? 0) + 1;
  }
  return {
    total: issues.length,
    errors: issues.filter((current) => current.severity === "error").length,
    warnings: issues.filter((current) => current.severity === "warning").length,
    byCode: Object.fromEntries(Object.entries(byCode).sort((a, b) => b[1] - a[1])),
    byCity: Object.fromEntries(Object.entries(byCity).sort((a, b) => b[1] - a[1])),
  };
}

const options = parseArgs(process.argv.slice(2));
const allGuides = loadEditorialGuideLists();
const guides = allGuides.filter((guide) => {
  if (options.city && normalize(guide.location?.city).toLocaleLowerCase() !== options.city.toLocaleLowerCase()) return false;
  if (options.category && normalize(guide.category).toLocaleLowerCase() !== options.category.toLocaleLowerCase()) return false;
  return true;
});

if (!guides.length) throw new Error("No guides matched the requested copy-audit scope.");

const allIssues = [
  ...guides.flatMap(auditGuide),
  ...duplicateGuideDescriptionIssues(guides),
  ...duplicateStopDescriptionIssues(guides),
];
const issues = options.errorsOnly ? allIssues.filter((current) => current.severity === "error") : allIssues;
const summary = summarize(issues);

if (options.json) {
  console.log(JSON.stringify({ scope: { guides: guides.length, city: options.city, category: options.category }, summary, issues }, null, 2));
} else {
  console.log(`Editorial copy audit: ${guides.length} guides`);
  console.log(JSON.stringify(summary, null, 2));
  for (const current of issues.slice(0, Number.isFinite(options.limit) ? options.limit : 200)) {
    const stop = current.stopName ? ` / ${current.stopName}` : "";
    console.log(`[${current.severity}] ${current.code}: ${current.location} / ${current.guideTitle}${stop}`);
    console.log(`  ${current.detail}`);
  }
  if (issues.length > options.limit) console.log(`... ${issues.length - options.limit} more issues; increase --limit or use --json.`);
}

if (options.strict && summary.errors > 0) process.exitCode = 1;
