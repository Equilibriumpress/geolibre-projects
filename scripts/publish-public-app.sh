#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 2 ]; then echo "Usage: publish-public-app.sh APP_CHECKOUT FULL_SOURCE_SHA" >&2; exit 2; fi
checkout=$1
revision=$2
[[ "$revision" =~ ^[a-f0-9]{40}$ ]] || { echo "A full source SHA is required" >&2; exit 2; }
test "$(git -C "$checkout" rev-parse HEAD)" = "$revision"
test -f "$checkout/apps/geolibre-desktop/dist/index.html"
test -f "$checkout/apps/geolibre-desktop/dist/jupyterlite/lab/index.html"
release_dir=$(mktemp -d)
archive="$release_dir/geolibre-web.tar.gz"
trap 'rm -rf "$release_dir"' EXIT
cp "$checkout/LICENSE" "$checkout/apps/geolibre-desktop/dist/LICENSE.txt"
printf '{"revision":"%s"}\n' "$revision" > "$checkout/apps/geolibre-desktop/dist/app-build.json"
tar -czf "$archive" -C "$checkout/apps/geolibre-desktop/dist" .
(cd "$release_dir" && sha256sum geolibre-web.tar.gz > geolibre-web.sha256)
gh release create "app-$revision" "$archive" "$release_dir/geolibre-web.sha256" --repo Equilibriumpress/geolibre-projects --title "GeoLibre web app $revision" --notes "Compiled browser distribution. Source revision: $revision. MIT license included." --target main
