# ComputerScify

**A structured, research-driven learning platform for Computer Science and Data Science.**

[![React](https://img.shields.io/badge/React-18%2B-20232A?logo=react&logoColor=61DAFB)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](#tech-stack)
[![Vite](https://img.shields.io/badge/Vite-Powered-646CFF?logo=vite&logoColor=white)](#tech-stack)
[![Accessibility](https://img.shields.io/badge/WCAG-2.2%20AA-BE94F5)](#accessibility)

---

## Overview

ComputerScify is an open-source platform for studying Computer Science and Data Science through complete, university-inspired curricula — connecting lectures, papers, books, exercises, labs, and assessments in one coherent environment instead of scattering them across disconnected tools.

Programs are organized as:

```
Program → Academic Year → Semester → Course → Module → Topic → Concept
```

Shared courses use canonical records, so progress, notes, and bookmarks stay in sync across both programs.

## Why ComputerScify

Most learning platforms offer isolated videos or one-off tutorials. ComputerScify is built as a complete academic environment, with:

- Prerequisite-based, coherent curricula
- Deep, derivation-level concept explanations
- Verified academic resources (papers, books, PDFs)
- Interactive programming labs and problem sets
- Course projects and capstones
- Local-first progress and session continuity

## Core Programs

| Program | Focus Areas |
|---|---|
| **Computer Science** | Programming foundations, discrete math, data structures & algorithms, OS, networking, databases, software engineering, compilers, distributed systems, security, AI/ML, HCI, capstone |
| **Data Science** | Python/NumPy/pandas, SQL, linear algebra & statistics, EDA & visualization, ML/deep learning, NLP, computer vision, time series, causal inference, data engineering, MLOps, capstone |

## Key Features

- **Deep Concept Pages** — intuition, formal definitions, derivations, proofs, code, complexity analysis, and common misconceptions
- **Verified Academic Resources** — lectures, open textbooks, seminal papers, and technical reports, checked for availability, licensing, and relevance
- **In-App PDF Reader** — continuous scrolling, zoom, annotations, bookmarks, and position restoration (via `react-pdf` + `pdfjs-dist`)
- **Interactive Lab** — browser-based coding in Python, JS/TS, SQL, HTML/CSS with tests, hints, and persistence
- **Practice Arena** — original problems across algorithms, data structures, SQL, statistics, and systems reasoning
- **Learning Continuity** — restores active course, scroll position, PDF/video state, lab code, and notes after reload

## Tech Stack

**Frontend:** React · TypeScript · Vite · React Router
**Learning Tools:** react-pdf · pdfjs-dist · Monaco / CodeMirror 6 · Pyodide · sql.js · Web Workers
**Quality:** Strict TypeScript · unit & e2e tests · curriculum/resource validation · accessibility audits

## Project Structure

```
src/
├── app/            # routes, providers, shell
├── components/     # navigation, curriculum, resources, pdf, video, lab, ui
├── data/           # curricula, courses, topics, concepts, resources
├── features/       # curriculum, progress, reader, practice, search, persistence
├── hooks/
├── lib/
├── styles/
├── types/
└── tests/
```

## Getting Started

**Requirements:** Node.js 20 LTS+, npm 10+, Git

```bash
git clone https://github.com/YOUR_USERNAME/computerscify.git
cd computerscify
npm install
npm run dev
```

```bash
npm run build      # production build
npm run preview    # preview the build
npm run typecheck
npm test
```

## Curriculum & Resource Standards

Content integrity is non-negotiable:

- Every course has a stable canonical ID; no cycles in prerequisites; no empty routes
- Papers/books are verified for authorship, venue, license, and open-access status
- No pirated PDFs, anonymous mirrors, guessed DOIs/arXiv IDs, or paywalled content presented as open access

## Design Principles

A restrained, neo-brutalist visual language — professional, calm, and accessible. No gradients, glassmorphism, glowing borders, or fake analytics. Red is reserved strictly for errors and destructive actions.

## Accessibility

Targets **WCAG 2.2 AA**: full keyboard navigation, visible focus states, semantic landmarks, reduced-motion support, 44px touch targets, and verified behavior from 320px up through 200% zoom.

## Contributing

1. Branch from a focused scope
2. Run `npm run typecheck`, `npm test`, `npm run build`
3. Verify academic metadata and curriculum integrity
4. Include screenshots for visual changes

Commit style: `feat:` `fix:` `content:` `a11y:` `test:`

## Roadmap

- [ ] Complete CS and DS curricula with canonical shared courses
- [ ] Resource verification dashboard
- [ ] Production PDF reader, Interactive Lab, and Practice Arena
- [ ] Full accessibility and responsive audits
- [ ] Production deployment

## Security

Report vulnerabilities privately. The app never proxies arbitrary URLs, exposes environment variables, or executes learner code outside a sandboxed context.

## License

_Add the repository's actual license (MIT / Apache-2.0 / AGPL-3.0 recommended)._

---

**Learn deeply. Build deliberately. Understand completely.**
