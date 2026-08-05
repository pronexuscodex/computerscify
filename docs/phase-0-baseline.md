# Phase 0 repository baseline

Date: 2026-08-03

## Toolchain

- Package manager: npm 11.17.0
- Runtime used for validation: Node.js 24.14.0
- Canonical lockfile: `package-lock.json` (lockfile version 3)
- Supported runtime declared by the package: Node.js 20 or newer
- Cross-platform cleanup: `npm run clean` uses `node:fs/promises`

## Stabilization findings addressed

- Removed the secondary `bun.lock` so dependency resolution has one source of truth.
- Replaced placeholder package metadata with ComputerSciFy metadata.
- Removed the unused `@google/genai` dependency and regenerated `package-lock.json`.
- Removed the Gemini key template, model capability metadata, and obsolete AI Studio setup copy.
- Confirmed no `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, model SDK reference, or common model-credential pattern remains in repository files.
- Replaced simulated resource verification with a deterministic manifest-integrity audit.
- Removed the unrelated sample-PDF substitution that could display one file under another resource's title.

## Resource integrity baseline

The deterministic audit currently covers 39 manifest topics and 82 resources.

- Structurally invalid records: 0
- Conflicting duplicate URLs: 0
- Duplicate URLs requiring provenance review: 15
- Resources with complete external verification evidence: 0
- Resources marked `needs-review`: 82

`needs-review` is intentional. The current manifest does not store enough evidence to prove final redirects, response metadata, file fingerprints, licenses, or PDF rendering. Phase 0 no longer labels those checks successful without evidence.

## Remaining dependency advisory

`npm audit --omit=dev` reports two high-severity findings through `react-router-dom` / `react-router` for GHSA-qwww-vcr4-c8h2. npm's automated remediation recommends forcing `react-router-dom@7.11.0`, which is outside the repository's current `^7.18.1` range and is reported as a breaking change. Phase 0 records this advisory rather than forcing an unreviewed routing downgrade.

## Pre-change validation baseline

- TypeScript (`npm run lint`): passed
- Tests (`npm test`): 18 passed, 0 failed
- Curriculum validation (`npm run curriculum:validate`): 25 canonical courses, 0 errors

The final Phase 0 command results are reported in the implementation handoff.
