import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
const root = process.cwd();
function fixture(run: (directory:string) => void) {
  const directory=mkdtempSync(join(tmpdir(),"geolibre-publication-"));
  try { cpSync(join(root,"schemas"),join(directory,"schemas"),{recursive:true}); cpSync(join(root,"projects/utrecht-population-density"),join(directory,"projects/utrecht-population-density"),{recursive:true}); run(directory); }
  finally { rmSync(directory,{recursive:true,force:true}); }
}
function check(directory:string) { return spawnSync(process.execPath,[join(root,"scripts/check-project-contracts.mjs")],{cwd:directory,encoding:"utf8"}); }
test("publication gate accepts the template project and rejects missing layer references",()=>fixture(directory=>{
  assert.equal(check(directory).status,0);
  const file=join(directory,"projects/utrecht-population-density/project.geolibre");
  const data=JSON.parse(readFileSync(file,"utf8"));data.widgets[0].layerId="missing-layer";writeFileSync(file,JSON.stringify(data));
  const result=check(directory);assert.notEqual(result.status,0);assert.match(result.stderr,/unknown layer missing-layer/);
}));
test("publication gate rejects an unsupported registered output",()=>fixture(directory=>{
  const file=join(directory,"projects/utrecht-population-density/outputs.json");
  const data=JSON.parse(readFileSync(file,"utf8"));data.outputs[0].output="unknown-output";writeFileSync(file,JSON.stringify(data));
  const result=check(directory);assert.notEqual(result.status,0);assert.match(result.stderr,/unsupported app output/);
}));
