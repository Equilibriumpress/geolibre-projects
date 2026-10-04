# Fork release and maintenance

This is a public fork of [opengeos/GeoLibre](https://github.com/opengeos/GeoLibre).
It supports repository-authored research, a project portal on Pages and
browser-side GeoLibre analysis. The portal does not provide a CMS or an active
ChatGPT connection. Visitors copy requests into ChatGPT; the GitHub connection
records approved project work in repository files.

## Ownership and adapter boundaries

| Files | Purpose | Upstream merge concern |
| --- | --- | --- |
| projects, schemas, scripts | Research manifests, SQL, provenance, catalog and release checks | Preserve format compatibility and source restore metadata |
| docs/index.md, workflow.md, project-help.md, research portal JS/CSS | Public entry and authoring flow | Preserve credits and technical documentation links |
| ProjectOutputStatus, ResearchOutputHeader, research-output-links, useProjectOutputDeepLink, useProjectUrlLoader | Result navigation, readiness and exports | Reconcile shell and URL changes, test toolbar-free results |
| Investment Priority Lab plugin | Scenario reset, weighting provenance, missing values and map interpretation | Compare scoring and layer registration with upstream changes |
| VideoStoryPlayer, video-story-recorder, research-render-ready | Frame/codec choice, source preflight, cancellation and status | Reuse MapEngine readiness, view and recording APIs |
| Pages workflow and publication-config | One build revision and release gates | Preserve project/data/app release together |

Runtime changes were needed because project configuration cannot provide a
scenario reset, explicit export confirmation, renderer readiness or cancellation.
They use existing engine interfaces. Print deep-links are owned by the shell
so they also work with toolbar=none. The result header opens the existing
scenario panel and video uses its direct recorder, avoiding a toolbar-only action. No replacement GIS renderer was introduced.

## Release checks

Run project validation, schema/reference checks and catalog generation. Run the
appropriate scoring, URL, export, video and embed tests for changed code. Build
the app and documentation. Assemble site/demo and registered published outputs
as the Pages workflow does, then check built routes and page budgets. The workflow
blocks deployment when these release checks fail.

Use one GITHUB_SHA for generated pages, app and publication.json. Do not hand-edit
generated catalog pages. Historical project/output links pin repository files,
but the app at demo/ can receive later compatible updates. A pixel-identical
historical reproduction requires the recorded app revision and preserved inputs.
Live remote data can change independently of a repository release.

A successful release still requires a GPU browser for the map, dashboard,
identify and selection, print PNG/PDF, data downloads and complete flyover. Inspect
saved files, dimensions, MIME type, attributes, geometry, CRS and provenance.
Test Chrome and Safari on an actual iPad/iPhone. Check 390, 768, 1024 and 1440 CSS
pixels, keyboard focus, screen-reader labels, contrast and reduced motion. Record
actual device/browser versions, timestamps and artifacts. Do not replace these
checks with configuration tests or claim WCAG conformance from screenshots.

## Data refresh and schema migration

Keep the old input/snapshot when one exists. Refresh the exact source query,
retrieval date, variable definitions and license. Recheck sentinel values, units,
years and denominators. Regenerate SQL from indicator/scenario definitions and
compare it against runtime scores on the same records. Regenerate previews only
from actual geometry, and label a geometry-only preview accordingly. Run bounded
source checks and retain their timestamp separately from data retrieval dates.

Add manifest fields compatibly where possible. Update schema, template, validator
and generated pages together. Existing project format 0.1.0 remains in use. A new
required field needs a migration for existing projects and a test of old inputs.

## Upstream update

Add an upstream remote and review divergence with
`git rev-list --left-right --count main...upstream/main`. Start from a recorded
upstream commit on a separate branch. Compare changes to
the files in the ownership table. Reapply the smallest adapters necessary and run
existing upstream contract checks. Verify deferred plugin layers, source restore,
result URL handling, render readiness, browser codec support and download paths.
Run all three reference projects through the real user flow before merging.

## Rollback

Revert the offending PRs in Git, preserving source history. Rebuild and redeploy
the entire Pages artifact from the revert commit so app, project pages and bundles
stay together. Compare publication.json with that deployment. A user with an older
service worker may need to reload after the new app update is ready. Verify the
visible project version and live result header. Repository rollback cannot undo a
remote publisher's data change; use a recorded snapshot if exact data rollback
is required.
