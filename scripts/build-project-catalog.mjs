import { mkdir, readdir, readFile, writeFile, cp, rm } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { repositoryUrl, pagesBase, appUrl, rawProjectBase, revision, appRevision } from "./publication-config.mjs";

const root = process.cwd();
const projectsDir = path.join(root, "projects");
const docsProjectsDir = path.join(root, "docs", "projects");
const output = path.join(root, "docs", "projects.md");
const repoUrl = repositoryUrl;
const pagesApp = appUrl;
const rawBase = rawProjectBase;

await mkdir(docsProjectsDir, { recursive: true });

const entries = [];
for (const dirent of await readdir(projectsDir, { withFileTypes: true })) {
  if (!dirent.isDirectory() || dirent.name.startsWith("_")) continue;
  const manifestPath = path.join(projectsDir, dirent.name, "project.json");
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    if (manifest.status !== "published") continue;
    entries.push({ slug: dirent.name, ...manifest });
  } catch (error) {
    throw new Error(`Failed to read ${manifestPath}: ${error.message}`);
  }
}

entries.sort((a, b) => String(b.updated ?? b.created).localeCompare(String(a.updated ?? a.created)));

function outputProjectUrl(output, project, encodedProjectUrl) {
  if (typeof output.project === "string" && output.project.trim()) {
    return `${rawBase}/${project.slug}/${output.project.trim()}`;
  }
  return decodeURIComponent(encodedProjectUrl);
}

function outputHref(output, project, encodedProjectUrl) {
  if (output.mode === "repository") {
    return `${repoUrl}/blob/${revision}/projects/${project.slug}/${output.path}`;
  }
  if (output.mode === "published") {
    return output.publicPath
      ? new URL(String(output.publicPath).replace(/^\/+/, ""), pagesBase).href
      : `${repoUrl}/tree/${revision}/projects/${project.slug}/${output.path ?? ""}`;
  }
  if (output.mode === "deep-link" || output.mode === "runtime-export") {
    const params = new URLSearchParams();
    if (output.output === "map") params.set("layout", "viewer");
    if (output.output === "maponly") params.set("maponly", "1");
    if (output.output && output.output !== "maponly") {
      params.set("returnTo", `../projects/${project.slug}/`);
      params.set("availableOutputs", (project.availableOutputs || [output.output]).join(","));
      params.set("toolbar", "none");
      if (output.output !== "map") { params.set("layout", "compact"); params.set("panels", "collapsed"); }
    }
    params.set("url", outputProjectUrl(output, project, encodedProjectUrl));
    if (output.output && output.output !== "maponly") params.set("output", output.output);
    if (output.format) params.set("format", output.format);
    if (output.kind === "video" && output.path) {
      params.set("videoStory", `${rawBase}/${project.slug}/${output.path}`);
    }
    return `${pagesApp}?${params.toString()}`;
  }
  return `${pagesApp}?url=${encodedProjectUrl}`;
}

async function readOutputRegistry(project) {
  if (project.outputRegistry !== "outputs.json") return null;
  const file = path.join(projectsDir, project.slug, "outputs.json");
  return JSON.parse(await readFile(file, "utf8"));
}

async function readGeoLibreProject(project) {
  const file = path.join(projectsDir, project.slug, "project.geolibre");
  return JSON.parse(await readFile(file, "utf8"));
}

