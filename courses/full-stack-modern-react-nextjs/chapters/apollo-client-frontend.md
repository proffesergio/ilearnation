# Interfacing with GraphQL on the Frontend Using Apollo Client

## Objectives

- Configure Apollo providers and React hooks
- Handle loading, errors, and empty results
- Refresh a mutation result and clear caches on logout

## Prerequisites

Complete chapter 11 and confirm `/graphql` responds. You should recognize React providers and hooks, and explain the difference between server data and component state. Install dependencies from the Field Notes root, preserving its lockfile. The runnable files are `web/src/main.jsx` and `web/vite.config.js`.

## Effort

Allow 80–110 minutes, including a network trace and a stale-list experiment.

## Concept

Apollo Client coordinates GraphQL requests and a normalized cache. An entity identified by type and ID can be shared across multiple queries. That prevents each screen from needing an unrelated copy of every object. A list still has its own membership and order: receiving a newly created entity does not automatically prove which lists should include it.

Field Notes deliberately refetches the notes query after creation. This costs another request but gives a beginner an inspectable correctness rule: successful mutation, refreshed list, then clear the form. Later, cache updates can reduce that request when the application knows its filtering and ordering rules. Optimistic updates require temporary identity, rollback, and duplicate reconciliation. They are an optional extension, not an invisible promise in the starter.

The REST screen uses TanStack Query; the GraphQL screen uses Apollo. Their caches do not synchronize automatically. Changing data in one screen can leave another screen stale until refetch or invalidation. This is an architecture tradeoff exposed for comparison, not a recommendation to add two caches to every small product.

Current Apollo React hooks and `ApolloProvider` are imported from `@apollo/client/react`; core client classes and `gql` come from `@apollo/client`. The checked package lock is the installation contract. Avoid copying older `apollo-boost` or `react-apollo` setup snippets.

## Step-by-step tutorial

1. Start the API and, in a separate terminal, the web package:

   ```sh
   npm run dev --workspace=@field-notes/api
   npm run dev --workspace=@field-notes/web
   ```

   These are separate long-running processes. Open `http://127.0.0.1:5173/graphql`.

2. Inspect the client construction in `App`:

   ```jsx
   const [apollo] = useState(() => new ApolloClient({
     link: new HttpLink({ uri: '/graphql' }),
     cache: new InMemoryCache(),
   }));
   ```

   The initializer makes one client for this mounted application. Constructing a new client on every render would repeatedly replace cache state. Vite forwards the relative URL to port 4000 during local development. A production SPA host must provide equivalent routing or a deliberately configured API origin.

3. Follow `ApolloProvider` down to `GraphNotes`. Its query is a parsed document:

   ```jsx
   const NOTES = gql`
     query Notes { notes { id title body createdAt } }
   `;
   const result = useGraphQuery(NOTES);
   ```

   The component handles loading before inspecting data and handles errors before rendering the array. An empty array produces a useful empty state. Do not render `result.data.notes` unconditionally while a request is pending.

4. Sign up using synthetic credentials. Submit a short observation. Inspect the browser Network panel for the mutation, its variables, and the subsequent query. Inspect structure without sharing the authorization value. The current mutation hook includes:

   ```jsx
   const [create, { loading, error }] = useMutation(CREATE, {
     refetchQueries: [{ query: NOTES }],
     awaitRefetchQueries: true,
   });
   ```

   Awaiting the refetch keeps the submit sequence understandable. The form resets after confirmation. If the request fails, the draft remains available for correction.

5. The mutation passes `context.headers.Authorization` at call time. Its source is the token held in React state. A browser reload removes that token. Sign in again rather than adding `localStorage` to make the exercise seem more convenient. This demo avoids persistent browser token storage; it is not a complete production session design.

6. Log out. `queryClient.clear()` and `apollo.clearStore()` remove cached responses, while clearing the token disconnects the live screen. Clearing a token alone is insufficient when account-scoped data remains in a cache or component state.

7. Temporarily stop the API and reload `/graphql`. Confirm that a readable failure appears. Restart the API, then reload or retry the screen. If Vite itself is down, the browser cannot render a React error state: that failure happens before the application starts.

## Runnable checkpoint

Run `npm run build --workspace=@field-notes/web`. With both processes running, create a note on the GraphQL page and verify it appears without a manual reload. Then sign out and verify writing is disabled with an explanation. The web project is executable source; the platform's query exercise is only a bounded learning simulation.

## Exercise

Add a `Refetch notes` button using the query result's `refetch` function. Disable it while its request is pending, announce a refresh failure, and keep existing notes visible where practical. Explain why refreshing Apollo does not invalidate the REST screen's TanStack query key. Capture a request-count comparison between initial load and creation plus refetch.

## Hints

<details><summary>Hint 1: Start from the existing result</summary>

`useGraphQuery` returns both data state and a `refetch` function. You do not need a second client or a second query document.

</details>

<details><summary>Hint 2: Prevent an unhandled rejection</summary>

Await `refetch()` inside a handler with `try/catch`. A React event handler does not automatically convert a rejected promise into your visible error message.

</details>

<details><summary>Hint 3: Separate two loading experiences</summary>

First load has no rows. Refresh may already have rows. Preserve the latter and show a small status rather than replacing a useful list with an empty screen.

</details>

## Validation

A successful save produces exactly one new note, rejected saves preserve draft input, and refresh failures remain readable. Run the web build and `npm test --workspace=@field-notes/web`. Restore any deliberately stopped services before moving on.

## Common mistakes

Omitting `id` harms normalized cache identity. Updating a cache entity without adding it to a list leaves the list unchanged. Mutating the returned data array in place bypasses cache APIs. Assuming HTTP 200 means a successful GraphQL mutation ignores the `errors` envelope. Printing entire mutation options can leak bearer tokens.

## Accessibility

Use a real button with an accessible name for refetch. Keep keyboard focus stable after success; announce refreshed state without moving focus to a transient notification. Test form labels, disabled-state explanation, and long titles at a narrow viewport.

## Reflection

When is a full refetch the better maintenance choice? What additional facts would you need to implement a correct optimistic list update? Which data must disappear immediately on logout?

## References

- [Apollo Client setup](https://www.apollographql.com/docs/react/get-started) and [mutations](https://www.apollographql.com/docs/react/data/mutations) — Apollo GraphQL, checked 2026-10-16.
- Daniel Bugl, *Modern Full-Stack React Projects*, supplied reference, chapter 12; original Field Notes code and explanations replace the book example.

- [Current primary documentation](https://www.apollographql.com/docs/react/data/queries) — checked 2026-10-16.

Course version 0.3.0 · original public review edition.
