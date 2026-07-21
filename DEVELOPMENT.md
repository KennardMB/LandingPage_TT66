# Developer guide

For what this project is and how it's structured, see [README.md](README.md) first. This doc is for anyone actively working on the code: setup, where to change what, and what's still unfinished.

## Quick start

```sh
npm install
npm run dev        # localhost:4321, hot reload
npm run build      # outputs static site to dist/
npm run preview    # serve the production build locally
```

No environment variables, no backend, no database. It's a fully static site — `npm run build` is all a host needs.

## Content status — what's real vs. placeholder

Pulled from the club's actual site, [tirtataruna66sc.wixsite.com](https://tirtataruna66sc.wixsite.com/tirta-taruna):

| Section | Status |
|---|---|
| About text, founding date, member-run structure | ✅ Real |
| Disciplines (Swimming, Synchro, Diving, Masters, Triathlon) | ✅ Real |
| Coaches & Staff (names, roles, quotes) | ✅ Real |
| Achievements (medal counts, competition names, athlete names) | ✅ Real, but **no dates** — competition years aren't on the club's site |
| Weekly program times | ⚠️ Placeholder — every row says "Schedule TBC" |
| Contact email & phone | ⚠️ Placeholder — fake values, clearly flagged on the page itself |
| Gallery photos | ⚠️ Placeholder — gradient tiles standing in for real photography, each tagged "Photo placeholder" |
| Logo | ✅ Real — pulled from the club's Wix site |

**Before launch, the club needs to provide:** real training schedule times, a real contact email/phone/WhatsApp number, and real photos (competition, training, events).

**Live pages today:** Home (`/`), and four "See more" pages that currently just show the same section full-page: `/about`, `/programs`, `/achievements`, `/gallery`.

## Where to change what

### Gallery — add, remove, or reorder photos

- **File:** [`src/data/gallery.json`](src/data/gallery.json)
- Each entry: `id` (unique slug), `order` (controls sequence — **required**, see note below), `caption` (2-line description shown on the image), `tone` (`"a" | "b" | "c" | "d"` — picks which placeholder gradient color to use, defined in [`Gallery.astro`](src/components/Gallery.astro) and [`gallery.astro`](src/pages/gallery.astro)).
- **To add a photo:** add a new object to the array with a unique `id` and the next `order` number.
- **To remove a photo:** delete its object from the array.
- **To reorder:** change the `order` values.
- **To use a real photo instead of a gradient placeholder:** the current markup renders a CSS gradient (`tone-a` etc.) with a "Photo placeholder" tag — replace `<div class={\`slide-image tone-${slide.data.tone}\`}>` in `Gallery.astro` (and the equivalent in `gallery.astro`) with an `<img>` tag once real photos exist, and add an `image` field to the schema in `content.config.ts`.
- Shows as a carousel on the homepage (`Gallery.astro`), and as a full grid on `/gallery` (`gallery.astro` — this page does **not** reuse the carousel, it has its own grid layout since repeating the same carousel on its own page added nothing).

> **Why every collection needs an `order` field:** Astro's JSON-file content loader does not preserve array order — without an explicit field to sort by, entries render alphabetized by `id`. Every `.sort((a, b) => a.data.order - b.data.order)` call in the components depends on this. If you add a new entry, give it an `order` number or it may render in the wrong place.

### Achievements — medals and results

- **Files:** [`src/data/medals.json`](src/data/medals.json) (the 3 tally numbers — Gold/Silver/Bronze) and [`src/data/results.json`](src/data/results.json) (the timeline list — event, result, athlete names, date).
- These two are separate because the tally is a computed summary; if you add a new competition to `results.json`, remember to update the matching counts in `medals.json` too (nothing does this automatically).
- `dateStatus` is currently `"DATE TBC"` on every entry — replace with the real competition date/year once the club provides it.
- Rendered by [`Achievements.astro`](src/components/Achievements.astro). Timeline markers use `--red`, the accent color sampled from the club's logo.

### Weekly Programs (schedule)

- **File:** [`src/data/programs.json`](src/data/programs.json) — one entry per discipline: `code`, `name`, `description`, `level`, `scheduleStatus`.
- `scheduleStatus` is `"Schedule TBC"` for every row — once the club gives real class times, replace this field with the actual time range (e.g. `"16:00 – 17:00"`).
- Rendered by [`Programs.astro`](src/components/Programs.astro), including the filter chips (currently visual-only, not wired to actually filter — see Known gaps below).

### Coaches & Staff

