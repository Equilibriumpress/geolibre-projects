import { readFile, readdir, stat } from "node:fs/promises";
const budgets = { html: 100_000, preview: 65_536 };
const files = ["site/index.html", "site/projects/index.html"];
for (const entry of await readdir("projects", { withFileTypes:true })) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const project = JSON.parse(await readFile(`projects/${entry.name}/project.json`, "utf8"));
  if (project.status !== "published") continue;
  files.push(`site/projects/${entry.name}/index.html`, `site/assets/projects/${entry.name}.png`);
}
for (const file of files) {
  const bytes = (await stat(file)).size;
  const budget = file.endsWith(".png") ? budgets.preview : budgets.html;
  if (bytes > budget) throw new Error(`${file}: ${bytes} bytes exceeds ${budget}`);
  console.log(`${file}: ${bytes} / ${budget} bytes`);
}
