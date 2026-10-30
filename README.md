# Yatra — India travel guide

A lightweight, multi-page travel guide made with plain HTML, CSS and JavaScript. No build step or package manager is required. Karnataka is the starting state; filters also include Kerala, Goa, Tamil Nadu and Maharashtra.

## Run it

Open `index.html` in a browser, or serve this folder locally:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000`. Python is optional if your browser can open local pages directly.

## What's included

- `index.html` — search and browse destinations by state and category.
- `pages/map.html` — filtered place directory with Google Maps search embeds and directions.
- `pages/foods.html` — street-food and local snack suggestions.
- `pages/hotels.html` — suggested areas to look for accommodation; not live listings.
- `pages/itinerary.html` — create a local trip from saved places using browser storage.
- `js/` — sample Karnataka-first destination data and small page modules.
- `supabase/functions/plan-itinerary/` — optional AI itinerary edge-function starter.

Places and food are starter suggestions, not real-time listings or endorsements. Check local opening hours, access rules, weather, and travel advice before visiting.

## Google Maps and your key

The included maps use Google Maps search links and embeds; they don't need a browser API key. If you choose to add a Google Maps JavaScript API key later, create a new key in Google Cloud, restrict it to your local/deployed website referrers, enable only the APIs you use, and keep billing limits in place. Browser map keys are visible to website visitors, so restrictions matter. The key previously pasted into chat is not added anywhere; rotate it with its issuer.

## Optional Supabase AI itinerary

The regular itinerary works locally and needs no API credentials. To enable the optional AI button:

1. Deploy `supabase/functions/plan-itinerary/index.ts` with the Supabase CLI.
2. Set `OPENAI_API_KEY` as a Supabase Edge Function secret; do not put it in browser code.
3. Configure `js/config.js` with the Supabase project URL and public anon key. These browser values are public; secure access with Supabase auth and row-level policies, and never put provider secrets in this file.
4. Configure Supabase authentication, CORS and database policies for your deployment before using it with real users.

`supabase.js` is an optional REST helper. The local guide does not require Supabase.
