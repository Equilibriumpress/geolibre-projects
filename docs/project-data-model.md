# Repository project data model

Repository projects separate the analytical question from the storage location of
the underlying data. The default is **remote-first**: reference an authoritative
public source directly when it is stable, browser-accessible, and suitable for
reproducible use.

## Three data modes

### Remote-first

Use a public HTTPS source directly when:

- the publisher is authoritative
- the URL is stable
- the browser can fetch it
- the data volume is suitable for browser use
- no credentials are required

Typical examples are OGC APIs, WFS/WMS, GeoJSON, GeoParquet, PMTiles, COGs, and
public ArcGIS services.

### Snapshot

Store a repository snapshot when reproducibility matters more than live updates,
or when an upstream API is likely to change. Record the original source and
retrieval date in `sources.json`.

Keep snapshots small. Large datasets belong in cloud-native external storage.

### Mixed

A project can combine live sources and repository snapshots. Use this when a
stable reference layer can stay remote while a derived analytical result is
versioned with the project.

## Provenance requirements

Every source entry records:

- stable id
- source name
- publisher
- public HTTPS URL
- retrieval date
- role in the analysis
- license when known
- optional snapshot path
- optional notes

The source URL describes where the data came from. A snapshot path describes the
copy used by the analysis. These are different concepts and should not be
collapsed into one field.

## Reproducibility chain

```text
authoritative source
        ↓
sources.json
        ↓
analysis.sql
        ↓
derived dataset or query layer
        ↓
project.geolibre
        ↓
map / viewer / dashboard / story map / print layout
```

## Browser constraints

A source being public does not guarantee that a browser can fetch it. Cross
origin policy, redirects, response size, authentication, and signed URLs can all
break a web project.

For public repository projects:

- prefer HTTPS
- avoid signed or expiring URLs
- avoid localhost and private-network hosts
- never commit tokens in URLs
- prefer cloud-native formats for large files
- document any source that needs a desktop-only workflow

## Sensitive data

This repository is public. Do not add private, personal, confidential, licensed,
or credential-protected data. A project intended for restricted data requires a
different deployment model.


## Publication identity

The Pages build uses GITHUB_SHA for the app, publication index and generated
project pages. Project and video URLs point at that exact Git commit. Historical
shared links remain reproducible while the repository retains the commit.
The same build also publishes project-data bundles and publication.json with
SHA-256 hashes and byte sizes. These hashes identify repository files. Remote
live datasets remain live, and their retrieval dates are recorded separately.
They must not be presented as immutable snapshots.
