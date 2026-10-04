# Repository migration

Projects migrated from Equilibriumpress/GeoLibre at commit `6f19272f2bd1aa14c897ad56067deaf875a4a252` on 2026-10-04. Original project files and source records are preserved. Links in authoring documentation now point to the public project repository.

## Release contract

The project revision is the public repository commit. The app revision is selected by `app-release.json`. `publication.json` records both independently. The public app bundle lives in a release of this repository. Rebuilding project pages requires no access to the app source repository after bootstrap.

## Before making the app repository private

Confirm the compiled app release is available and the Pages workflow completes using that release. Preserve existing PR and issue records before detaching the fork. Configure app development to publish compiled releases to this repository using an authenticated account with write access. The helper `scripts/publish-public-app.sh` uploads an already built app and does not publish source.

The old `/GeoLibre/` site and SHA-pinned raw URLs remain tied to the old public repository. Changing visibility will break those old raw links. Use the new `/geolibre-projects/` links. Keeping the old site address requires a separate hosting or redirect arrangement before privatization. The new site remains independent.

## Ownership

Create and edit projects here. Change app behavior in the app repository. Keep upstream GeoLibre attribution and the MIT license with compiled distributions. Existing app PR history remains in the app repository during this migration.
