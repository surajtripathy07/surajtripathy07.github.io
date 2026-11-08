# Site art generator

Plain Node ESM, no dependencies. Run from the repo root:

    node tools/art/build.mjs

It runs `sheet.mjs`, `home.mjs` and `about.mjs`, each in its own process so the seeded jitter is reproducible.
Output is committed, because CI has no Node step:

- `layouts/partials/art/` : ground, sheet edges, clock, and the home painting and its edges
- `data/art.json` : pools of hand-drawn hairlines and heading underlines
- `data/dabs.json` : one paint dab per listed drop on the home page
- `static/img/grain.png` : the grain texture used by the CSS

`lib.mjs`, `scene.mjs` and `tear.mjs` hold the shared drawing helpers and the studio scene.
After editing any of them, rerun the build and commit the changed output.
