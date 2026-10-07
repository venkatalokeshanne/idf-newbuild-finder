# Île-de-France new-build finder

A mobile-first web app (installable PWA) to browse new-build 3-room apartments in Île-de-France:
60 m² or more, under 310,000 €. Data was collected on 6 October 2026 from developer websites
and the SeLoger Neuf developer feed. Social-housing groups are excluded and sales agencies are
hidden by default (there is a toggle). BRS offers (leasehold land, income-capped) are hidden by default too.
Every card opens the developer: the exact programme page when known, otherwise the developer's website,
otherwise a search for it. Portal rows keep a small "SeLoger listing" link as a secondary option.
Programmes with no size are shown when their price fits.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Node 18 or newer is required.

## What is inside

| Area | Library |
| --- | --- |
| UI | React 18, Vite 5 |
| Styling | Tailwind CSS 3 (theme tokens as CSS variables, dark and light) |
| Map | Leaflet, react-leaflet, react-leaflet-cluster (OpenStreetMap tiles) |
| Search | Fuse.js (fuzzy search on town, programme, developer) |
| Price chart and sliders | Recharts, Radix UI Slider |
| Table | TanStack Table |
| Motion and bottom sheets | Framer Motion |
| Icons | Lucide |
| Install and offline | vite-plugin-pwa (Workbox) |

## Layout

- Phones and tablets (under 1024 px): full-screen map, draggable results sheet (peek, half, full),
  bottom tab bar (Explore, List, Saved, Filters), filter sheet, "locate me" button.
- Desktop: filter rail, results list and map side by side, plus Cards and Table views.

## Data

`src/data/listings.json` holds 1,221 records. Fields:

| Key | Meaning |
| --- | --- |
| `s` | source: `d` developer site, `p` SeLoger Neuf portal feed |
| `l` | level: `u` one apartment, `r` programme with size and price range, `f` "from" price only |
| `f` | match quality: `confirmed`, `likely`, `unverified`, `near` |
| `dev`, `pr`, `c`, `dp` | developer, programme, town, département |
| `s1`, `s2` | smallest and largest 3-room size (m²) |
| `p1`, `p2` | lowest and highest price (EUR) |
| `p20`, `p55` | price at 20% VAT and at reduced 5.5% VAT, when both are shown |
| `v` | VAT or ownership label (20%, 5.5% conditions, 10% conditions, BRS) |
| `dup` | portal row that repeats a developer-site row |
| `ag` | sales agency, not a developer |
| `u` | link to the programme or apartment page |

To refresh the data, replace the JSON file and rebuild.

## Notes

- Prices and availability change daily. Confirm size, price and VAT with the developer.
- Reduced VAT (5.5% or 10%) and BRS need income or resale conditions.
- Map tiles come from OpenStreetMap (https://www.openstreetmap.org/copyright). Respect the tile usage policy
  if you deploy publicly; for heavy traffic use a tile provider with an API key and change `TILE_URL`
  in `src/components/MapView.jsx`.
- Floor plans were not downloaded.
