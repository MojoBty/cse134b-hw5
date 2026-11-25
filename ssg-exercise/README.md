# Astro SSG Exercise

Two pages from my portfolio (About and Experience) built with Astro.
Both pages use the same footer from `src/components/Footer.astro`.

## Setup

Run these from the `ssg-exercise` folder.

Install dependencies:

    npm install

Build the site (outputs to `dist/`):

    npm run build

Preview the built pages:

    npm run preview

Then open:

- http://localhost:4321/about.html
- http://localhost:4321/experience.html

## Notes

- The footer is in `src/components/Footer.astro` and gets added to both pages through `src/layouts/BaseLayout.astro`. Changing it there and rebuilding updates both pages.
- `npm run dev` also works if you want live reload while editing.