# Building an Event-Based Backend Using Express and Socket.IO

## Objectives

- Authenticate Socket.IO connections
- Derive room identity on the server
- Acknowledge only committed idempotent work

## Prerequisites

Complete the HTTP and identity chapters. Start the Field Notes API and know how a bearer token is verified. The relevant files are `api/src/realtime.mjs`, its server entry point, and the note/event service. MongoDB persistence is explored in chapter 15; a local memory run is sufficient to learn connection behavior first.

## Effort

Allow 90–120 minutes, including two browser windows and a deliberate disconnection.

## Concept

HTTP request/response works well when a client initiates each exchange. A live notebook also needs the server to notify another connected tab that an observation was recorded. Socket.IO adds bidirectional events, reconnection behavior, and rooms over its transport protocol. A raw WebSocket client does not automatically speak that protocol.

A command asks the application to do something: `note:create` carries a client-generated request identity and a draft. An event records something the application accepted: `note:created` carries a stable event identity and the resulting note. The server validates the command, derives the author from verified authentication, persists accepted work, and then emits the event. Broadcasting an unvalidated draft first would turn the browser into a source of false authority.

Rooms are delivery groups. Field Notes joins an authenticated socket to its verified author's room. The client cannot gain access by putting another user's ID in the payload. REST note reads in this educational notebook are public, while live delivery is author-scoped; the distinction is intentional and should be stated when designing real product privacy.

Socket.IO preserves ordering for events that arrive, but its default delivery guarantee is at most once. A dropped connection can lose a notification. An acknowledgment confirms one handler response; if that response is lost, the client cannot tell whether storage succeeded. Durable events and idempotent commands address different parts of that uncertainty.

## Step-by-step tutorial

1. Inspect how the API creates an HTTP server and passes that same instance to `attachRealtime(server, app)`. Express handles HTTP routes while Socket.IO handles its connection path. Starting an unrelated second listener is not required.

2. Find the connection middleware. It reads `socket.handshake.auth.token`, verifies it, and stores trusted identity in server-side socket data. Connection rejection should use a generic authentication error and never include the token in logs.

3. Follow the room join. Record how the room name is derived. A room selector in a client command would require a separate membership check; Field Notes avoids arbitrary room selection in the supplied scope.

4. Read the command contract:

   ```js
   {
     clientId: 'a-stable-request-id',
     title: 'Observe delivery',
     body: 'Accepted work becomes an event after persistence.'
   }
   ```

   `clientId` is an idempotency key for this author's command. An event has its own `eventId` and ordered `sequence`. Do not use a socket connection ID as a durable author or request identity: it can change on reconnect.

5. Start the API and web package in separate terminals:

   ```sh
   npm run dev --workspace=@field-notes/api
   npm run dev --workspace=@field-notes/web
   ```

   Open the SPA, sign in with synthetic credentials, and select **Live**. A successful handshake changes the status to Connected. Sign in to the same account in a second window. Saving in the first should deliver an accepted observation to the second.

6. Inspect acknowledgment behavior. The server calls the supplied callback with either `{ok:true,event}` or `{ok:false,error}`. The client uses a timeout. A timeout is an unknown outcome, so it should preserve the draft and ask for synchronization before retry. A rejection is a known failure, so it should show the error without pretending to save.

7. Sign in to a different synthetic account in another window. Its live event history must not contain the first author's events. Log out of the first account and confirm its socket disconnects. Reconnect using a newly authenticated session rather than reusing a stale socket indefinitely.

8. Run the API tests. Find the case that sends the same author and `clientId` twice. It should not create duplicate notes. A repeated key with different contents needs a documented policy, usually returning the original accepted result or rejecting the conflict rather than creating a second write.

The learning project limits event history and payload size. It is not a complete production collaboration service: distributed room adapters, load balancing, connection rate limits, operational dashboards, and long-term retention need a separate design. Adding more server instances without shared state does not magically preserve local room knowledge.

## Runnable checkpoint

`npm test --workspace=@field-notes/api` exercises real service boundaries. The two-window Live flow exercises actual Socket.IO traffic. The platform event activity remains a deterministic simulation and cannot prove a network delivery guarantee.

## Exercise

Write an event contract table covering `note:create`, `note:created`, `notes:sync`, and `notes:history`. Include direction, required fields, authentication, persistence effect, and retry behavior. Add or extend a test asserting that the same command key submitted twice creates one stored note. Never use real learner messages in fixtures.

## Hints

<details><summary>Hint 1: Begin at the trust boundary</summary>

Find where handshake authentication becomes trusted socket data. The note service must receive that trusted ID instead of a payload author field.

</details>

<details><summary>Hint 2: Count storage, not notifications</summary>

A duplicated notification may be merged by the UI even when two records were stored. Your idempotency assertion must inspect durable records or a service result.

</details>

<details><summary>Hint 3: Recover methodically</summary>

If Connected never appears, inspect authentication, then the Vite WebSocket proxy, then API health. Do not disable authentication or allow every origin to hide a connection error.

</details>

## Validation

Confirm authorized connection, rejected missing token, author-scoped delivery, duplicate-command handling, and clean logout. Run focused tests before the whole API suite. Restore the original handler after any deliberate fault injection.

## Common mistakes

Creating a separate Express listener leaves the attached socket server unreachable. Using `io.emit` for private events broadcasts beyond the intended audience. Treating a reconnect as proof that missed events arrived loses history. Storing tokens in room names or logs exposes credentials.

## Accessibility

Provide textual connection state. Avoid constantly flashing indicators or announcing every transport heartbeat. A save failure must be available as text near the form, and accepted notes should not steal keyboard focus.

## Reflection

How can a command succeed when its client receives a timeout? Which guarantees come from Socket.IO, and which require your application database?

## References

- [Socket.IO delivery guarantees](https://socket.io/docs/v4/delivery-guarantees/) and [server delivery tutorial](https://socket.io/docs/v4/tutorial/step-7) — Socket.IO, checked 2026-10-16.
- Daniel Bugl, *Modern Full-Stack React Projects*, supplied reference, chapter 13; this adaptation uses an original author-scoped technical notebook.

Course version 0.3.0 · original public review edition.
