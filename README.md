# ComputerSciFy

ComputerSciFy is a browser-based learning platform for studying computer science and data science from first principles. Its curriculum, exercises, recommendations, and progress rules are human-authored and deterministic.

## Requirements

- Node.js 20 or newer
- npm 11 (the repository uses `package-lock.json` as its only lockfile)

## Local development

```bash
npm ci
npm run dev
```

No model API key or other environment variable is required for local development.

## Validation

Run the complete local validation pipeline with:

```bash
npm run validate
```

Individual checks are also available:

```bash
npm run typecheck
npm test
npm run curriculum:validate
npm run resources:verify
npm run build
```

`npm run resources:verify` performs a deterministic manifest-integrity audit. It does not claim that a resource is externally verified without provenance and runtime evidence. Use `npm run resources:report` to refresh the JSON audit report.

## Maintenance

```bash
npm run clean
```

The clean command uses Node filesystem APIs and works on Windows, macOS, and Linux.