async function readOptionalJson(project, filename) {
  try {
    return JSON.parse(await readFile(path.join(projectsDir, project.slug, filename), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw new Error(`Failed to read projects/${project.slug}/${filename}: ${error.message}`);
  }
}

function repositoryFileHref(project, filename) {
  return `${repoUrl}/blob/${revision}/projects/${project.slug}/${filename}`;
}

function socialVideoLines(project, videoStory, encodedProjectUrl) {
  if (!videoStory?.scenes?.length) return [];
  const durationMs = videoStory.scenes.reduce(
    (sum, scene) => sum + (Number.isFinite(scene.durationMs) ? scene.durationMs : 0),
    0,
  );
  const captionCount = videoStory.scenes.filter((scene) => scene.caption).length;
  const narrationCount = videoStory.scenes.filter((scene) => scene.narration).length;
  const rawVideoStory = `${rawBase}/${project.slug}/video-story.json`;
  const variants = [
    ["tiktok", "TikTok 9:16"],
    ["reel", "Instagram Reel 9:16"],
    ["short", "YouTube Short 9:16"],
    ["standard", "16:9 explainer"],
  ];

  const lines = [
    "## Social video",
    "",
    `**${videoStory.title}** · ${(durationMs / 1000).toFixed(0)} seconds · ${videoStory.scenes.length} scenes`,
    "",
    `Captions: **${captionCount}** · Narration beats: **${narrationCount}** · One analytical timeline, multiple render presets.`,
    "",
  ];
  for (const [preset, label] of variants) {
    const params = new URLSearchParams();
    params.set("url", decodeURIComponent(encodedProjectUrl));
    params.set("output", "video");
    params.set("videoStory", rawVideoStory);
    params.set("videoPreset", preset);
    lines.push(`[${label}](${pagesApp}?${params.toString()}){ .md-button${preset === "tiktok" ? " .md-button--primary" : ""} }`);
  }
  lines.push(
    "",
    "Each variant previews and exports from the same versioned `video-story.json`; only the social render profile changes.",
    "",
  );
  return lines;
}

function embedLines(project, registry, encodedProjectUrl) {
  const mapOnly = `${pagesApp}?maponly=1&welcome=0&url=${encodedProjectUrl}`;
  const standalone = registry?.outputs?.find((item) => item.kind === "html");
  const lines = [
    "## Embed & reuse",
    "",
    `[Map-only embed](${mapOnly}){ .md-button .md-button--primary }`,
  ];
  if (standalone) {
    lines.push(
      `[Standalone HTML](${outputHref(standalone, project, encodedProjectUrl)}){ .md-button }`,
    );
  }
  lines.push(
    "",
    "Embed the live public project without duplicating its data or analysis:",
    "",
    "```html",
    `<iframe src="${mapOnly}" width="100%" height="600" loading="lazy"></iframe>`,
    "```",
    "",
  );
  return lines;
}

function methodAndProvenanceLines(project, indicators, scenarios, sources) {
  const lines = ["## Method & provenance", ""];
  if (indicators) {
    const count = Array.isArray(indicators.indicators) ? indicators.indicators.length : 0;
    lines.push(
      `**Analysis unit:** ${indicators.analysisUnit || "—"}  `,
      `**Analysis year:** ${indicators.analysisYear ?? "—"}  `,
      `**Indicators:** ${count}`,
      "",
    );
  }
  if (Array.isArray(indicators?.indicators)) {
    lines.push("| Indicator | Unit | Year | Direction |", "| --- | --- | --- | --- |",
      ...indicators.indicators.map(i => `| ${i.title} | ${i.unit || "See source"} | ${i.year || indicators.analysisYear || "Unknown"} | ${i.direction} |`), "",
      "SQL and runtime use average ranks for ties. Invalid values remain missing. Available weights determine the score, while confidence reports weighted data coverage.", "");
  }
  if (Array.isArray(scenarios?.scenarios) && scenarios.scenarios.length) {
    lines.push(
      "**Policy scenarios**",
      "",
      ...scenarios.scenarios.map((scenario) => `- ${scenario.title || scenario.id}`),
      "",
    );
  }
  if (Array.isArray(sources?.sources) && sources.sources.length) {
    const cell = value => String(value ?? "Unknown").replaceAll("|", "\\|").replaceAll("\n", " ");
    lines.push("### Sources", "", "| Source | Publisher | Retrieved | License | Role |", "| --- | --- | --- | --- | --- |",
      ...sources.sources.map(source => `| [${cell(source.name || source.id)}](${source.url}) | ${cell(source.publisher)} | ${cell(source.retrieved)} | ${cell(source.license)} | ${cell(source.role)} |`), "",
      ...sources.sources.map(source => `- ${cell(source.name)}: ${cell(source.notes || "Live source. See metadata for reproduction details.")}`), "");
  }

  lines.push(
    `[Analysis SQL](${repositoryFileHref(project, "analysis.sql")}){ .md-button }`,
    `[Sources](${repositoryFileHref(project, "sources.json")}){ .md-button }`,
  );
  if (indicators) {
    lines.push(`[Indicators](${repositoryFileHref(project, "indicators.json")}){ .md-button }`);
  }
  if (scenarios) {
    lines.push(`[Scenarios](${repositoryFileHref(project, "scenarios.json")}){ .md-button }`);
  }
  lines.push(
    `[Project README](${repositoryFileHref(project, "README.md")}){ .md-button }`,
    "",
    "All publication outputs resolve back to these versioned project files.",
    "",
  );
  return lines;
}

function exportCenterLines(project, registry, encodedProjectUrl) {
  if (!registry?.outputs?.length) return [];
  const lines = ["## Downloads & exports", ""];
  const data = registry.outputs.find((item) => item.kind === "data");
  if (Array.isArray(data?.formats) && data.formats.length) {
    lines.push("### Data", "");
    for (const format of data.formats) {
      const href = outputHref({ ...data, format }, project, encodedProjectUrl);
      lines.push(`[${String(format).toUpperCase()}](${href}){ .md-button }`);
    }
    lines.push("");
  }

  const exportKinds = new Set(["print", "atlas", "html", "video"]);
  const extras = registry.outputs.filter((item) => exportKinds.has(item.kind));
  if (extras.length) {
    lines.push("### Publication exports", "");
    for (const item of extras) {
      lines.push(
        `[${item.title}](${outputHref(item, project, encodedProjectUrl)}){ .md-button }`,
      );
    }
    lines.push("");
  }

  lines.push(
    "Runtime exports are generated from the currently loaded project so scenario and weight changes are reflected in the exported result.",
    "",
  );
  return lines;
}

function projectPreviewLines(project, geolibre, encodedProjectUrl) {
  const widgets = Array.isArray(geolibre.widgets) ? geolibre.widgets.length : 0;
  const chapters = Array.isArray(geolibre.storymap?.chapters) ? geolibre.storymap.chapters : [];
  const priority = geolibre.plugins?.settings?.["investment-priority-lab"];
  const indicators = Array.isArray(priority?.indicators) ? priority.indicators.length : 0;
  const scenarios = Array.isArray(priority?.scenarios) ? priority.scenarios.length : 0;
  const mapPreview = `${pagesApp}?maponly=1&welcome=0&url=${encodedProjectUrl}`;

  const lines = ["## Preview", "", `![${project.title}: analysis area, geometry only](../assets/projects/${project.slug}.png)`, "",
    '<details class="interactive-preview"><summary>Load interactive map</summary>',
    `<iframe title="${escapeHtml(project.title)} map preview" data-src="${mapPreview}" loading="lazy" style="width:100%;height:420px;border:1px solid rgba(127,127,127,.28);border-radius:10px"></iframe>`,
    '</details>', "", `[Open interactive map](${outputHref({mode:"deep-link",output:"map"}, project, encodedProjectUrl)})`, ""];
  return lines;
}

function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

const lines = [
  "# Projects",
  "",
  "Public, reproducible spatial research projects authored in this repository.",
  "",
  "Each project stores its GeoLibre workspace, SQL, source provenance, and documentation together in Git.",
  ""
];

lines.push('<div id="project-filters" aria-label="Filter projects"></div>', '<p id="project-filter-status" role="status" aria-live="polite"></p>', '<div id="project-catalog" markdown>');
if (entries.length === 0) {
  lines.push("No published projects yet.");
} else {
  for (const p of entries) {
    const projectUrl = `${rawBase}/${p.slug}/project.geolibre`;
    const encoded = encodeURIComponent(projectUrl);
    const registry = await readOutputRegistry(p);
    p.availableOutputs = [...new Set((registry?.outputs || []).filter(item => item.output && item.output !== "maponly" && item.availability !== "unavailable").map(item => item.output))];
    const mapOutput = registry?.outputs.find(item => item.output === "map") || {mode:"deep-link",output:"map"};
    const topics = Array.isArray(p.topics) && p.topics.length ? p.topics.join(", ") : "—";
    const pagePath = `projects/${p.slug}.md`;
    lines.push(
      `<section class="project-card" data-title="${escapeHtml(p.title)}" data-region="${escapeHtml(p.location)}" data-topics="${escapeHtml(p.topics.join("|"))}" data-outputs="${escapeHtml(p.outputs.join("|"))}" data-updated="${escapeHtml(p.updated || p.created)}" markdown>`,
      `## ${p.title}`,
      "",
      p.summary,
      "",
      `![${p.title}: analysis extent](assets/projects/${p.slug}.png)`,
      "",
      `- Location: ${p.location || "—"}`,
      `- Topics: ${topics}`,
      `- Outputs: ${p.outputs.join(", ")}`,
      `- Updated: ${p.updated || p.created}`,
      "",
      `[Open project page](projects/${p.slug}.md){ .md-button .md-button--primary }`,
      `[Open map](${outputHref(mapOutput, p, encoded)}){ .md-button }`,
      "</section>",
      ""
    );

    const geolibreProject = await readGeoLibreProject(p);
    const indicators = await readOptionalJson(p, "indicators.json");
    const scenarios = await readOptionalJson(p, "scenarios.json");
    const sources = await readOptionalJson(p, "sources.json");
    const health = await readOptionalJson(p, "source-health.json");
    const videoStory = await readOptionalJson(p, "video-story.json");
    p.availableOutputs = [...new Set((registry?.outputs || []).filter(item => item.output && item.output !== "maponly" && item.availability !== "unavailable").map(item => item.output))];
    const featured = registry?.outputs.find(item => item.id === registry.featured);
    const projectLines = [
      `[All projects](../projects.md)`, "", `# ${p.title}`, "", p.question || p.summary, "",
      `Publication: [${revision.slice(0, 12)}](${repoUrl}/commit/${revision}) · App build: ${appRevision.slice(0, 12)}. Project files use the linked publication revision.`, "",
      `Data year: ${p.analysisYear || "See sources"} · ${p.location || ""} · Updated: ${p.updated || p.created}`, "",
      "## Reading the result", "", p.interpretation || p.summary, "",
      ...(p.limitations || []).map(text => `- ${text}`), "",
      ...(featured ? [`[${featured.title}](${outputHref(featured, p, encoded)}){ .md-button .md-button--primary }`, ""] : []),
      ...projectPreviewLines(p, geolibreProject, encoded),
    ];
    const groups = [
      ["Explore", new Set(["map", "dashboard", "story", "video"])],
      ["Export", new Set(["print", "atlas", "data", "html"])],
    ];
    for (const [title, kinds] of groups) {
      const items = registry?.outputs.filter(item => kinds.has(item.kind) && item.id !== registry.featured) || [];
      if (!items.length) continue;
      projectLines.push(`## ${title}`, "", '<div class="grid cards" markdown>');
      for (const item of items) {
        const action = item.action === "prepare-export" ? "Prepare" : item.action === "download" ? "Download" : "Open";
        projectLines.push("", `-   **${item.title}**`, "", `    ${item.description || (item.kind === "data" ? "Export project data in the browser." : "Open the configured result.")}`, "",
          `    ${item.availability === "runtime" ? "Generated or opened in your browser" : "Published result"}`, "",
          ...(item.availability === "unavailable" ? ["    Unavailable for this publication"] : [`    [${action} ${item.title}](${outputHref(item, p, encoded)}){ .md-button }`]));
      }
      projectLines.push("", "</div>", "");
    }
    const shareProjectUrl = new URL(`../projects/${p.slug}/`, pagesApp).href;
    const embedUrl = `${pagesApp}?maponly=1&welcome=0&url=${encoded}`;
    const shareFields = [["project-link", "Project link", shareProjectUrl],
      ...((registry?.outputs || []).filter(item => item.output && item.availability !== "unavailable").map(item => [`output-${item.id}`, item.title, outputHref(item, p, encoded)])),
      ["project-embed", "Embed HTML", `<iframe title="${escapeHtml(p.title)}" src="${escapeHtml(embedUrl)}" width="100%" height="600" loading="lazy"></iframe>`]];
    projectLines.push("## Share", "", "These links open the published project settings. Local filters and scenario changes are not included. Use the workspace to save a separate exploration.", "");
    for (const [id, label, value] of shareFields) projectLines.push(`<label for="${escapeHtml(id)}">${escapeHtml(label)}</label><textarea id="${escapeHtml(id)}" rows="2" readonly>${escapeHtml(value)}</textarea>`,
      `<button type="button" data-copy-target="${escapeHtml(id)}" data-copy-message="Copied link or embed.">Copy ${escapeHtml(label)}</button><span class="copy-status" role="status" aria-live="polite"></span>`, "");
    projectLines.push(...methodAndProvenanceLines(p, indicators, scenarios, sources));
    if (health) projectLines.push("### Source health", "", `Last bounded HTTP check: ${health.checkedAt}. This is not a browser-rendering test.`, "",
      "| Source | HTTP check | Browser access |", "| --- | --- | --- |",
      ...health.sources.map(source => `| ${source.id} | ${source.error ? "Check failed" : source.status} | ${source.corsAllowOrigin === "*" ? "Public CORS header" : "Verify in browser"} |`), "", health.fallbackPolicy, "",
      `[Detailed check report](${repositoryFileHref(p, "source-health.json")})`, "");
    const request = `Update GeoLibre project ${p.slug} in ${new URL(repositoryUrl).pathname.slice(1)}.\nProject: ${repoUrl}/tree/${revision}/projects/${p.slug}\nQuestion: ${p.question || p.summary}\nData year: ${p.analysisYear || "See sources.json"}\nRequested change: [describe the change]\nPublication revision: ${revision}. Inspect the latest main revision before applying changes. Preserve sources.json, analysis.sql and the project format. Update output registrations, validate and publish through a focused PR.`;
    projectLines.push("## Request an update", "", "Copy this request into ChatGPT and describe your change. Your GitHub connection performs the repository work.", "",
      `<label for="project-request">ChatGPT request</label><textarea id="project-request" rows="8" readonly>${escapeHtml(request)}</textarea>`,
      '<button type="button" data-copy-target="project-request">Copy request</button><span class="copy-status" role="status" aria-live="polite"></span>', "");
    projectLines.push("## Advanced workspace", "", `[Open full workspace](${pagesApp}?url=${encoded}){ .md-button }`, "",
      `[Repository files](${repoUrl}/tree/${revision}/projects/${p.slug})`, "");
    await writeFile(path.join(docsProjectsDir, `${p.slug}.md`), projectLines.join("\n") + "\n", "utf8");
  }
}

lines.push("</div>");
await writeFile(output, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${entries.length} project(s) and project page(s) to ${output}`);

const bundleDirectory = path.join(root, "docs", "project-data");
await rm(bundleDirectory, { recursive: true, force: true });
const publications = [];
for (const project of entries) {
  const files = {};
  const directory = path.join(projectsDir, project.slug);
  const target = path.join(bundleDirectory, project.slug);
  await mkdir(target, { recursive: true });
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (!item.isFile() || !/\.(json|geolibre|sql|geojson|csv|png|jpg|pdf|webm|mp4)$/.test(item.name)) continue;
    const content = await readFile(path.join(directory, item.name));
    files[item.name] = { sha256: createHash("sha256").update(content).digest("hex"), bytes: content.length };
    await cp(path.join(directory, item.name), path.join(target, item.name));
  }
  publications.push({ id: project.slug, revision, files, dataRevision: "Live remote sources, see sources.json. File hashes identify configuration, not remote data." });
}
await writeFile(path.join(root, "docs", "publication.json"), JSON.stringify({ revision, appRevision, pagesBase, repositoryUrl, projects: publications }, null, 2) + "\n");
