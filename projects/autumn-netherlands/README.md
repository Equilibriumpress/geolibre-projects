# Autumn Netherlands

NASA-groenheid voor de Utrechtse Heuvelrug, Veluwe en Twente.

## Openen

Open het project via de GeoLibre-projectpagina. Kies Herfst door de tijd, Augustus / november vergelijken, Recente groenheid of Verken de drie gebieden.

De bediening staat in GeoLibre. De tijdschuif opent uitgeklapt. Klik Play of selecteer een datum. De vergelijking opent met augustus links en november rechts.

## Vraag en perioden

Hoe verandert groenheid door de herfst in drie Nederlandse studiegebieden?

De historische kaart gebruikt de complete herfst van 2025, van 13 augustus tot 17 november, met de officiële 16-daagse MODIS-composietstartdatums. De vergelijking gebruikt 13 augustus en 1 november 2025. De recente kaart gebruikt VIIRS EVI met waarnemingsdatums van 1 september tot 3 oktober 2026. Deze datums zijn vastgelegd, niet automatisch actueel.

## Gebieden

| Studievenster | West / zuid / oost / noord |
| --- | --- |
| Utrechtse Heuvelrug | 5.23 / 51.94 / 5.65 / 52.23 |
| Veluwe | 5.60 / 51.99 / 6.17 / 52.47 |
| Twente | 6.42 / 52.10 / 7.10 / 52.55 |

De rechthoeken zijn expliciete, indicatieve selectievensters. Ze zijn geen officiële grenzen of bosmasker. Amerongse Berg, Speulderbos en Lutterzand zijn oriëntatiepunten, geen meetstations. De vensters bevatten ook landbouw, stedelijk gebied en naaldbos.

## Bronnen en betekenis

MODIS NDVI toont groenheid met een 16-daagse composiet. VIIRS EVI is een dagelijks gepubliceerd product gebaseerd op de voorafgaande acht dagen. De indices en sensoren verschillen. Vergelijk elke reeks met zichzelf, niet als één cijferreeks.

GIBS levert gekleurde kaartbeelden. Er zijn geen numerieke bosgemiddelden, historische afwijkingen of voorspelde herfstpiekdatums berekend. Groenheidsafname heeft meerdere mogelijke oorzaken, waaronder seizoensverloop, droogte, oogst en sneeuw. De kleuren zijn geen weergave van rode, oranje of gele bladeren.

## Reproductie

1. Open project.geolibre voor de tijdschuif of comparison.geolibre voor de laagvergelijking.
2. observation-dates.json bevat de MODIS-tijdstappen, gecontroleerd tegen NASA WMTS capabilities.
3. recent.geolibre bevat de vastgelegde VIIRS-datums. Controleer capabilities voordat nieuwe datums worden toegevoegd.
4. sources.json bewaart herkomst en gebruiksvoorwaarden. source-health.json registreert HTTP/beeldcontroles.
5. analysis.sql controleert de studievensters. De visualisatie gebruikt geen RGB-kleurheuristiek voor voorspellingen.

## Volgende onderzoeksstap voor Autumn Atlas

Verwerk oorspronkelijke MODIS/VIIRS-rasterwaarden met QA en een loofbos/gemengd-bosmasker. Bereken per gebied een gewogen curve en vergelijk dezelfde index met eerdere jaren. Toets de afname aan gedateerde foto's en veldwaarnemingen voordat deze het iOS-herfstmodel beïnvloedt. Hiervoor zijn nog geen numerieke gegevens voorbereid.

## Verificatie

Projectschemas, outputreferenties en repositorytests worden uitgevoerd. NASA-kaartbeelden worden gecontroleerd op geldige afbeeldingen en CORS. De preview gebruikt echte NASA-beelden en toont de indicatieve studievensters. GPU-rendering, Safari, fysieke apparaten en opgeslagen exports vragen afzonderlijke runtimecontroles.
