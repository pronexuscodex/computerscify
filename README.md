# ComputerSciFy

**A browser-based, first-principles Computer Science & Data Science degree platform.**

ComputerSciFy is a self-contained learning environment that takes a learner from binary logic gates through deep learning, MLOps, and applied AI engineering — structured as two full four-year degree programs (B.S. Computer Science and B.S. Data Science) plus specialized elective tracks in AI Engineering, Cybersecurity, and Data Engineering. Every lesson, exercise, glossary entry, and reading recommendation is human-authored and deterministic — there is no AI model integration, no generated content, and no network calls to any LLM provider anywhere in the curriculum or its tooling.

🔗 **Live demo:** _add your deployed Netlify URL here_

---

## What's inside

- **Two full degree programs** — Computer Science and Data Science, each organized into years, semesters, and courses, with shared/equivalent courses tracked so progress carries over between the two tracks.
- **A 9-phase self-paced roadmap** — from digital logic and discrete math through classical ML, deep learning, MLOps, and specializations, independent of the degree-program structure for learners who want a linear path.
- **Dedicated elective tracks** for AI Engineering (LLM APIs, RAG, evals, agentic workflows, AI safety/governance), Cybersecurity (defensive-only, with explicit lab safety classifications and legal-use metadata), and Data Engineering.
- **A 220+ term glossary** and rich per-topic mastery packs — core concepts, common misconceptions, practice exercises, and reading questions for every topic, not just links to external material.
- **An in-app reader** for textbook PDFs and research papers, with three fallback rendering modes (a canvas-based rich reader, a native browser PDF frame, and a Google Docs viewer) so a resource degrades gracefully instead of failing outright.
- **Offline reading** — any book or paper can be saved for offline access (stored as a blob in IndexedDB), with per-item and bulk "save for offline" actions and a storage manager in Settings.
- **Installable as a PWA** — a service worker precaches the app shell, so the app itself loads with no network connection once visited.
- **Interactive coding labs** running real Python in-browser via Pyodide (WebAssembly), plus JavaScript/TypeScript and SQL exercises — no backend execution, no code leaves the browser.
- **A research library** with arXiv metadata integration (metadata only — no paper content is fetched or generated), reading worksheets, and personal collections.
- **Deterministic curriculum integrity tooling** — scripts that validate every course, prerequisite chain, resource link, and safety-classification claim, run in CI-style locally before anything ships.

## Tech stack

| Layer | Choices |
|---|---|
| UI | React 19, TypeScript, Tailwind CSS v4, Framer Motion, React Router (hash-based) |
| Content storage | Deterministic, hand-authored TypeScript data modules (no CMS, no database) |
| Local persistence | IndexedDB via `idb` (progress, notes, offline files) |
| PDF rendering | `react-pdf` / `pdfjs-dist`, with a CORS proxy for cross-origin academic sources |
| In-browser code execution | Pyodide (Python via WebAssembly) |
| Offline / PWA | `vite-plugin-pwa` (Workbox-generated service worker) |
| Build | Vite 6 |
| Deployment | Netlify (static hosting + a serverless function serving the PDF proxy in production) |

## Getting started

**Requirements:** Node.js 20+, npm 11 (the repo uses `package-lock.json` as its only lockfile).

```bash
npm ci
npm run dev
```

No API key or environment variable is required for local development — everything runs client-side.

## Available scripts

```bash
npm run dev              # start the local dev server
npm run build             # production build
npm run preview           # serve the production build locally

npm run typecheck         # TypeScript, no emit
npm test                  # deterministic test suite (scripts/test-runner.ts)
npm run curriculum:validate   # validates every course/prerequisite/credit mapping
npm run resources:verify      # audits the academic resource manifest for integrity
npm run validate           # runs everything above, in order, plus a full build
```

`npm run resources:verify` performs a deterministic manifest-integrity audit — it does not claim a resource is externally verified without provenance and runtime evidence. Run `npm run resources:report` to refresh the JSON audit report.

```bash
npm run clean              # cross-platform clean (Windows/macOS/Linux)
```

## Project structure

```
src/
├── components/        # UI, organized by feature (dashboard, reader, player, admin, ...)
├── curriculum/         # degree-program definitions, canonical course registry
├── data/                # phase modules, glossary, video/resource registries
├── services/            # storage (IndexedDB), offline caching, PDF resolution
├── hooks/               # shared React hooks
├── context/              # navigation & theme providers
└── types/                # shared TypeScript types

netlify/functions/       # production PDF proxy (mirrors the local dev-server middleware)
scripts/                 # curriculum validation, resource audits, test runner
```

## Deployment

The app is a static Vite build deployed on Netlify from the `main` branch, with `netlify.toml` configuring the build, an SPA fallback redirect, and a serverless function (`netlify/functions/pdf-proxy.ts`) that proxies whitelisted academic PDF hosts in production — the same role a small Vite dev-server middleware plays locally, sharing one allowlist module so the two never drift out of sync.

## Design principles

- **Deterministic over generated.** Curriculum content, recommendations, and progress logic are all rule-based and human-authored. This is enforced by tests, not just convention.
- **Local-first.** No accounts, no tracking, no backend database — all learner data lives in the browser's IndexedDB.
- **Defensive-only where it matters.** The cybersecurity track carries explicit safety classifications (`defensive` / `educational-lab` / `dual-use` / `restricted` / `prohibited`) on every lesson and lab, and is verified by tests to contain no exploit-runner or autonomous-agent code.
