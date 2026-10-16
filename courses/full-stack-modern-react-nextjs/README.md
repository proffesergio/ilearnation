# Full-Stack Modern React and Next.js Application Development

Original public review edition **0.3.0** · 20 chapters · English · self-paced.

Build **Field Notes**, a synthetic public technical notebook, through REST,
MongoDB, React, Docker, JWT, server rendering, search metadata, browser tests,
aggregation, GraphQL, realtime events, and Next.js. The chapter titles and order
follow Daniel Bugl's *Modern Full-Stack React Projects*. Original explanations and
project code replace the source listings; the supplied PDF is not redistributed.
The owner confirmed adaptation and publication rights on 16 October 2026.

**Start with [getting-started.md](getting-started.md), then chapter 1 below.**
Use Node.js 24, Git, an editor, and basic HTML/CSS/JavaScript knowledge.
The first three web chapters can be read and tried without login. Sign in for the
remaining web chapters and private version-scoped progress. All authored chapters
and the runnable project are browsable in this repository.

## Chapter route

1. [Preparing for Full-Stack Development](chapters/preparing-full-stack-development.md)
2. [Getting to Know Node.js and MongoDB](chapters/nodejs-and-mongodb.md)
3. [Implementing a Backend Using Express, Mongoose ODM, and Jest](chapters/express-mongoose-and-jest.md)
4. [Integrating a Frontend Using React and TanStack Query](chapters/react-and-tanstack-query.md)
5. [Deploying the Application with Docker and CI/CD](chapters/docker-and-cicd.md)
6. [Adding Authentication with JWT](chapters/jwt-authentication.md)
7. [Improving the Load Time Using Server-Side Rendering](chapters/server-side-rendering.md)
8. [Making Sure Customers Find You with Search Engine Optimization](chapters/search-engine-optimization.md)
9. [Implementing End-to-End Tests Using Playwright](chapters/playwright-end-to-end-testing.md)
10. [Aggregating and Visualizing Statistics Using MongoDB and Victory](chapters/mongodb-and-victory-analytics.md)
11. [Building a Backend with a GraphQL API](chapters/graphql-backend.md)
12. [Interfacing with GraphQL on the Frontend Using Apollo Client](chapters/apollo-client-frontend.md)
13. [Building an Event-Based Backend Using Express and Socket.IO](chapters/express-socketio-backend.md)
14. [Creating a Frontend to Consume and Send Events](chapters/realtime-react-frontend.md)
15. [Adding Persistence to Socket.IO Using MongoDB](chapters/mongodb-event-persistence.md)
16. [Getting Started with Next.js](chapters/getting-started-nextjs.md)
17. [Introducing React Server Components](chapters/react-server-components.md)
18. [Advanced Next.js Concepts and Optimizations](chapters/advanced-nextjs-optimization.md)
19. [Deploying a Next.js App](chapters/deploying-nextjs.md)
20. [Diving Deeper into Full-Stack Development](chapters/deeper-full-stack-development.md)

Chapter 20 includes the capstone retrospective and finishing conclusion.

## Run the original project

Read [the Field Notes guide](projects/field-notes/README.md), then from its directory:

```sh
npm ci
npm test
npm run build
npm run dev:api
```

In another terminal run `npm run dev:web`; visit http://127.0.0.1:5173.
No paid account, production credential, or Mongo installation is needed for the
default memory tests. Optional Mongo persistence uses a local replica set.
Notes are public synthetic examples, not private journals. Do not enter real
personal or confidential information. A restart clears memory-mode data.

## What learning evidence means

Each chapter has objectives, prerequisites, a concept explanation, ordered project
steps, a runnable checkpoint, an exercise, progressive hints, validation,
recovery, common mistakes, accessibility guidance, and reflection. The browser
labs are bounded models, not arbitrary code execution or proof that a framework
project has been completed. Several chapters revisit the same lab boundary from a
different perspective. Collect project test and failure evidence separately.

The code is complete enough to inspect, run, and extend locally. The edition
remains open to human curriculum review. Mongo/Docker/cloud steps must be marked
unverified until they run on the learner's host. It grants no accreditation or
employment/earnings guarantee.

## Sources, versions, and corrections

[References](references.md) record primary documentation and source handling.
Earlier [0.1.0](versions/0.1.0/course.json) and [0.2.0](versions/0.2.0/course.json)
drafts preserve their original IDs and content. Current web URLs redirect legacy
chapter links without migrating earlier progress to unrelated chapters.
Report reproducible corrections using GitHub Issues; exclude secrets.
Keep interactive effects in the web player and GitHub Markdown readable without scripts.
