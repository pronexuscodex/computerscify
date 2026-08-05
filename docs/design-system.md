# ComputerSciFy design-system foundation

Phase 1 establishes a calm, academic interface foundation without rewriting every feature screen.

## Semantic tokens

Tokens are defined in `src/index.css` and automatically resolve through the active `data-theme`.

- Structure: `--ds-background`, `--ds-surface`, `--ds-surface-muted`, `--ds-surface-elevated`
- Content: `--ds-text`, `--ds-text-muted`
- Boundaries: `--ds-border`, `--ds-border-strong`
- Interaction: `--ds-brand`, `--ds-primary`, `--ds-primary-hover`, `--ds-on-primary`, `--ds-focus`
- Learning: `--ds-learning`, `--ds-learning-soft`
- Domains: `--ds-ai`, `--ds-research`, `--ds-security` and their soft surfaces
- Status: `--ds-success`, `--ds-danger` and their soft surfaces
- Shape and depth: semantic radius and shadow tokens
- Layout: page gutter, content width, and reading width

Gold remains a learning highlight. Blue is the primary interactive color. Red is reserved for critical and destructive states.

## Shared primitives

The shared Button, Card, Input, Select, Tabs, Dialog, and Drawer components use semantic tokens. Dialogs and drawers restore focus when closed and respect the operating system's reduced-motion preference.

Reusable layout primitives are exported from `src/components/common/Layout.tsx`:

- `PageContainer`
- `Stack`
- `Cluster`
- `ContentGrid`
- `SectionHeader`

## Accessibility baseline

Calculated contrast ratios:

| Pair | Light | Dark |
| --- | ---: | ---: |
| Primary text / background | 16.68:1 | 18.08:1 |
| Secondary text / background | 5.98:1 | 9.18:1 |
| Primary-action text / action background | 5.81:1 | 7.64:1 |

The rendered desktop and 375px mobile audits found no page-level horizontal overflow after the shell and dashboard migration. Shared interactive controls have visible focus indicators, and the dashboard's previously clipped titles now wrap or use intentional multi-line clamping.

## Migration boundary

The initial audit found 2,671 hardcoded color occurrences across 37 component/style files. Phase 1 reduced that baseline to 2,264 occurrences across 29 files by migrating the global shell and shared primitives. Remaining feature-page styles are deliberately left for incremental migration rather than a risky whole-application rewrite.
