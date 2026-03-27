# Amy Birthday Site

React + Vite birthday page for Amy.

## Local

```bash
npm install
npm run dev
```

## GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

One-time setup:

1. Create a GitHub repo and add it as the remote for this folder.
2. Push this project to either the `main` or `master` branch.
3. In GitHub, open `Settings -> Pages`.
4. Set the source to `GitHub Actions`.
5. Push again if needed. The workflow will build `dist` and deploy it.

## Netlify

Build command: `npm run build`

Publish directory: `dist`
