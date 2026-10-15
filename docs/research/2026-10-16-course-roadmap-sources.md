# First Course Roadmap: Research and Reference Notes

Retrieved 2026-10-16. This is a source map for an original, interactive React and
Next.js course for mixed self-directed learners. The course should bridge the
book's React-experienced audience with optional JavaScript and React foundations,
then carry each learner through a tested full-stack project and deployment practice.

## Book source and rights record

Daniel Bugl, _Modern Full-Stack React Projects: Build, maintain, and deploy modern
full-stack web applications using React, Node.js, MongoDB, and Docker_, Packt
Publishing, 2024, ISBN 978-1-83763-795-9. Local source:
`refBooks/Modern_Full_Stack_React_Projects_Build,_maintain,_and_deploy_modern.pdf`.
The PDF identifies Packt copyright and all-rights-reserved terms. The owner confirmed
adaptation rights on 2026-10-16. Attribute the source, paraphrase concepts, author
new examples and exercises, and do not reproduce its prose, code, screenshots, or
page images. Public-release terms still need to be included in the course's license
review. The visual direction records its readable hierarchy and instructional cues,
not copied page artwork.

| Source                                                                                               | Publisher/author              | Date retrieved | Claim used                                                                                                     | License/status                                              |
| ---------------------------------------------------------------------------------------------------- | ----------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Book record](https://www.packtpub.com/en-GB/product/modern-full-stack-react-projects-9781837637959) | Packt Publishing; Daniel Bugl | 2026-10-16     | Bibliographic details and chapter scope                                                                        | Packt copyright; owner reports adaptation rights; link only |
| [React: Creating a React App](https://react.dev/learn/creating-a-react-app)                          | React team                    | 2026-10-16     | React currently recommends starting new production apps with a framework; Next.js App Router is one option     | Official docs; link only                                    |
| [Next.js App Router: Getting Started](https://nextjs.org/docs/app/getting-started)                   | Vercel / Next.js team         | 2026-10-16     | Current learning areas include routing, server/client components, data, forms, caching, errors, and deployment | Official docs; link only                                    |
| [Next.js: Deploying](https://nextjs.org/docs/app/getting-started/deploying)                          | Vercel / Next.js team         | 2026-10-16     | Deployment routes include Node.js, Docker, static export, and adapters with different feature support          | Official docs; link only                                    |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)                            | Microsoft TypeScript team     | 2026-10-16     | TypeScript is a static checker for JavaScript, not runtime input validation                                    | Official docs; link only                                    |
| [MDN Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)          | MDN contributors              | 2026-10-16     | A structured path spans beginner foundations, core skills, challenges, and further resources                   | Community documentation; link only                          |

## Twenty-chapter coverage map

The book's table of contents has 20 chapters. Each is represented in the intended
course pathway below. This is a coverage map, not a transcription of chapter text;
each learner lesson needs an original explanation, runnable checkpoint, exercise,
progressive hints, validation, common mistakes, accessibility note, and reflection.

| Book chapter                                 | Course treatment and interactive outcome                                            |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1. Preparing for Full-Stack Development      | Setup and tool choice; make a first change and verify the environment               |
| 2. Getting to Know Node.js and MongoDB       | Browser/server boundaries, local services, and safe data handling                   |
| 3. Backend Using Express, Mongoose, and Jest | Design a small API and validate service behavior with tests                         |
| 4. Frontend with React and TanStack Query    | Build a UI that handles loading, success, and failure from an API                   |
| 5. Docker and CI/CD Deployment               | Package, check, and deploy a project with a rollback plan                           |
| 6. Authentication with JWT                   | Model identity, session handling, and authorization boundaries                      |
| 7. Server-Side Rendering                     | Compare rendering paths and measure a useful performance baseline                   |
| 8. Search Engine Optimization                | Add meaningful routes, metadata, and discoverability checks                         |
| 9. End-to-End Tests with Playwright          | Automate one learner-visible journey and inspect its report                         |
| 10. Statistics with MongoDB and Victory      | Aggregate minimal events and explain what a chart can and cannot say                |
| 11. Backend GraphQL API                      | Compare query contracts and validate a small query/mutation                         |
| 12. GraphQL with Apollo Client               | Connect a client query and mutation to visible UI states                            |
| 13. Event-Based Backend with Socket.IO       | Trace a real-time event through an authenticated server boundary                    |
| 14. Frontend for Events                      | Build reconnect, pending, and error states for a live client                        |
| 15. MongoDB Persistence for Socket.IO        | Persist and replay messages with explicit retention rules                           |
| 16. Getting Started with Next.js             | Translate route and layout concepts into the current App Router                     |
| 17. React Server Components                  | Choose a server/client boundary for a small data-backed view                        |
| 18. Advanced Next.js and Optimization        | Review caching, metadata, assets, and invalidation trade-offs                       |
| 19. Deploying a Next.js App                  | Practice environment configuration, deployment, and production checks               |
| 20. Deeper Full-Stack Topics                 | Compare frameworks, state tools, monorepos, and bundle budgets in a capstone review |

The original eight local draft chapters provide prerequisites and a first learning
loop. They do not yet implement all 20 mapped areas. The current capstone is local;
production deployment and advanced optional tracks remain to be authored and reviewed.

## Book-inspired lesson presentation

Use the source's clear instructional hierarchy in responsive web lessons: a strong
chapter heading, compact reading text, numbered procedures, concise prerequisite or
tool tables, visually distinct Note/Tip callouts, and labeled figures. Keep body copy
comfortable to scan and code in separate blocks. Use semantic headings, lists, table
captions, and callout labels so the visual cues also work with assistive technology.
Do not embed book page screenshots or depend on color alone.

## Version and freshness policy

The book is a 2024 reference and its framework/tool commands can age. Verify each
version-sensitive step against the official React, Next.js, TypeScript, Node.js,
database, test, and deployment documentation before authoring or revising lessons.
Keep source URLs, author/publisher, retrieval date, claim, license/status, and mapped
chapters beside the course. The existing draft is 0.1.0; a materially expanded
chapter map must be reviewed as a new course version before publication.
