# ComputerSciFy Codebase Audit

**Date:** 2026-08-04
**Branch:** feat/stitch-design-integration
**TypeScript Version:** 5.8.2

---

## 🔴 TypeScript Errors (Blocking Build)

| File | Line | Issue | Fix |
|------|------|-------|-----|
| `src/components/layout/NavigationRail.tsx` | 20-34 | `NavView` union type missing `'academies'` | Add `'academies'` to the type |
| `src/components/layout/Breadcrumbs.tsx` | 71 | Switch case `'academies'` not in `NavView` | Same fix as above |
| `src/utils/routes.ts` | 107 | `'academies'` in `knownViews` but not in `NavView` | Same fix as above |
| `src/components/layout/AppShell.tsx` | 333 | Passes `onSelectProgram` prop to `RoadmapView` which doesn't accept it | Remove prop from AppShell OR add to `RoadmapViewProps` |

---

## 🟠 Architecture Issues

| Area | Problem | Recommendation |
|------|---------|----------------|
| **Navigation Type Sync** | `NavView` defined in 3 places: `NavigationRail.tsx`, `routes.ts`, `Breadcrumbs.tsx` | Create single source of truth: `src/types/navigation.ts` |
| **Component Prop Drilling** | `AppShell` passes `progress` + 8+ handlers to every view | Use React Context for progress/navigation; consider file-based routing |
| **Route/View Mismatch** | `routes.ts` knows about `academies` but NavigationRail doesn't expose it | Sync navigation config with route parser |
| **Lazy Loading Inconsistency** | Some views lazy-loaded (`RoadmapView`, `AcademyExplorerView`), others not; no error boundaries | Add `<ErrorBoundary>` wrapper for all lazy chunks; standardize lazy loading |
| **Curriculum Data Duplication** | `phase5_ml.ts` duplicates topic structure from `canonicalRegistry.ts` | Single source of truth; generate module views from canonical courses |

---

## 🟡 Code Quality Concerns

| File | Lines | Concern |
|------|-------|---------|
| `src/components/lab/LabWorkspaceView.tsx` | 695 | Monolithic component — split into 6+ components + custom hooks |
| `src/services/codeRunner.ts` | 528 | Fake C/SQL executors (regex only); Pyodide loaded from CDN; no CSP headers |
| `src/data/curriculumData.ts` | 378 | `normalizeTopicResourceArrays` mutates input; complex deduplication logic |
| `src/components/techwatch/TechWatchView.tsx` | (deleted) | Was using wrong cache type (`LocalStorageResearchCache` instead of own cache) |

---

## 🟢 Missing Features / Gaps

| Feature | Status | Priority |
|---------|--------|----------|
| **Unit/Integration Tests** | Vitest configured but no test files exist | High |
| **Error Boundaries** | None — Pyodide load failure crashes entire lab | High |
| **Offline Support** | No Service Worker; curriculum not cached for offline | Medium |
| **Accessibility** | Partial ARIA; missing focus management in modals/drawers | Medium |
| **CSP Headers** | None — Pyodide/eval requires `unsafe-eval` | High |
| **Pyodide Version Pinning** | Loads from CDN `@v0.25.0` without integrity hash | High |
| **Real SQL/C Execution** | Currently fake regex parsers only | Medium |

---

## 📋 Priority Fixes (Recommended Order)

### 1. Unblock Build (Immediate)
- [ ] Add `'academies'` to `NavView` type in `NavigationRail.tsx`
- [ ] Fix `RoadmapView` props mismatch in `AppShell.tsx`

### 2. Architecture Cleanup (Week 1)
- [ ] Centralize `NavView` type in `src/types/navigation.ts`
- [ ] Add `ErrorBoundary` component for lazy-loaded views
- [ ] Extract `LabWorkspaceView` into: `LabHeader`, `LabSelector`, `LabEditorPane`, `LabConsolePane`, `useLabTimer`, `useLabExecution`, `useLabDraft`

### 3. Security & Reliability (Week 1-2)
- [ ] Vendor Pyodide locally (`npm i pyodide@0.25.0`) + add integrity check
- [ ] Add CSP headers via `vite.config.ts` or server middleware
- [ ] Replace fake SQL executor with `sql.js` (SQLite WASM)
- [ ] Replace fake C executor with `wasm3` + clang WASM or WebContainer API

### 4. Testing Foundation (Week 2)
- [ ] Add Vitest tests for: `codeRunner.ts` (syntax analysis), `curriculum` validators, `storage.ts`, `progressMigration.ts`
- [ ] Add `@vitest/browser` for Pyodide integration tests

### 5. Developer Experience (Ongoing)
- [ ] Service Worker for offline curriculum + Pyodide caching
- [ ] LSP integration (pyright, typescript-language-service) for CodeEditor
- [ ] Focus management for modals/drawers
- [ ] Centralized CDN config with env overrides

---

## 📁 Key Files to Review

```
src/
├── components/layout/
│   ├── NavigationRail.tsx     # NavView type definition
│   ├── AppShell.tsx           # View rendering + prop drilling
│   └── Breadcrumbs.tsx        # Uses NavView cases
├── utils/
│   └── routes.ts              # Route parsing, knownViews
├── components/lab/
│   └── LabWorkspaceView.tsx   # 695 lines — needs splitting
├── services/
│   └── codeRunner.ts          # Multi-language execution (security concerns)
├── data/
│   └── curriculumData.ts      # Curriculum normalization logic
└── curriculum/
    └── canonicalRegistry.ts   # Single source of truth for courses
```

---

## 🛠 Quick Wins

```bash
# 1. Fix build immediately
# Edit NavigationRail.tsx:20-34 add 'academies' to NavView union

# 2. Run typecheck to verify
npm run typecheck

# 3. Add basic error boundary
# Create src/components/common/ErrorBoundary.tsx

# 4. Pin Pyodide
npm i pyodide@0.25.0
# Update codeRunner.ts to import from 'pyodide' instead of CDN
```

---

*Generated by automated codebase audit. Run `npm run typecheck` to verify current error state.*