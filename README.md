# Alba & Notte

The website for Alba & Notte, a café by day and a bar by night in Malta.

It's a plain static site: just HTML, CSS and JavaScript, with no build step.

```
index.html   – page markup
styles.css   – all styling
script.js    – nav highlighting, menu pop-up, blog carousel, opening hours, newsletter
assets/      – logo, headings, illustrations and photos
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com, go to **Add New → Project** and import the repo.
3. Set Framework Preset to **Other**. Leave the Build Command empty and the Output Directory as `.` (root).
4. Deploy. After that, every push to `main` redeploys the site automatically.

## Before launch

- Fill in the `[bracketed]` placeholders: the Visit Us text and the blog excerpts/posts (in `POSTS` in `script.js`).
- Replace `assets/map.jpg` with a real map, for example a Google Maps embed of the café.
- Connect the newsletter form to an email service (see the `TODO` in `script.js`).
- Opening hours live in `HOURS` in `script.js`. The time zone is set to `Europe/Malta`.
