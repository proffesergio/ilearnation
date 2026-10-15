# Course references and source status

Research date: 2026-10-16. Official links below were opened read-only during this
authoring session and support current technical claims, not copied lesson text. The
owner confirmed adaptation rights for the local Packt book on 2026-10-16. Its chapter
structure is being mapped; these existing original draft lessons have not yet been
rewritten from it. No PDF text, code, screenshot, or page image is redistributed.
The platform repository keeps a detailed source and chapter map at
`docs/research/2026-10-16-course-roadmap-sources.md`.
Linked websites retain their own licenses and terms. Course and code licensing still
needs review before public release.

| Title                            | Author                            | URL                                                                                   | Status / license handling                                                                              | Accessed   | Chapters supported                          |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------- |
| Test runner                      | Node.js contributors              | https://nodejs.org/api/test.html                                                      | Official reference, link only; no source text redistributed                                            | 2026-10-16 | foundations; quality-accessibility-security |
| Your First Component             | React team                        | https://react.dev/learn/your-first-component                                          | Official reference, link only; no source text redistributed                                            | 2026-10-16 | foundations                                 |
| Everyday Types                   | Microsoft TypeScript team         | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html                    | Official reference, link only; no source text redistributed                                            | 2026-10-16 | javascript-typescript                       |
| State: A Component's Memory      | React team                        | https://react.dev/learn/state-a-components-memory                                     | Official reference, link only; no source text redistributed                                            | 2026-10-16 | react-components                            |
| Server and Client Components     | Vercel Next.js team               | https://nextjs.org/docs/app/getting-started/server-and-client-components              | Official reference, link only; no source text redistributed                                            | 2026-10-16 | nextjs-routing                              |
| Installation                     | Vercel Next.js team               | https://nextjs.org/docs/app/getting-started/installation                              | Official reference, link only; no source text redistributed                                            | 2026-10-16 | nextjs-routing                              |
| Forms with Server Actions        | Vercel Next.js team               | https://nextjs.org/docs/app/guides/forms                                              | Official reference, link only; no source text redistributed                                            | 2026-10-16 | data-and-forms; capstone                    |
| Labeling Controls                | W3C Web Accessibility Initiative  | https://www.w3.org/WAI/tutorials/forms/labels/                                        | Official reference, link only; no source text redistributed                                            | 2026-10-16 | quality-accessibility-security; capstone    |
| Understanding GitHub Actions     | GitHub documentation contributors | https://docs.github.com/en/actions/get-started/understand-github-actions              | Official reference, link only; no source text redistributed                                            | 2026-10-16 | production-workflows                        |
| Download Node.js                 | Node.js contributors              | https://nodejs.org/en/download                                                        | Official installation destination, link only; no source text redistributed                             | 2026-10-16 | foundations setup                           |
| Creating a React App             | React team                        | https://react.dev/learn/creating-a-react-app                                          | Official guidance recommends a framework for new production React apps; link only                      | 2026-10-16 | React and course architecture               |
| App Router: Getting Started      | Vercel / Next.js team             | https://nextjs.org/docs/app/getting-started                                           | Current App Router concept map; link only                                                              | 2026-10-16 | Next.js roadmap                             |
| Deploying                        | Vercel / Next.js team             | https://nextjs.org/docs/app/getting-started/deploying                                 | Current deployment modes and feature limits; link only                                                 | 2026-10-16 | production workflows and capstone           |
| Modern Full-Stack React Projects | Daniel Bugl; Packt Publishing     | https://www.packtpub.com/en-GB/product/modern-full-stack-react-projects-9781837637959 | Owner confirms adaptation rights; book copyright remains Packt; chapter map only, no verbatim material | 2026-10-16 | proposed full pathway                       |

## Claim notes

- TypeScript documentation supports the distinction between type descriptions and
  actual runtime values. Our validation examples are newly authored JavaScript.
- React documentation supports state as component memory and updates requesting
  rendering. The transition checkpoint separately tests only pure JavaScript logic.
- Next.js documentation supports App Router server/client boundaries and form entry
  points. The lessons never claim the Node checkpoints execute the framework.
- WAI documentation supports visible, programmatically associated labels. A review
  checklist does not establish complete accessibility conformance.
- GitHub Actions documentation supports workflow-based automation. Local proposed
  workflows do not imply a remote CI run or permission to deploy.

Recheck current framework documentation before updating examples or publishing a
course version. The book is from 2024; commands and versions need current source
checks. Published versions should remain immutable; material changes need a version
change and review. These notes cover original draft 0.1.0 plus the proposed roadmap.
