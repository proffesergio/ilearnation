# API and chapters 1–10 source review

Reviewed 2026-10-16. These are original claim notes, not copied source prose or code.
The owner-supplied *Modern Full-Stack React Projects* PDF was read privately for
the chapter sequence, topic boundaries and relevant explanations. Its extraction
and source file remain outside the published course. Draft 0.3.0 changes tool
versions and security choices rather than reproducing the book's listings.

| Chapters | Primary source | Current claim used |
| --- | --- | --- |
| 1 | https://vite.dev/guide/ | Vite provides a local development server and production build; the authored project uses its React integration rather than an obsolete generated scaffold. |
| 1–2, 6 | https://nodejs.org/docs/latest-v24.x/api/crypto.html | Node provides asynchronous scrypt, random bytes and timing-safe comparison. Browser code cannot import server-only Node APIs. |
| 3 | https://expressjs.com/en/5x/api/ | Express 5 handles promise-rejecting asynchronous routes; JSON input must still be validated and bounded. |
| 3 | https://mongoosejs.com/docs/guide.html | Schemas, indexes and model validation serve different purposes; unique indexes are enforced by MongoDB. |
| 3 | https://jestjs.io/docs/ecmascript-modules | Native ESM tests require the documented VM-modules invocation in this Jest setup; transforms are disabled for authored .mjs code. |
| 4, 7 | https://tanstack.com/query/latest/docs/framework/react/guides/ssr | Server prefetch/dehydration and browser hydration require request-isolated query clients; query keys identify cached data. |
| 5 | https://docs.docker.com/build/building/best-practices/ | Small contexts, controlled base versions and build/test checks support reproducible images; build layers are not secret storage. |
| 6 | https://github.com/panva/jose/blob/main/docs/jwt/sign/classes/SignJWT.md | SignJWT supports explicit protected headers, issuer, audience, issued-at and expiration claims. Verification must constrain the accepted algorithm. |
| 7 | https://react.dev/reference/react-dom/server/renderToPipeableStream | React can stream HTML from a Node server; hydration attaches browser behavior to matching server markup. |
| 8 | https://developers.google.com/search/docs/fundamentals/seo-starter-guide | Meaningful page content and crawlable links help discovery; SEO changes do not guarantee indexing, ranking or traffic. |
| 9 | https://playwright.dev/docs/test-fixtures | Playwright fixtures provide isolated, reusable test setup and teardown. Semantic locators and outcome assertions avoid timing assumptions. |
| 10 | https://www.mongodb.com/docs/manual/core/aggregation-pipeline/ | Pipeline stages transform documents; grouping and sorting are explicit operations, not implicit chart behavior. |
| 10 | https://nearform.com/open-source/victory/docs/introduction/ | Victory charts compose React components; the course also renders a semantic table for the same numbers. |
| 11–15 backend support | https://graphql.org/learn/security/ | Query demand and authorization need application-level limits; schema validation does not provide record authorization. |
| 13–15 backend support | https://socket.io/docs/v4/delivery-guarantees/ | Socket.IO delivery alone does not supply durable exactly-once processing; application IDs, acknowledgements and replay storage are needed. |

Runtime dependencies are declared in api/package.json for integration pinning.
Do not describe live MongoDB/Docker/cloud behavior as verified until the relevant
commands actually pass. Memory-adapter tests are the default reproducible path.
