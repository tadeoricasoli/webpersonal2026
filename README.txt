# tadeoricasoli.com — Photography Portfolio

Personal photography portfolio. A static, single-page site that is fast, mobile-first and has no build step. It is hosted for free on Cloudflare, and the images are served from Cloudinary.

**Live:** https://tadeoricasoli.com

---

## Contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Features](#features)
- [External services & APIs](#external-services--apis)
- [Third-party libraries](#third-party-libraries)
- [Deploy](#deploy)
- [How-to (common edits)](#how-to-common-edits)
- [Keys & configuration](#keys--configuration)
- [SEO](#seo)
- [Performance](#performance)
- [Maintenance notes & known gotchas](#maintenance-notes--known-gotchas)
- [Credits & licenses](#credits--licenses)

---

## Tech stack

| Layer | What |
|---|---|
| Markup | HTML5 (single `index.html`) |
| Styles | CSS3: the template stylesheet plus a custom `<style>` block in `index.html` |
| Scripts | JavaScript (ES5) with jQuery |
| Build | None. Plain static files, so what you see is what gets deployed |
| Hosting | Cloudflare Workers (static assets only) |
| Images / CDN | Cloudinary |
| Contact form backend | Web3Forms |
| Map | Leaflet + CARTO basemap (OpenStreetMap data) |

There is no PHP, database or server-side code. The original site was PHP-based and was migrated to a fully static setup.

---

## Project structure

```
tadeoricasoli/
├── index.html            # The whole site: markup, custom CSS, JSON-LD, contact form script
├── site.webmanifest      # PWA manifest (name, icons, colors)
├── robots.txt            # Allows all crawlers + points to the sitemap
├── sitemap.xml           # Single-URL sitemap
└── assets/
    ├── css/
    │   ├── main.css      # Multiverse template styles
    │   └── noscript.css  # Fallback when JS is disabled
    └── js/
        ├── jquery.min.js
        ├── jquery.poptrox.min.js   # Lightbox
        ├── browser.min.js          # Template helpers
        ├── breakpoints.min.js      # Template helpers
        ├── util.js                 # Template helpers
        └── main.js                 # Site logic (panels, lightbox gestures, map, menu…)
```

---

## Features

### Gallery
- Grid of photos, each with a title and the photo's **technical data (EXIF)** in italics: camera · focal length · aperture · shutter speed · ISO.
- **LQIP (low-quality image placeholder):** each thumbnail first shows a tiny blurred version (`w_40,e_blur:400`) and fades into the real image once it has loaded.
- Thumbnails: `c_fill,w_800`, loaded lazily as you scroll. Full size: `c_limit,w_2560` (desktop) or `w_1800` (mobile, rewritten in `main.js`).
- A soft radial black fade behind each title keeps the text readable on any photo.

### Lightbox (Poptrox + custom code in `main.js`)
- On mobile the photo is fullscreen over a blurred background.
- Caption with title and EXIF inside the image.
- Photo counter (`3 / 15`).
- **Swipe left/right** for next/previous; it loops from the last photo back to the first.
- **Swipe down** to close.
- **Pinch to zoom**, which resets on release.
- The previous and next photos are preloaded, and a photo starts downloading as soon as its thumbnail is touched or hovered.
- Safety nets for slow or first-tap loads: a visible loader, closing is blocked while loading, an automatic retry and a stuck-load watchdog.

### Panels (bottom bar on desktop, ☰ menu on mobile)
- **MAP**: an interactive dark map (Leaflet) with pulsing pins. Each pin opens a card with a photo, and tapping the card opens that photo in the lightbox. Leaflet is only loaded the first time the panel opens.
- **GEAR**: the camera and lenses, linked to the official product pages.
- **CONTACT**: profile photo, short bio, social icons and the contact form.
- On mobile the nav collapses into an animated **☰ menu**.

### Contact form
- Sent with `fetch` to **Web3Forms** (no page reload). The sender name is "Web TPR".
- Email validation (HTML `pattern` plus JS).
- **Anti-spam:**
  - A hidden honeypot checkbox (`botcheck`).
  - Submissions sent in under 4 seconds are treated as bots.
  - A spam keyword regex.
  - Messages with more than 2 links are rejected.
  - Bots get a fake "success" message, so they don't retry.
- Result pop-ups use **SweetAlert2**, restyled to match the site.

### UI details
- Hover color across the whole site: the template's accent `#34a58e`.
- Right-click is disabled on the page (a light deterrent against casual image saving).
- Favicon and logo: a black-and-white italic serif "TPR", served from Cloudinary.

---

## External services & APIs

| Service | Used for | Plan | Notes |
|---|---|---|---|
| **Cloudflare Workers** (static assets) | Hosting + custom domain | Free | Worker `tadeoricasoli`, static assets only. Custom domain (not a route). |
| **Cloudflare DNS / SSL** | Domain, HTTPS | Free | *Always Use HTTPS* enabled. Keep the `google-site-verification` TXT record. |
| **Cloudflare Web Analytics** | Visitor stats | Free | Cookie-less; enabled from the dashboard (no code in the repo). |
| **Cloudinary** | Image hosting + on-the-fly transforms | Free | Cloud name `dtmlyikjn`. Uses `f_auto,q_auto`, `c_fill`, `c_limit`, `g_face`, `e_blur`, etc. |
| **Web3Forms** | Contact form → email | Free | Access key in the form's hidden input. |
| **CARTO Basemaps** | Dark map tiles (`dark_all`) | Free (non-commercial, API key) | Key restricted by referer to `tadeoricasoli.com`. Attribution must stay visible. |
| **OpenStreetMap** | Map data (via CARTO) | Free | Attribution required (already shown on the map). |
| **unpkg / jsDelivr** | CDNs for Leaflet 1.9.4 and SweetAlert2 | Free | Leaflet is loaded lazily. |
| **Google Fonts** | Source Sans Pro | Free | |
| **Google Search Console** | Indexing, sitemap | Free | Verified via a DNS TXT record. |

---

## Third-party libraries

| Library | Version | License |
|---|---|---|
| jQuery | 3.6.0 | MIT |
| Poptrox | 2.5.2-dev | MIT |
| SweetAlert2 | 11 (jsDelivr CDN) | MIT |
| Leaflet | 1.9.4 | BSD-2-Clause |
| Font Awesome icons (inline SVG) | Free 7.x | Icons: CC BY 4.0 |
| Source Sans Pro | — | SIL OFL 1.1 |
| Multiverse template (HTML5 UP) | — | CC BY 3.0 |

---

## Deploy

1. Cloudflare dashboard → **Workers & Pages** → `tadeoricasoli`.
2. **Nueva implementación / Create deployment** → drag the `tadeoricasoli` folder (or the ZIP contents).
3. Wait a few seconds, then check https://tadeoricasoli.com. Use Ctrl + Shift + R to bypass the browser cache.

The site has no build step: upload the files as they are.

---

## How-to (common edits)

### Add a photo
1. Upload it to Cloudinary and copy its **Public ID**. This is not the same as the display name.
2. In `index.html`, duplicate an `<article class="thumb">` block and change:
   - the `href` (full size): `.../f_auto,q_auto,c_limit,w_2560/<PUBLIC_ID>.webp`
   - the `src` (thumbnail): `.../f_auto,q_auto,c_fill,w_800/<PUBLIC_ID>.webp`
   - `alt`, the `<h2>` title and the `<p class="exif">` line.
3. If an image doesn't load right after a re-upload or rename, add or change a **version segment** (`/v2/`, `/v123…/`) in the URL to bypass Cloudinary's cached 404.

### Update gear
Edit the `<section id="gear">` block in `index.html`. Each item is `<li><strong><a href="…">Name</a></strong><span>Note</span></li>`.

### Add or replace map places
In `assets/js/main.js`, edit the `places` array in the *Panel Map* section:
```js
{ name: 'JUJUY', place: 'Purmamarca, Jujuy', lat: -23.745, lng: -65.498, photo: 12 }
```
`photo` is the index (starting at 0) of the gallery thumbnail shown in the card. The current places are **placeholders** and will be replaced by Instagram story photos.

### Change the contact form recipient / sender name
Change the hidden inputs `access_key`, `from_name` and `subject` in the contact form in `index.html`.

---

## Keys & configuration

These keys are **public by design**: they are visible in the browser and are protected by each service's own rules.

| Key | Where | Protection |
|---|---|---|
| Web3Forms access key | `index.html` (contact form) | Web3Forms ties it to the owner's inbox; spam filtering is done client-side and by Web3Forms |
| CARTO API key | `assets/js/main.js` → `CARTO_KEY` | Referer restriction to `tadeoricasoli.com` |

Do **not** commit private secrets: API secrets, passwords, Cloudflare tokens or personal email addresses.

---

## SEO

- `<title>` ("Tadeo Pedro Ricasoli"), meta description, canonical URL.
- Open Graph and Twitter Card tags, with a 1200×630 preview image generated by Cloudinary.
- JSON-LD structured data: `Person` (with `sameAs` links to social profiles) and `WebSite`.
- `robots.txt` and `sitemap.xml`, submitted to Google Search Console.
- `data-nosnippet` on the gallery and panels, so Google uses the meta description as the search snippet.
- Favicons (16/32/48 PNG, `.ico`, Apple touch icon) and a web manifest.

---

## Performance

- Fully static and served from Cloudflare's edge.
- Images are converted to the best format the browser supports (`f_auto`), compressed automatically (`q_auto`) and sized for each use.
- Lighter full-size images on mobile.
- LQIP blurred placeholders.
- **Lazy-loaded thumbnails:** only the visible thumbnails and the ones about to scroll into view (600 px ahead) are downloaded, using `IntersectionObserver`. The first four are preloaded for a fast first paint. Older browsers fall back to loading everything.
- Thumbnails and neighboring photos are preloaded in the lightbox.
- The map library (Leaflet) and its tiles load only when the Map panel is opened.

---

## Maintenance notes & known gotchas

- **Poptrox removes the `href` attributes** from gallery links when it starts. Any code that needs the full-size URLs must read them **before** `$main.poptrox(...)` (see `ptHrefs` in `main.js`).
- **Cloudinary caches 404s.** If an image was requested before it existed, change or add a version segment in the URL.
- **Cloudinary free plan:** transformations are limited to 25 MP source images.
- **CARTO's free tier is revocable.** If the map shows "API KEY REQUIRED" again, request a new key at carto.com/basemaps/apikey and replace `CARTO_KEY`. Alternatively, switch to a keyless provider such as OpenFreeMap.
- On the `*.workers.dev` URL the map shows a watermark, because the CARTO key is restricted to the custom domain. This is expected.
- **EXIF of the latest photos** (JUJUY, B&W, SUNSHINE) is provisional until the original files are checked.

---

## Credits & licenses

- Base design: **[Multiverse](https://html5up.net/multiverse) by [HTML5 UP](https://html5up.net)**, licensed under [CC BY 3.0](https://html5up.net/license).
- Icons: **[Font Awesome Free](https://fontawesome.com)** by Fonticons, Inc. Icons licensed under [CC BY 4.0](https://fontawesome.com/license/free).
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Map tiles © [CARTO](https://carto.com/attributions).
- [Leaflet](https://leafletjs.com) © Volodymyr Agafonkin (BSD-2-Clause).
- [jQuery](https://jquery.com) (MIT), [Poptrox](https://github.com/ajlkn/jquery.poptrox) by @ajlkn (MIT), [SweetAlert2](https://sweetalert2.github.io) (MIT).
- Font: Source Sans Pro by Adobe (SIL OFL 1.1).
- All photographs © the site owner. All rights reserved; they are **not** covered by any open license.
