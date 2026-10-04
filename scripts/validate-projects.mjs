import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const projectsRoot = path.join(root, "projects");
const requiredFiles = [
  "project.json",
  "project.geolibre",
  "analysis.sql",
  "sources.json",
  "README.md",
];

const forbiddenPatterns = [
  { label: "local file URL", re: /file:\/\//i },
  { label: "macOS user path", re: /\/Users\// },
  { label: "Windows user path", re: /[A-Za-z]:\\Users\\/ },
  { label: "localhost URL", re: /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i },
  { label: "API key in URL/text", re: /(?:api[_-]?key|apikey)\s*[=:]\s*[^\s"&]+/i },
  { label: "access token in URL/text", re: /(?:access[_-]?token|token)\s*[=:]\s*[^\s"&]+/i },
  { label: "bearer credential", re: /bearer\s+[A-Za-z0-9._~+\/-]{12,}/i },
  { label: "OpenAI-style secret", re: /\bsk-[A-Za-z0-9_-]{16,}\b/ },
];

function fail(errors, slug, message) {
  errors.push(`${slug}: ${message}`);
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isHttps(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const dirents = await readdir(projectsRoot, { withFileTypes: true });
const projectDirs = dirents
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
  .map((entry) => entry.name)
  .sort();

const errors = [];

for (const slug of projectDirs) {
  const dir = path.join(projectsRoot, slug);

  for (const file of requiredFiles) {
    try {
      await access(path.join(dir, file));
    } catch {
      fail(errors, slug, `missing required file ${file}`);
    }
  }

  let manifest;
  let geolibre;
  let provenance;
  let indicators;
  let scenarios;
  let outputRegistry;
  let videoStory;

  try {
    manifest = JSON.parse(await readFile(path.join(dir, "project.json"), "utf8"));
  } catch (error) {
    fail(errors, slug, `project.json is invalid JSON: ${error.message}`);
  }

  try {
    geolibre = JSON.parse(await readFile(path.join(dir, "project.geolibre"), "utf8"));
  } catch (error) {
    fail(errors, slug, `project.geolibre is invalid JSON: ${error.message}`);
  }

  try {
    provenance = JSON.parse(await readFile(path.join(dir, "sources.json"), "utf8"));
  } catch (error) {
    fail(errors, slug, `sources.json is invalid JSON: ${error.message}`);
  }

  try {
    indicators = JSON.parse(await readFile(path.join(dir, "indicators.json"), "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      fail(errors, slug, `indicators.json is invalid JSON: ${error.message}`);
    }
  }

  try {
    scenarios = JSON.parse(await readFile(path.join(dir, "scenarios.json"), "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      fail(errors, slug, `scenarios.json is invalid JSON: ${error.message}`);
    }
  }

  try {
    outputRegistry = JSON.parse(await readFile(path.join(dir, "outputs.json"), "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      fail(errors, slug, `outputs.json is invalid JSON: ${error.message}`);
    }
  }

  try {
    videoStory = JSON.parse(await readFile(path.join(dir, "video-story.json"), "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      fail(errors, slug, `video-story.json is invalid JSON: ${error.message}`);
    }
  }

  if ((indicators && !scenarios) || (!indicators && scenarios)) {
    fail(errors, slug, "Scenario Lab projects must include both indicators.json and scenarios.json");
  }

  if (manifest) {
    if (manifest.id !== slug) fail(errors, slug, "manifest id must match directory name");
    if (typeof manifest.title !== "string" || manifest.title.length < 3) fail(errors, slug, "title is required");
    if (typeof manifest.summary !== "string" || manifest.summary.length < 10) fail(errors, slug, "summary is required");
    if (!["draft", "published", "archived"].includes(manifest.status)) fail(errors, slug, "status must be draft, published, or archived");
    if (!isDate(manifest.created)) fail(errors, slug, "created must be YYYY-MM-DD");
    if (manifest.updated && !isDate(manifest.updated)) fail(errors, slug, "updated must be YYYY-MM-DD");
    if (!Array.isArray(manifest.topics)) fail(errors, slug, "topics must be an array");
    if (manifest.project !== "project.geolibre") fail(errors, slug, "project must point to project.geolibre");
    if (manifest.analysis !== "analysis.sql") fail(errors, slug, "analysis must point to analysis.sql");
    if (manifest.sources !== "sources.json") fail(errors, slug, "sources must point to sources.json");
    if (!["remote-first", "snapshot", "mixed"].includes(manifest.dataPolicy)) fail(errors, slug, "invalid dataPolicy");
    if (!Array.isArray(manifest.outputs) || manifest.outputs.length === 0) fail(errors, slug, "outputs must contain at least one output type");
    if (manifest.outputRegistry !== undefined && manifest.outputRegistry !== "outputs.json") {
      fail(errors, slug, "outputRegistry must point to outputs.json");
    }
    if (manifest.outputRegistry === "outputs.json" && !outputRegistry) {
      fail(errors, slug, "outputRegistry points to missing or invalid outputs.json");
    }
    if (manifest.videoStory !== undefined && manifest.videoStory !== "video-story.json") {
      fail(errors, slug, "videoStory must point to video-story.json");
    }
    if (manifest.videoStory === "video-story.json" && !videoStory) {
      fail(errors, slug, "videoStory points to missing or invalid video-story.json");
    }
  }

  if (geolibre) {
    if (geolibre.version !== "0.1.0") fail(errors, slug, "project.geolibre version must be 0.1.0");
    if (typeof geolibre.name !== "string" || geolibre.name.length < 3) fail(errors, slug, "project.geolibre name is required");
    if (!geolibre.mapView || !Array.isArray(geolibre.mapView.center) || geolibre.mapView.center.length !== 2) fail(errors, slug, "mapView.center must be [longitude, latitude]");
    if (!Array.isArray(geolibre.layers)) {
      fail(errors, slug, "layers must be an array");
    } else {
      for (const [index, layer] of geolibre.layers.entries()) {
        const url = layer?.source?.url;
        const isRemoteGeoJson =
          layer?.type === "geojson" &&
          typeof url === "string" &&
          url.trim() !== "" &&
          !layer.geojson;
        if (isRemoteGeoJson) {
          const sourceKind = layer?.metadata?.sourceKind;
          const restorable =
            sourceKind === "maplibre-gl-vector-adopted" ||
            (sourceKind === "maplibre-gl-vector" &&
              layer?.metadata?.externalNativeLayer === true);
          if (!restorable) {
            fail(
              errors,
              slug,
              `layers[${index}] is URL-backed GeoJSON without GeoLibre vector restore metadata`,
            );
          }
        }
      }
    }
    if (geolibre.styles !== undefined && (typeof geolibre.styles !== "object" || Array.isArray(geolibre.styles))) fail(errors, slug, "styles must be an object");
  }

  if (provenance) {
    if (!Array.isArray(provenance.sources)) {
      fail(errors, slug, "sources.json must contain a sources array");
    } else {
      for (const [index, source] of provenance.sources.entries()) {
        const prefix = `sources[${index}]`;
        for (const key of ["id", "name", "publisher", "url", "retrieved", "role"]) {
          if (!source[key]) fail(errors, slug, `${prefix} missing ${key}`);
        }
        if (source.url && !isHttps(source.url)) fail(errors, slug, `${prefix}.url must use HTTPS`);
        if (source.retrieved && !isDate(source.retrieved)) fail(errors, slug, `${prefix}.retrieved must be YYYY-MM-DD`);
      }
    }
  }

  if (indicators) {
    if (typeof indicators.analysisUnit !== "string" || indicators.analysisUnit.length < 2) {
      fail(errors, slug, "indicators.json analysisUnit is required");
    }
    if (!Array.isArray(indicators.indicators) || indicators.indicators.length === 0) {
      fail(errors, slug, "indicators.json must contain indicators");
    } else {
      const ids = new Set();
      for (const [index, indicator] of indicators.indicators.entries()) {
        const prefix = `indicators[${index}]`;
        if (!indicator?.id || typeof indicator.id !== "string") fail(errors, slug, `${prefix}.id is required`);
        if (indicator?.id && ids.has(indicator.id)) fail(errors, slug, `duplicate indicator id ${indicator.id}`);
        if (indicator?.id) ids.add(indicator.id);
        if (!indicator?.title) fail(errors, slug, `${prefix}.title is required`);
        if (!["higher-is-worse", "lower-is-worse"].includes(indicator?.direction)) {
          fail(errors, slug, `${prefix}.direction is invalid`);
        }
        const hasField = typeof indicator?.field === "string" && indicator.field.length > 0;
        const hasRatio =
          typeof indicator?.numeratorField === "string" &&
          indicator.numeratorField.length > 0 &&
          typeof indicator?.denominatorField === "string" &&
          indicator.denominatorField.length > 0;
        if (!hasField && !hasRatio) fail(errors, slug, `${prefix} needs field or numeratorField + denominatorField`);
        if (indicator?.quality !== undefined && (indicator.quality < 0 || indicator.quality > 1)) {
          fail(errors, slug, `${prefix}.quality must be between 0 and 1`);
        }
      }
    }
  }

  if (scenarios) {
    if (!Array.isArray(scenarios.scenarios) || scenarios.scenarios.length === 0) {
      fail(errors, slug, "scenarios.json must contain scenarios");
    } else {
      const indicatorIds = new Set((indicators?.indicators ?? []).map((item) => item.id));
      const scenarioIds = new Set();
      for (const [index, scenario] of scenarios.scenarios.entries()) {
        const prefix = `scenarios[${index}]`;
        if (!scenario?.id) fail(errors, slug, `${prefix}.id is required`);
        if (scenario?.id && scenarioIds.has(scenario.id)) fail(errors, slug, `duplicate scenario id ${scenario.id}`);
        if (scenario?.id) scenarioIds.add(scenario.id);
        if (!scenario?.title) fail(errors, slug, `${prefix}.title is required`);
        if (!scenario?.weights || typeof scenario.weights !== "object" || Array.isArray(scenario.weights)) {
          fail(errors, slug, `${prefix}.weights must be an object`);
        } else {
          for (const [indicatorId, weight] of Object.entries(scenario.weights)) {
            if (!indicatorIds.has(indicatorId)) fail(errors, slug, `${prefix} references unknown indicator ${indicatorId}`);
            if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0) {
              fail(errors, slug, `${prefix}.weights.${indicatorId} must be a non-negative number`);
            }
          }
        }
      }
      if (!scenarioIds.has(scenarios.defaultScenario)) {
        fail(errors, slug, "defaultScenario must reference a scenario id");
      }
    }
  }

  if (outputRegistry) {
    const validKinds = new Set(["map", "dashboard", "story", "print", "atlas", "data", "analysis", "html", "video", "embed"]);
    const validModes = new Set(["deep-link", "published", "runtime-export", "repository"]);
    if (!Array.isArray(outputRegistry.outputs) || outputRegistry.outputs.length === 0) {
      fail(errors, slug, "outputs.json must contain outputs");
    } else {
      const ids = new Set();
      if (outputRegistry.outputs.filter((item) => item.primary).length > 1) fail(errors, slug, "only one primary output is allowed");
      for (const [index, output] of outputRegistry.outputs.entries()) {
        const prefix = `outputs[${index}]`;
        if (output.availability && !["published", "runtime", "unavailable"].includes(output.availability)) fail(errors, slug, `${prefix}.availability is invalid`);
        if (output.action === "download" && output.mode !== "published") fail(errors, slug, `${prefix} download requires a published file`);
        if (["repository", "published"].includes(output.mode)) {
          if (!output.path || output.path.includes("..") || path.isAbsolute(output.path)) fail(errors, slug, `${prefix}.path is unsafe`);
          else { try { await access(path.join(dir, output.path)); } catch { fail(errors, slug, `${prefix} file is missing`); } }
        }

        if (!output?.id || typeof output.id !== "string") fail(errors, slug, `${prefix}.id is required`);
        if (output?.id && ids.has(output.id)) fail(errors, slug, `duplicate output id ${output.id}`);
        if (output?.id) ids.add(output.id);
        if (!output?.title) fail(errors, slug, `${prefix}.title is required`);
        if (!validKinds.has(output?.kind)) fail(errors, slug, `${prefix}.kind is invalid`);
        if (!validModes.has(output?.mode)) fail(errors, slug, `${prefix}.mode is invalid`);
        if (output?.mode === "deep-link" && typeof output.output !== "string") {
          fail(errors, slug, `${prefix}.output is required for deep-link outputs`);
        }
        if ((output?.mode === "published" || output?.mode === "repository") && typeof output.path !== "string") {
          fail(errors, slug, `${prefix}.path is required for ${output.mode} outputs`);
        }
        if (output?.project !== undefined) {
          if (
            typeof output.project !== "string" ||
            !output.project.endsWith(".geolibre") ||
            output.project.includes("..") ||
            path.isAbsolute(output.project)
          ) {
            fail(errors, slug, `${prefix}.project must be a safe relative .geolibre path`);
          } else {
            try {
              await access(path.join(dir, output.project));
            } catch {
              fail(errors, slug, `${prefix}.project points to missing ${output.project}`);
            }
          }
        }
      }
      if (outputRegistry.featured && !ids.has(outputRegistry.featured)) {
        fail(errors, slug, "outputs.json featured must reference an output id");
      }
    }
  }

  if (videoStory) {
    const validSceneTypes = new Set(["title", "map", "highlight", "chart", "kpi", "comparison", "conclusion", "cta"]);
    const validPresets = new Set(["tiktok", "reel", "short", "square", "standard", "custom"]);
    const validRatios = new Set(["9:16", "1:1", "16:9"]);
    const projectLayerIds = new Set((geolibre?.layers ?? []).map((layer) => layer?.id).filter(Boolean));
    const storyChapterIds = new Set((geolibre?.storymap?.chapters ?? []).map((chapter) => chapter?.id).filter(Boolean));
    if (videoStory.version !== "0.1.0") fail(errors, slug, "video-story.json version must be 0.1.0");
    if (!validPresets.has(videoStory.preset)) fail(errors, slug, "video-story.json preset is invalid");
    if (!validRatios.has(videoStory.aspectRatio)) fail(errors, slug, "video-story.json aspectRatio is invalid");
    if (!Number.isInteger(videoStory.fps) || videoStory.fps < 24 || videoStory.fps > 60) {
      fail(errors, slug, "video-story.json fps must be 24..60");
    }
    if (!Array.isArray(videoStory.scenes) || videoStory.scenes.length === 0) {
      fail(errors, slug, "video-story.json must contain scenes");
    } else {
      const ids = new Set();
      for (const [index, scene] of videoStory.scenes.entries()) {
        const prefix = `video scenes[${index}]`;
        if (!scene?.id || typeof scene.id !== "string") fail(errors, slug, `${prefix}.id is required`);
        if (scene?.id && ids.has(scene.id)) fail(errors, slug, `duplicate video scene id ${scene.id}`);
        if (scene?.id) ids.add(scene.id);
        if (!validSceneTypes.has(scene?.type)) fail(errors, slug, `${prefix}.type is invalid`);
        if (!Number.isInteger(scene?.durationMs) || scene.durationMs < 500 || scene.durationMs > 20000) {
          fail(errors, slug, `${prefix}.durationMs must be 500..20000`);
        }
        if (scene?.routeFollow !== undefined && !scene?.routeLayerId) {
          fail(errors, slug, `${prefix}.routeFollow requires routeLayerId`);
        }
        if (scene?.routeLayerId && !projectLayerIds.has(scene.routeLayerId)) {
          fail(errors, slug, `${prefix}.routeLayerId references unknown layer ${scene.routeLayerId}`);
        }
        if (scene?.sourceStoryChapterId && !storyChapterIds.has(scene.sourceStoryChapterId)) {
          fail(errors, slug, `${prefix}.sourceStoryChapterId references unknown chapter ${scene.sourceStoryChapterId}`);
        }
      }
    }
  }

  const filesToScan = [...requiredFiles, "indicators.json", "scenarios.json", "outputs.json", "video-story.json"];
  for (const file of filesToScan) {
    try {
      const text = await readFile(path.join(dir, file), "utf8");
      for (const { label, re } of forbiddenPatterns) {
        if (re.test(text)) fail(errors, slug, `${file} contains forbidden ${label}`);
      }
    } catch {
      // Required missing files are reported above; advanced files are optional.
    }
  }
}

if (errors.length) {
  console.error(`Project validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${projectDirs.length} repository project(s).`);
