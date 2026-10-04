# Task List UI (frontend)

React 19 + Vite frontend for a simple Task list app. It pairs with the [backend](https://github.com/hafizmuhammadsaadullah/backend), a Rails API.

## Stack

- React 19
- Vite
- Oxlint for linting
- Docker (`Dockerfile` and `Dockerfile.dev`) with Nginx (`nginx.conf`) serving the production build
- GitHub Actions workflow that auto-deploys the frontend to AWS EC2 on push

## Getting started

```sh
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run lint` and `npm run preview`.
