# Course schema version 1

`index.mjs` exports `validateCourse(input)`. It returns either
`{ success: true, data }` or `{ success: false, errors: string[] }` and leaves input
unchanged. `index.d.mts` supplies the matching TypeScript declarations. No runtime
dependency, filesystem access, network request, or learner-code execution is used.

The validator accepts versioned JSON metadata, bounded text and list sizes,
unique kebab-case chapter IDs, exact `chapters/<chapter-id>.md` paths, documented
completion references, and HTTPS reference URLs without credentials. It rejects
unknown fields rather than interpreting them as scripts, imports, or actions.
It validates structure, not truth, source rights, Markdown safety, or learning.
The renderer must still treat authored or imported Markdown as untrusted input.

The eight-chapter draft uses schema 1 and course version `0.1.0`. Material course
updates need an explicit course version change; a breaking schema update needs a
new schema version and migration. Published versions must not be reinterpreted.

From the repository root:

```sh
node --test tests/course-schema.test.mjs tests/course-content.test.mjs
```

The content test imports only trusted source-controlled checkpoint modules from
the authored lessons. It is not an isolation mechanism for learner submissions.
Human curriculum and rights review remains required before publication.
