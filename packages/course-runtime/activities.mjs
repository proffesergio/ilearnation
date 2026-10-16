import { STARTER, HINTS } from './index.mjs';

// Learner-facing metadata only. Validation and worked answers live on the server.
const definitions = [
  [
    'javascript-typescript',
    'Transform a study queue',
    'A synthetic study queue contains 5-, 15-, and 20-minute sessions plus an invalid record. Keep sessions of at least 15 minutes and return trimmed titles without mutating the source. Choose operation "map" or "filter-map" and set the normalization policy.',
    { operation: 'map', minimumMinutes: 0, trimTitles: false },
    [
      'Filter before mapping; a short session should disappear.',
      'Keep sessions of at least 15 minutes and trim their titles.',
    ],
  ],
  [
    'react-components',
    'Repair a state transition',
    'A practice counter starts at 2. One increment must produce 3 without changing its input object. Decrement at 0 and increment at 5 must stay at the boundary; reset returns 0. Choose update "mutate" or "immutable" and appropriate step/bounds.',
    { step: 2, minimum: -1, maximum: 10, update: 'mutate' },
    [
      'A transition returns a new state rather than changing its input.',
      'Clamp the count between 0 and 5, and reset to 0.',
    ],
  ],
  [
    'node-and-data',
    'Scope a document repository',
    'Query a synthetic notebook collection for the current owner: return only the two latest records, with their IDs and titles. The stored actor field is ownerId. Choose sort "oldest" or "newest" and a projection that cannot reveal the secret field.',
    { ownerField: 'id', limit: 10, sort: 'oldest', projection: ['id', 'title', 'secret'] },
    [
      'Filter by ownership before sorting and limiting.',
      'Project only id and title; newest records come first.',
    ],
  ],
  [
    'api-contracts',
    'Implement an HTTP contract',
    'Repair a note-creation HTTP contract. POST creates one normalized title with status 201. Blank or over-120-character titles return 400 without writing; other methods cannot create. Requests test all of those behaviors.',
    { method: 'GET', maxTitleLength: 1000, trim: false, createdStatus: 200, invalidStatus: 200 },
    [
      'A successful creation and invalid input need different status codes.',
      'Normalize a valid title but reject blank and 121-character values before writing.',
    ],
  ],
  [
    'async-data',
    'Handle a request race',
    'A newer notes request resolves before an older one. Preserve the current result, keep the last good rows if refresh fails, partition query keys by owner, and retry at most once. Choices: staleResponse "replace"/"ignore", failure "clear"/"preserve"; the owner placeholder in queryKey is "ownerId".',
    { queryKey: ['notes'], staleResponse: 'replace', failure: 'clear', retries: 10 },
    [
      'An owner is part of cache identity.',
      'Compare request identity before accepting a late result. Bound retries and preserve good data on refresh failure.',
    ],
  ],
  [
    'data-and-forms',
    'Validate before saving',
    'Save a trimmed title of 1–120 characters for the verified actor. Forged input ownership must not be trusted. Blank/oversized input never writes, and a failed write keeps the draft. Choices: ownerSource "input"/"session", onFailure "clear"/"preserve".',
    { ownerSource: 'input', maxTitleLength: 1000, trim: false, onFailure: 'clear' },
    [
      'A hidden owner field is still untrusted input.',
      'Keep the draft until storage confirms success.',
    ],
  ],
  [
    'identity-and-access',
    'Authorize each request',
    'Allow a valid owner session to read its note, while denying body-forged identity, expired sessions, and another owner. Session material must be inaccessible to page JavaScript. Choices: identitySource "body"/"session", cookieMode "javascript"/"httpOnly".',
    { identitySource: 'body', requireOwner: false, rejectExpired: false, cookieMode: 'javascript' },
    [
      'Authentication alone does not grant access to every record.',
      'Check session expiry and record ownership on the server; keep the session cookie out of JavaScript.',
    ],
  ],
  [
    'rendering-and-seo',
    'Choose a rendering policy',
    'The public initial document must already contain the heading Learning notebook. Private routes must stay out of indexing, and the canonical URL must use the fixed trusted origin https://learn.example despite a hostile request host. Choices: publicRendering "client"/"server", privateRobots "index"/"noindex".',
    {
      publicRendering: 'client',
      privateRobots: 'index',
      title: '',
      canonicalOrigin: 'http://request-host.example',
    },
    [
      'A useful public title and heading should be present in initial HTML.',
      'Use a fixed trusted canonical origin and exclude private pages from indexing; authorization still protects them.',
    ],
  ],
  [
    'quality-accessibility-security',
    'Test the learner journey',
    'A regression test must catch both a missing saved record and a rejected record that was accidentally written. Locate a textbox by its accessible role and name Note title. Permit HTTPS references but deny active and embedded data URLs. Locator choices: "css-index"/"role".',
    {
      locator: 'css-index',
      assertSaved: false,
      assertRejected: false,
      urlSchemes: ['https:', 'javascript:'],
      inputLabel: '',
    },
    [
      'Assert a visible saved record and the absence of a rejected record.',
      'A label gives a stable accessible name; allow only the expected URL scheme.',
    ],
  ],
  [
    'learning-insights',
    'Aggregate consented practice',
    'Publish daily event totals only for groups of at least three distinct consented learners. Duplicate delivery must count once and withdrawn consent must be excluded. The fixture has a valid Monday group and an under-threshold Tuesday group. groupBy choices: "learner"/"day".',
    { consentOnly: false, deduplicate: false, groupBy: 'learner', minimumGroup: 1 },
    [
      'Deduplicate event IDs before counting distinct learners.',
      'Consent and group thresholds apply before publishing aggregates.',
    ],
  ],
  [
    'graphql-api',
    'Resolve a small query safely',
    'Resolve a current-owner notes query exposing its ID and title, while denying the secret field, forged ownership, and nesting deeper than two levels. Choices: ownerSource "argument"/"session", unknownField "ignore"/"reject". This is a query-contract simulation, not a GraphQL parser.',
    {
      fields: ['id', 'title', 'secret'],
      maxDepth: 20,
      ownerSource: 'argument',
      unknownField: 'ignore',
    },
    [
      'A schema is an allowlist, not permission to reveal every stored field.',
      'Authenticate resolvers, bound query depth, and reject unknown fields.',
    ],
  ],
  [
    'graphql-client',
    'Reconcile a mutation',
    'An edited Note is confirmed twice; the cache must keep one updated record using type plus stable ID identity. A later optimistic creation fails: remove only that pending item and show an error. Choices: mutationPolicy "append"/"upsert", errorPolicy "hide"/"show".',
    { keyFields: ['title'], mutationPolicy: 'append', rollbackOnError: false, errorPolicy: 'hide' },
    [
      'Identity needs a type and stable ID, not editable text.',
      'Merge confirmations by identity; roll back only the failed optimistic change.',
    ],
  ],
  [
    'realtime-server',
    'Validate a live event',
    'Accept a room message of at most 280 characters only for a verified member. Payload identity is untrusted. A successful acknowledgement must mean storage committed; failure cannot be acknowledged as saved. Choices: actorSource "payload"/"session", roomPolicy "any"/"member", acknowledge "before-persist"/"after-persist".',
    {
      actorSource: 'payload',
      roomPolicy: 'any',
      maxMessageLength: 10000,
      acknowledge: 'before-persist',
    },
    [
      'A socket connection does not authorize every room.',
      'An acknowledgement should describe a committed write, not a hoped-for write.',
    ],
  ],
  [
    'realtime-client',
    'Reconnect without duplicate messages',
    'Five sends occur offline. Queue the first three and report full capacity for the others. Reconnect retries must preserve identity so repeated confirmations yield exactly three visible messages. Choices: offline "drop"/"queue", retry "new-id"/"same-id".',
    { offline: 'drop', maxQueue: 100, deduplicate: false, retry: 'new-id' },
    [
      'Bound the offline queue and show when it is full.',
      'Retry the same client ID and deduplicate server confirmations.',
    ],
  ],
  [
    'realtime-persistence',
    'Replay a durable event log',
    'A retry must write once per owner/client-ID pair, without conflating different owners. Replay this owner\'s retained events strictly after cursor 2, using a 30-day retention window and chronological sequence order. order choices: "descending"/"ascending".',
    { uniqueBy: ['clientId'], afterSequence: 0, retentionDays: 3650, order: 'descending' },
    [
      'Scope idempotency to the owner and client ID.',
      'Apply ownership, retention, and cursor filters before ordering the replay.',
    ],
  ],
  [
    'nextjs-routing',
    'Place the component boundary',
    'Keep database access out of the browser and place stateful click handling in the interactive component. Serialize the note ID and title without its database URL. An absent note needs a not-found response. Component choices: "server"/"client"; missingRoute: "empty-success"/"not-found".',
    {
      dataComponent: 'client',
      interactiveComponent: 'server',
      publicProps: ['id', 'title', 'databaseUrl'],
      missingRoute: 'empty-success',
    },
    [
      'Keep database access in the server component.',
      'Send the interactive client only the public fields it needs, and handle missing routes explicitly.',
    ],
  ],
  [
    'caching-performance',
    'Invalidate a scoped cache',
    'Two owners may have the same note ID. Isolate their private cache entries, prevent shared HTTP caching, and make a confirmed write visible on the next read. Enforce the exercise\'s 150 KB optional-asset budget. Key placeholders: "ownerId", "noteId"; privatePolicy: "public"/"no-store".',
    {
      cacheKey: ['noteId'],
      privatePolicy: 'public',
      invalidateOnWrite: false,
      assetBudgetKb: 1000,
    },
    [
      'Owner identity belongs in a private cache key.',
      'After a write remove stale entries; keep private responses out of shared HTTP caches.',
    ],
  ],
  [
    'production-workflows',
    'Gate a release',
    'A release needs lint, type checking, tests, and a production build; any failed check blocks it. Green checks still need explicit approval. Keep secrets out of public bundles and recover a failed health check using the previously tested artifact. Choices: approval "automatic"/"required", secretScope "public"/"server", rollback "rebuild-latest"/"previous-artifact".',
    { checks: ['build'], approval: 'automatic', secretScope: 'public', rollback: 'rebuild-latest' },
    [
      'A reproducible artifact is useful for recovery.',
      'A green build alone does not replace tests or release approval.',
    ],
  ],
  [
    'capstone',
    'Integrate a private notebook',
    "Integrate the notebook lifecycle: trusted session ownership, server-side validation, confirmation only after commit, owner-scoped deletion, and a machine-readable JSON export. Deny another account's reads/deletes and never report invalid or failed writes as successful. Choose the policy values that make those cases hold.",
    {
      ownerSource: 'input',
      validation: 'client',
      saveOrder: 'confirm-then-commit',
      deleteScope: 'all',
      exportFormat: 'html',
    },
    [
      'Follow one record through creation, storage, read, export, and deletion.',
      'Trust the session, validate on the server, and confirm only committed work.',
    ],
  ],
];

const activities = new Map([
  [
    'first-component',
    {
      id: 'first-component',
      title: 'Your first component',
      prompt:
        'Change Welcome so its text-only h1 contains a sentence of at least 12 characters including “building”.',
      inputType: 'jsx',
      starter: STARTER,
      hints: HINTS,
      inputLabel: 'Component source',
    },
  ],
  ...definitions.map(([id, title, prompt, starter, hints]) => [
    id,
    {
      id,
      title,
      prompt,
      inputType: 'json',
      starter: JSON.stringify(starter, null, 2),
      hints,
      inputLabel: 'Lab configuration JSON',
    },
  ]),
]);

export function getActivity(exerciseId) {
  const activity = activities.get(exerciseId);
  return activity ? structuredClone(activity) : null;
}

export function listActivities() {
  return [...activities.values()].map((activity) => structuredClone(activity));
}
