# Security

This is a local development application. There is no deployed service, identity
provider, learner database, or configured security-reporting address. Admin is a
public-content draft preview and has no privileged server mutations; it defaults
to 404 in production. Do not treat `ADMIN_PREVIEW` as an authorization system.

## Reporting

Do not place credentials, exploit payloads containing private data, or personal
records in public issues. Ask the repository owner to establish a private reporting
channel before sharing sensitive evidence. Private vulnerability reporting and
an owner contact must be configured before public launch.

## Development baseline

- Keep credentials outside the repository. No integration currently needs a key.
- Ignore `.env` files, private keys, local PDFs, and generated data. Ignore rules
  are not a substitute for reviewing an eventual Git staging area.
- Use synthetic fixtures. Do not log source submissions or learner data by default.
- Treat code, Markdown, SVG, uploads, URLs, and external responses as untrusted.
- The first checkpoint parses a bounded text-only JSX grammar; it never executes
  learner code. Its source is sent to the same-origin server for validation, without
  persistence or source logging. General code execution requires a separate reviewed
  isolation model, resource limits, and network policy.
- Saved progress is explicit, version-scoped, device-only metadata with restore and
  clear controls. Browser progress is not proof of verified skill or leaderboard input.
- Remote Markdown HTML is dropped; only exact text-summary disclosure syntax is
  converted to trusted details/summary nodes. External images are not fetched.
- GitHub reads require the selected repository, allowlisted paths, a full reviewed
  commit SHA, bounded bodies, and no redirects. Runtime carries no GitHub write token.
- Define storage, retention, export, deletion, consent, and authorization before
  collecting learner data or implementing authentication/social features.

Dependency and secret scanning, authorization tests, sandbox abuse tests, and
incident handling remain launch gates. The baseline checker does not claim to
provide those protections. External security/account changes require approval.
