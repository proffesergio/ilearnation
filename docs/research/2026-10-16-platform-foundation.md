# Platform foundation sources — 2026-10-16

Retrieved read-only. No credentials or learner data were sent. Course-specific
sources, authors, rights/status, and chapter mapping are in the course references.
These are links to documentation; no source prose or source code is redistributed.

| Source / publisher | Relevant fact | Status |
| --- | --- | --- |
| [Installation](https://nextjs.org/docs/app/getting-started/installation), Vercel / Next.js team | App Router setup, scripts, TypeScript and system requirements | Official documentation; linked |
| [Your First Component](https://react.dev/learn/your-first-component), React team | Component and JSX concept for the first exercise | Official documentation; linked |
| [Working with non-code files](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files), GitHub | Supported media; SVG inline scripting and animation limitations | Official documentation; linked |
| [Mapbox GL JS pricing](https://docs.mapbox.com/mapbox-gl-js/guides/pricing/), Mapbox | A Map initialization counts as a map load; runtime usage has cost implications | Official documentation; linked |
| [Mapbox DevKit MCP Server](https://docs.mapbox.com/location-ai/mcp-servers/devkit-mcp-server/), Mapbox | Official hosted endpoint, OAuth, capabilities, and hosted limitations | Official documentation; linked |

Recommendation: keep the course plain Markdown plus schema-validated metadata;
render richer interactions in trusted website components, not remote executable MDX.
Experiment: a text-only JSX grammar provides an observable first edit without
running learner JavaScript. It is not a general React execution environment.

Environment evidence: local cached package metadata and installed package manifests
were inspected for compatible available versions. Next 16.4.1, React 19.3.1, and
TypeScript 5.9.3 were selected from available cache, not asserted to be the latest
registry releases. Direct registry version queries were unavailable during setup. The final
`npm audit --omit=dev` completed with zero reported vulnerabilities; current-version
confirmation remains distinct from an advisory check.

Review evidence: installed Next.js server/client and dynamic-route guides under
`node_modules/next/dist/docs/` were checked after the framework generated
`apps/web/AGENTS.md`. The original root AGENTS.md remains unchanged. Native
GitHub disclosure syntax is converted from a narrow recognized Markdown AST form;
arbitrary raw HTML is dropped. Browser tests exercise a hostile script and unsafe
link in the admin preview rather than relying only on renderer configuration.
