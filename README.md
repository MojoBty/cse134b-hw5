# CSE 134B HW5

This is my portfolio site for Homework 5. The Web Component is called `<fun-fact>` and it loads random facts from the Useless Facts API. It is on the home page in the "Take a Break" section.

## SSG Exercise

The Astro exercise is in the `ssg-exercise/` folder. The two pages to preview are `about.html` and `experience.html`. The commands to install, build, and preview it are in `ssg-exercise/README.md`.

## Design Note

The component is meant to be a fun, interactive feature for the visitor.

When the visitor clicks the "New fact" button, its click listener calls `loadFact()`, which sends a `fetch()` request to the Useless Facts API. The response is checked with `response.ok`, then the JSON is parsed and the `text` field is checked to make sure it is a string. If everything looks right, the fact is saved and `render()` updates the fact and its source on the page using `textContent`, so nothing reloads.

While the request is loading, the status area says "Loading a fact…" and the button is greyed out. When it succeeds, the new fact appears and the status says "New fact loaded." If it fails, the previous fact stays on the page, the status shows an error message, and the button changes to "Try again" so the visitor can retry without reloading the page.
