# RMS 2.0 — Prototype

A clickable, high-fidelity **prototype** of Research Management System 2.0 for
ISRA Institute / Research Management Centre (RMC), INCEIF University.

**Live demo:** https://obel1.github.io/rms2-prototype/

## What this is

A visual, navigable preview of the proposed RMS 2.0 — the Request Submission
hub, forms, role-based approval routing, position registry, letter generation,
and dashboards — built from the forms-to-system specification.

## What this is NOT

This is **not the live system**. There is no backend, no login, and no
database. All data is mock/in-memory and nothing persists. It exists for
stakeholder review and to align on design before development with the ICT
department.

## Key concept

Approval routing is tied to **office positions, not named individuals**. The
Position Registry resolves each position to its current holder — change the
holder in one place and all future approvals re-route automatically.
Historical approvals stay correctly attributed to whoever held the post at
the time.

## Screens

| # | Screen | Route |
| --- | --- | --- |
| 1 | Dashboard | `/` |
| 2 | Request Submission Hub | `/requests` |
| 3 | Disbursement Request Form | `/submit/financial/drf` |
| 4 | RA Application Form | `/submit/research/ra-application` |
| 5 | Research Extension Form | `/submit/research/extension` |
| 6 | Projects · Project Detail | `/projects` · `/projects/:id` |
| 7 | Position Registry (admin) | `/admin/positions` |
| 8 | Letter preview modal | shared, on Project Detail + RA form |

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173/rms2-prototype/

## Deploy

Pushing to `main` runs the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages. The first deploy takes 2–5 minutes; subsequent deploys are
faster.

## Stack

- Vite + React 19
- Tailwind CSS v4
- React Router 7 (HashRouter — works on GitHub Pages without server config)

## Status

Design prototype · for internal review · production build pending ICT scoping.
