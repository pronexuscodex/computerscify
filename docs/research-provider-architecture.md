# Research provider architecture

Phase 6 introduces a metadata-only provider boundary for scholarly discovery. It does not download or redistribute papers, publish records automatically, or use an AI model.

## Normalized contract

Every provider maps its response into `NormalizedResearchRecord`. A record keeps:

- the provider and provider-owned identifier;
- title, authors, abstract, dates, categories, and optional DOI/journal reference;
- canonical abstract and provider-supplied PDF links;
- retrieval provenance, source URL, response format, and schema version;
- individual deterministic metadata checks and an explicit verification state.

`provider-metadata` means required provider fields passed normalization checks. It does not mean a human verified the bibliography, publication status, license, file identity, or rendering behavior.

## arXiv adapter

`ArxivResearchProvider` implements search and identifier lookup through the arXiv Atom metadata API. Its production registry uses local-storage caching; callers can inject a different cache, clock, endpoint, and fetch implementation for tests or server-side use.

The adapter:

1. normalizes whitespace, result limits, sort order, and identifiers;
2. serializes requests through one queue;
3. enforces at least three seconds between API requests;
4. retries HTTP 429 and server failures with `Retry-After` or exponential delay;
5. caches only normalized descriptive metadata;
6. records provenance and leaves manual verification separate.

The three-second, single-connection policy follows the current official arXiv API terms. Because those limits can change, provider policy stays configurable but cannot be reduced below the documented floor in this implementation.

## Verification workflow

1. **Provider metadata** — deterministic checks confirm an identifier, title, author, canonical URL, and parseable publication date.
2. **Needs review** — incomplete or inconsistent records enter a review queue and must not be represented as verified.
3. **Manually verified** — a reviewer records their identity, timestamp, evidence, publication status, access/license conclusion, and any corrections.
4. **Rejected** — a mismatched, unverifiable, unsafe, or duplicate record is excluded with reviewer notes.

Phase 7 may consume this provider contract for research-library search and paper details. It must preserve these verification meanings and must not treat a provider response as publication approval.
