import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import Ajv from "ajv/dist/2020.js";
const ajv = new Ajv({ allErrors:true });
ajv.addFormat("date", { type:"string", validate(value) { try { return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0,10) === value; } catch { return false; } } });
const contracts = new Map();
for (const [file, schema] of [["project.json","project-manifest"],["sources.json","sources"],["indicators.json","priority-indicators"],["scenarios.json","priority-scenarios"],["outputs.json","project-outputs"],["video-story.json","video-story"]]) contracts.set(file, ajv.compile(JSON.parse(await readFile(`schemas/${schema}.schema.json`,"utf8"))));
const read = async file => JSON.parse(await readFile(file,"utf8"));
const modes = new Set(["map","maponly","dashboard","story","print","atlas","data","analysis","video"]);
function references(project, story, prefix) {
  const layers = new Set((project.layers || []).map(layer => layer.id));
  for (const id of project.plugins?.settings?.["investment-priority-lab"]?.deferredLayerIds || []) layers.add(id);
  const widgets = new Set((project.widgets || []).map(widget => widget.id));
  const chapters = new Set((project.storymap?.chapters || []).map(chapter => chapter.id));
  for (const widget of project.widgets || []) if (!layers.has(widget.layerId)) throw new Error(`${prefix}: widget ${widget.id} has unknown layer ${widget.layerId}`);
  for (const scene of story?.scenes || []) {
    if (scene.layerId && !layers.has(scene.layerId)) throw new Error(`${prefix}: unknown scene layer ${scene.layerId}`);
    if (scene.widgetId && !widgets.has(scene.widgetId)) throw new Error(`${prefix}: unknown scene widget ${scene.widgetId}`);
    if (scene.sourceStoryChapterId && !chapters.has(scene.sourceStoryChapterId)) throw new Error(`${prefix}: unknown story chapter ${scene.sourceStoryChapterId}`);
    for (const cue of scene.cues || []) if (cue.layerId && !layers.has(cue.layerId)) throw new Error(`${prefix}: unknown cue layer ${cue.layerId}`);
  }
}
for (const entry of await readdir("projects",{withFileTypes:true})) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const directory = `projects/${entry.name}`;
  for (const [file, validate] of contracts) {
    let data;
    try { data = await read(`${directory}/${file}`); } catch(error) { if(error.code === "ENOENT" && !["project.json","sources.json","outputs.json"].includes(file)) continue; throw error; }
    if (!validate(data)) throw new Error(`${directory}/${file}: ${ajv.errorsText(validate.errors)}`);
  }
  const project = await read(`${directory}/project.geolibre`);
  references(project, null, directory);
  const registry = await read(`${directory}/outputs.json`);
  for (const output of registry.outputs) {
    if (output.output && !modes.has(output.output)) throw new Error(`${directory}: unsupported app output ${output.output}`);
    if (output.path && (output.path.includes("..") || path.isAbsolute(output.path))) throw new Error(`${directory}: unsafe output path`);
    if (output.path) await readFile(`${directory}/${output.path}`);
    if (output.kind === "video") {
      const activeProject = output.project ? await read(`${directory}/${output.project}`) : project;
      const story = await read(`${directory}/${output.path || "video-story.json"}`);
      if (!contracts.get("video-story.json")(story)) throw new Error(`${directory}: invalid video story ${output.path}`);
      references(activeProject,story,`${directory}/${output.id}`);
    }
  }
  console.log(`Schema and output references verified: ${entry.name}`);
}
