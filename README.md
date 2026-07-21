# Tirta Taruna 66 — Website

Website for **Tirta Taruna 66 (TT66)**, an aquatic swimming club based at Kolam Renang Senayan, GBK, Jakarta, founded 10 November 1966. Built by Povvy (Kennard Mahib) — this is a first website project, built while learning [Astro](https://astro.build).

## About this project

TT66's previous web presence was a free Wix site. This repo replaces it with a proper, owned landing page — starting with the homepage, with the club's other pages (About, Programs, Achievements, Gallery) to follow. Visual direction takes cues from large-format sports/editorial sites like [olympics.com](https://olympics.com) and other swim club sites: big display type, a strong single accent color pulled from the club's own logo, and a structure built around real content — schedules, results, coaches — rather than generic marketing sections.

## Why Astro

The site is fully static — no user accounts, no database, no server-rendered pages. [Astro](https://astro.build) fits that well:

- **Zero client-side JavaScript by default.** Pages ship as plain HTML/CSS; the little interactivity that exists (the image carousel, the mobile menu) is opted into per component.
- **Component-based**, like React/Vue, but compiles away — no framework runtime shipped to the browser.
- **Content collections** — the actual text/data (coaches, schedule, achievements, gallery captions) lives in typed JSON files, separate from the templates that render them. That keeps content edits simple and makes the project ready for a CMS later without a rewrite.
- Builds to a `dist/` folder any static host can serve — this project deploys to Cloudflare Pages.

## Project structure

```
src/
├── layouts/
│   └── Layout.astro        # <head>, nav, footer, global CSS (design tokens, shared styles)
├── components/              # one file per homepage section
│   ├── Hero.astro
│   ├── Gallery.astro        # image carousel
│   ├── About.astro
│   ├── Programs.astro       # weekly schedule table
│   ├── Achievements.astro   # medal tally + results timeline
│   ├── Coaches.astro
│   ├── Contact.astro
│   └── Divider.astro        # thin horizontal line used between sections
├── pages/
│   ├── index.astro          # homepage — assembles all sections in order
│   ├── about.astro           # "See more" destination for About
│   ├── programs.astro        # "See more" destination for Programs
│   ├── achievements.astro    # "See more" destination for Achievements
│   └── gallery.astro         # "See more" destination for Gallery (full photo grid)
├── content.config.ts        # schema for every content collection below
└── data/                    # the actual editable content, one JSON file per collection
    ├── programs.json
    ├── coaches.json
    ├── stats.json
    ├── medals.json
    ├── results.json
    └── gallery.json

public/
├── logo/tt66-logo.png       # club logo (used in nav + favicon source)
└── favicon.png

reference/
└── original-static-mockup.html   # the original single-file HTML mockup, kept for design reference only — not part of the live site
```

**The pattern to know:** content lives in `src/data/*.json`, validated by a schema in `src/content.config.ts`, and rendered by a component in `src/components/`. To change what's *on the page*, edit the JSON. To change *how it looks*, edit the component.

---

Working on the code? See [DEVELOPMENT.md](DEVELOPMENT.md) for setup, the file-by-file editing guide, and deployment notes.
