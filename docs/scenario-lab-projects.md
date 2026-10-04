# Scenario Lab projects

The Investment Priority Lab turns a GeoLibre data layer into a transparent,
interactive multi-criteria prioritisation model.

A Scenario Lab project adds two audit files to the normal repository project:

```text
projects/<slug>/
├── project.geolibre
├── project.json
├── analysis.sql
├── sources.json
├── indicators.json
├── scenarios.json
└── README.md
```

## Indicators

`indicators.json` describes the analytical unit and the variables that become
0–100 priority scores.

An indicator reads either one numeric field or a ratio of two fields:

```json
{
  "id": "older-share",
  "title": "Residents aged 65+",
  "numeratorField": "aantal_inwoners_65_jaar_en_ouder",
  "denominatorField": "aantal_inwoners",
  "multiplier": 100,
  "direction": "higher-is-worse",
  "minValid": 0,
  "quality": 1,
  "year": 2024,
  "unit": "%"
}
```

`direction` is explicit. A high raw value can mean more priority
(`higher-is-worse`) or less priority (`lower-is-worse`).

Missing values are never silently converted to zero.

## Normalisation

The browser ranks valid observations for each indicator and converts them to a
0–100 percentile score. This avoids combining incomparable units such as euros,
kilometres, counts and percentages directly.

A project should document why percentile ranking is appropriate for the
decision being studied. The score is relative to the features in the loaded
analysis layer.

## Scenarios

`scenarios.json` contains named weight sets:

```json
{
  "defaultScenario": "healthy-ageing",
  "scenarios": [
    {
      "id": "healthy-ageing",
      "title": "Healthy ageing",
      "weights": {
        "older-share": 0.30,
        "gp-distance": 0.25,
        "low-income": 0.20,
        "benefit-share": 0.15,
        "supermarket-distance": 0.10
      }
    }
  ]
}
```

Weights do not have to add to one. The Scenario Lab normalises the available
weights while calculating the score.

## Missing data and confidence

For each feature the Scenario Lab reports both a priority score and a confidence
score. Confidence falls when a weighted indicator is missing or when its
configured source quality is below 1.

This prevents a high-looking score based on only a small part of the intended
model from being presented as equally complete.

## Consensus

The engine calculates every configured scenario, not only the active one. It
also reports a consensus score and how often a feature appears in a scenario's
top decile.

The consensus result is useful for finding places that remain a priority across
different policy choices.

## Analysis units

The engine is independent of geometry type. Suitable units include:

- official statistical grids
- H3 cells
- neighbourhoods
- parcels
- custom planning zones

Prefer the finest unit supported by the source data. Do not convert a coarse
source to a fine grid and imply that the original statistics became more
precise.

For the first advanced Dutch reference project the official CBS 500 × 500 metre
statistical grid is used directly.
