# Engineering Guide for Beehive Brief

Beehive Brief helps Utahns understand legislation. Favor clarity, source traceability, and reliable behavior over cleverness or unnecessary scope.

## Non-negotiables

- Preserve the React + Vite frontend, Node.js tooling/functions, MVC-style organization, and AWS Amplify deployment compatibility described in `Utah-Bill-Tracker-Hackathon-Plan.md`.
- Keep official bill text, votes, agendas, fiscal notes, and generated explanations visibly distinguishable.
- Never present generated bill analysis, impact estimates, or historical comparisons as legal, financial, or factual certainty. Surface source links, assumptions, uncertainty, and the existing product disclaimer.
- Do not commit secrets, credentials, private API keys, `.env` files, or generated Amplify state. Use Amplify environment variables for deployment secrets.

## Regression testing is required

Every functional change must be checked for regressions before handoff. A feature is not complete merely because its new behavior works.

At a minimum:

1. Run the project’s automated checks (`npm run lint`, `npm test`, and `npm run build`) when those scripts exist.
2. Add or update a focused regression test whenever fixing a bug or changing business logic. The test should fail before the fix and pass afterward.
3. Manually smoke-test the critical user path after UI, routing, or data changes:
   - Dashboard loads with fixture data.
   - A bill can be opened directly by URL and refreshed without a 404.
   - Bill status, votes, meeting information, and source links render safely when optional data is missing.
   - Persona impact and simulator outputs update correctly and retain their disclaimer/assumptions.
   - The production build succeeds.
4. Test error and empty states, not only happy paths: missing fiscal data, no upcoming meetings, API failure, malformed bill data, and unavailable AI translation.
5. For bug fixes, document the regression test or exact manual verification in the PR/hand-off summary.

Do not remove, weaken, skip, or rewrite existing tests merely to make a build pass. If a test must change because the intended behavior changed, explain the behavioral change and update coverage for the new contract.

## Code quality and architecture

- Keep components small and focused. Display-only React components must not own data-fetching, prompt construction, or complex business rules.
- Follow MVC boundaries:
  - **Models:** domain types, fixtures, validation, data-access services.
  - **Views:** React pages and presentational components.
  - **Controllers:** hooks/action handlers/API handlers that coordinate user input, model services, and views.
- Use TypeScript if the project is initialized with it; avoid `any` and validate data crossing network or fixture boundaries.
- Prefer explicit, readable names and small pure functions for status mapping, fiscal calculations, and impact logic.
- Reuse shared types, constants, and UI components instead of duplicating status labels, formatter logic, or source-link behavior.
- Do not introduce a database, authentication, background jobs, or an always-running server unless the task explicitly requires it.

## Data, AI, and safety

- Treat external API responses and AI output as untrusted input. Validate and safely render them.
- Do not use `dangerouslySetInnerHTML` for bill text or generated summaries.
- Keep source URLs with the data they support; do not invent citations, vote records, fiscal values, or historical effects.
- Label scenario outputs as estimates and display the calculation inputs.
- Send AI/API requests through Node.js serverless handlers whenever secrets or privileged calls are involved; never embed private keys in browser code.
- Cache and use fixtures where possible so a demo remains usable during API outages.

## Deployment discipline

- Keep `npm run build` passing for an AWS Amplify deployment.
- Preserve SPA routing configuration so direct bill-detail URLs work in production.
- Make deployment changes reproducible in repository configuration and documented in `README.md`.
- Keep dependencies minimal; do not add a package without a clear product or engineering need.

## Handoff expectations

When completing work, report:

- What changed and why.
- Automated checks run and their results.
- Manual regression checks performed.
- Any known limitations, fixture assumptions, or follow-up work.
