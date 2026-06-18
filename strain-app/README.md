# Strain Vault

A full-stack cannabis strain profile manager. Search a built-in database of 50 popular strains, pull supplementary info from the web, save your favorites with personal notes, ratings, and session logs.

## Tech stack

| Layer | Tech |
|---|---|
| Backend | Node.js 22 + Express |
| Database | SQLite via `node:sqlite` (built-in, no compilation) |
| Frontend | Vanilla JS SPA + CSS — no build step |

## Quick start

**Requirements:** Node.js ≥ 22.5.0

```bash
cd strain-app
npm install
npm start
```

Open **http://localhost:3000**

For development with auto-restart:

```bash
npm run dev
```

The SQLite database (`strains.db`) is created automatically on first run and seeded with 50 strains. Subsequent runs reuse the existing file.

## Features

### Search tab
- **Instant search** across 50 strains by name, effect, flavor, or keyword in the description
- **Type filters** — Sativa / Indica / Hybrid
- **Sort** by name or THC % (high→low, low→high)
- **Strain detail modal** — potency bars, effects/flavors/terpene chips, full description, direct Leafly link
- **🌐 Web Search** — hits the DuckDuckGo Instant Answer API for live web info; falls back gracefully to local results when offline
- **＋ Add** — create a custom strain not in the database

### My Collection tab
- **Filter** saved strains by type, star rating, and "would try again"
- **Search** within your own collection by name, notes, or effects
- **🎯 Suggest** — pick desired effects + type + max THC to get ranked recommendations from the full database
- Each saved card shows: star rating, your personal effects (in blue), your notes, retry badge (👍/👎), and date tried

### Saving a strain
Click **＋ Save** on any card or from the detail modal:

| Field | Description |
|---|---|
| Rating | 1–5 stars |
| Notes | Free text — what did it feel like? context? |
| Experienced effects | Checkbox pills from the standard effects list |
| Date tried | Date picker |
| Would try again | Toggle (👍/👎) |

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/strains` | All strains |
| `GET` | `/api/strains/search?q=&type=&sort=` | Search strains |
| `GET` | `/api/strains/:id` | Single strain |
| `POST` | `/api/strains` | Add custom strain |
| `GET` | `/api/favorites` | All saved favorites (joined with strain data) |
| `POST` | `/api/favorites` | Save a strain |
| `PUT` | `/api/favorites/:id` | Update notes/rating |
| `DELETE` | `/api/favorites/:id` | Remove from collection |
| `GET` | `/api/stats` | Counts and average rating |
| `GET` | `/api/web-search?q=` | DuckDuckGo search + local match |

## Database schema

```sql
strains    (id, name, type, thc_min, thc_max, cbd_min, cbd_max,
            effects JSON, flavors JSON, terpenes JSON, description)

favorites  (id, strain_id FK, rating, notes,
            personal_effects JSON, date_tried, would_try_again,
            created_at, updated_at)
```

## Seed strains (50 total)

Covers all major categories:

**Indicas** — Northern Lights, Granddaddy Purple, Bubba Kush, Skywalker OG, Gorilla Glue #4, Do-Si-Dos, Ice Cream Cake, Purple Punch, Slurricane, Forbidden Fruit, Grape Ape, Blue Cheese, Biscotti, Animal Cookies, Zkittlez, London Pound Cake, Kosher Kush, Critical Mass, Mango Kush

**Sativas** — Sour Diesel, Purple Haze, Jack Herer, Green Crack, Durban Poison, Super Lemon Haze, Strawberry Cough, Amnesia Haze, Lemon Haze, Candyland, Tropicana Cookies, Super Silver Haze

**Hybrids** — OG Kush, Blue Dream, Girl Scout Cookies, White Widow, AK-47, Wedding Cake, Gelato, Runtz, Pineapple Express, Chemdawg, Trainwreck, Bruce Banner, Sunset Sherbet, MAC 1, Mimosa, Gelato 41, Cherry Pie, Gary Payton, Cereal Milk, Obama Runtz

All strains include accurate THC/CBD ranges, effects, flavors, dominant terpenes, and descriptions.