- **File:** [`src/data/coaches.json`](src/data/coaches.json) — `name`, `role`, `quote`, `initials` (shown as the placeholder avatar letters until real headshots exist).
- Rendered by [`Coaches.astro`](src/components/Coaches.astro) in a 3-column grid (`.coach-grid`) — adjust `grid-template-columns` there if the team size changes significantly.

### About section (stats + copy)

- **Stats** (the 4 big numbers — years, disciplines, coaches, pool size): [`src/data/stats.json`](src/data/stats.json).
- **Body copy** (founding story paragraphs) is hardcoded directly in [`About.astro`](src/components/About.astro), not in a data file — it's prose, not a list, so it didn't need a collection. Edit the `<p>` tags directly.

### Contact info

- **File:** [`src/components/Contact.astro`](src/components/Contact.astro) — email, phone/WhatsApp number, and location are hardcoded here (not a collection, since there's only ever one of each).
- Email and phone are currently placeholders with a visible "Placeholder — replace with the club's real ___" note under each — remove the `.flag` div once real values are in.
- The WhatsApp button (`<a href="#" class="wa-btn">`) needs a real `https://wa.me/<number>` link once the phone number is confirmed.
- The map is a styled div, not an embedded Google Map — swap `.map` for a real `<iframe>` embed when ready.

### Nav, logo, footer, colors, mobile menu

- **File:** [`src/layouts/Layout.astro`](src/layouts/Layout.astro) — the shared shell every page renders inside.
- Nav links: the `.navlinks` block. Links point to `/#section-id` (home-relative) so they still work from subpages like `/about`.
- Design tokens (colors): the `:root` block near the top of the global `<style>` — `--blue`, `--blue-deep`, `--blue-deeper`, `--paper`, `--muted`, `--ink`, `--red` (accent, sampled from the club's logo). Every component reuses these variables; change a color once here and it updates everywhere.
- Logo: `public/logo/tt66-logo.png`, referenced in the nav (`.logo-mark`). Favicon is a separate resized copy at `public/favicon.png`.
- Footer text: bottom of `Layout.astro`.
- Mobile nav is a real collapsible menu below 900px: `.nav-toggle` (the three-line/X button) toggles an `.open` class on `.navlinks` via the `<script>` at the bottom of the file. Links auto-close the menu on click.

### Adding a new page

1. Create `src/pages/whatever.astro`.
2. Import `Layout` and wrap your content in it: `<Layout title="..."><YourContent /></Layout>`.
3. If it should be reachable from the nav, add a link in `Layout.astro`'s `.navlinks`.
4. If it's a new "See more" destination for an existing homepage section, follow the pattern in `src/pages/about.astro` (import the section component, render it with `showSeeMore={false}` to hide the button that would otherwise link back to itself, add a `<a href="/" class="back-home">← Back to home</a>` link above it).

### The "See more" pattern

Homepage sections that have more to show than fits on one page (Gallery, About, Achievements, Programs — not Coaches or Contact) accept a `showSeeMore` prop, default `true`. On the homepage this renders a "See more" button linking to the dedicated page; on the dedicated page itself it's passed `false` so the button doesn't link to itself. See any of `src/pages/about.astro`, `achievements.astro`, `programs.astro` for the two-line pattern.

### Section dividers

The thin horizontal lines between sections are the `<Divider />` component ([`src/components/Divider.astro`](src/components/Divider.astro)), placed manually between each section in [`index.astro`](src/pages/index.astro). It's a plain reusable component — drop `<Divider />` anywhere else a section boundary needs one (e.g. inside the dedicated pages once they have more than one section).

## Deployment

Static output only (`output: 'static'` in [`astro.config.mjs`](astro.config.mjs)) — `npm run build` produces a `dist/` folder that any static host can serve. No adapter is configured yet. Recommended: Cloudflare Pages (free tier easily covers this site's traffic and the club's Rp 500rb/year budget).

## Known gaps / not built yet

These are intentionally deferred, not bugs:

- **Program filter chips** (All / Swimming / Synchro / etc. on the Programs section) are visual only — clicking them doesn't actually filter the table yet.
- **Carousel autoplay** exists (`Gallery.astro`, pauses on hover) but has no pause/play button.
- **No CMS.** Content editing today means editing JSON files directly and redeploying. If the club buys the Premium tier (per the original proposal), the plan is a git-based CMS like Decap — the JSON content-collection structure was deliberately built to make that a config change, not a rewrite.
- **No booking form, payments, or multi-language.** Also Premium-tier scope, not built.
