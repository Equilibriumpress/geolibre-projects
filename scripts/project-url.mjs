import { rawProjectBase, appUrl, repositoryUrl, revision } from "./publication-config.mjs";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run projects:url -- <project-slug>");
  process.exit(1);
}

const manifestPath = path.join(process.cwd(), "projects", slug, "project.json");
try {
  await access(manifestPath);
} catch {
  console.error(`Unknown project: ${slug}`);
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const raw = `${rawProjectBase}/${slug}/project.geolibre`;
const encoded = encodeURIComponent(raw);
const app = appUrl;

console.log(`Project: ${manifest.title}`);
console.log(`Raw:       ${raw}`);
console.log(`Workspace: ${app}?url=${encoded}`);
console.log(`Viewer:    ${app}?layout=viewer&url=${encoded}`);
console.log(`Map only:  ${app}?maponly&url=${encoded}`);
console.log(`Source:    ${repositoryUrl}/tree/${revision}/projects/${slug}`);
