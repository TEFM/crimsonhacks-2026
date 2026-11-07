# Beehive Brief

Beehive Brief is a fixture-first civic-information prototype for following Utah legislation. Its sample records are deliberately labeled as cached demo fixtures: they are not official legislative records and do not substitute for bill text, votes, agendas, or fiscal notes.

## Local development

Use Node.js 24 (tested with 24.14.1). The full-page rendering tests use Node's built-in module hooks to handle Vite SVG imports without adding test dependencies.

```bash
npm install
npm run dev
```

The dashboard is at `/`.

The default frontend is a static deployment: it uses bundled fixtures and never requests a live legislative API. “View all bills” clears the topic and search; “Explore your impact” opens HB 218's persona picker. Bill briefs show fixture-derived effective dates or an unavailable message. The household simulator changes only the hypothetical household count and divides a fixed hypothetical annual cost by that count; its output is not an official fiscal figure, forecast, or household charge. Empty or invalid inputs do not produce an estimate.

## Curating a source snapshot

The bundled records are prototype fixtures, not real-time legislative records. To replace a hero record with a reviewed static snapshot, set `dataOrigin: 'official-snapshot'`, add a `capturedAt` date in `YYYY-MM-DD` form, and retain the official bill URL. Add separate official URLs for a fiscal note, vote, or agenda when a field relies on one; a bill landing page does not establish those separate facts. The UI displays snapshot provenance and continues to label AI-assisted explanations and household simulations as illustrative.

Do not mark a record as an official snapshot until a team member has manually checked the linked source. Keep fields unavailable when they are not verified.

Run `npm run lint`, `npm test`, and `npm run build` before handoff. For a browser smoke test, filter and search the dashboard, clear them with “View all bills,” follow the impact CTA, switch personas, edit and clear the simulator input, and open and refresh `/bills/hb-218`, `/bills/sb-142`, `/bills/hb-301`, and a meeting agenda. Check unknown bill/meeting routes and narrow-screen layout as well. Schedule labels such as “Today” and “Next” describe the prototype schedule, not the current date.

## Bill read API

`api/bills.js` exports an AWS Lambda-compatible, read-only handler. It uses the validated fixture repository and provides:

- `GET /api/bills?topic=Housing&query=home`
- `GET /api/bills/HB%20218`

It intentionally contains no credentials and does not make browser-side calls to protected services. Replace the fixture repository with a server-side Utah Legislature adapter only after validating the official response and preserving each official source URL with the field it supports.

### Utah Legislature live data

The endpoint is ready to use the official Utah Legislature developer service when the server runtime has `UTAH_LEGISLATURE_DEVELOPER_TOKEN`; optionally set `UTAH_LEGISLATURE_SESSION` (defaults to `2026GS`). These environment variables belong in AWS Amplify environment variables and must never be placed in frontend code or committed files. When configured, the API reads the official bill list or bill detail endpoint and caches the bill list for one hour. If the official service is unavailable, the API clearly reports that it served cached demo fixtures instead.

## Amplify Hosting

The checked-in `amplify.yml` deploys the static Vite frontend only. It runs `npm ci`, builds `dist`, and does not provision a Lambda, API Gateway route, developer token, or live-data dependency. This is the supported hackathon deployment path.

Connect the repository and branch in Amplify Hosting and use the checked-in build settings. No environment variables are required. In Hosting → Rewrites and redirects, configure a **200 rewrite** to `/index.html` for SPA paths (including `/bills/<slug>` and `/meetings/<slug>`), preserving static asset requests. Refresh those direct URLs after deployment to verify the hosting rule; Vite's local SPA fallback alone does not verify the deployed Amplify configuration.

### Optional live API restoration

The `amplify/` function and `api/bills.ts` handler remain in the repository for a future backend-enabled branch. Only restore a backend build phase after the official response shape and credentials have been tested.

1. In Amplify Console, set `UTAH_LEGISLATURE_DEVELOPER_TOKEN` in **Hosting > Secrets**, not Environment variables. It is injected into the Lambda only at runtime.
2. Optionally set the non-secret `UTAH_LEGISLATURE_SESSION` environment variable to `2026GS` (the default).
3. Deploy the branch. The backend deployment output includes `custom.billsApi.endpoint`.
4. Add a non-secret branch environment variable named `VITE_BILLS_API_URL` with that endpoint value, then redeploy. This public API Gateway URL is the only API configuration sent to the browser; the Utah token stays in Lambda.

Do not add a `VITE_` prefix to the Utah developer token. Do not add `VITE_BILLS_API_URL` to the static deployment branch.

`amplify.yml` selects Node.js 24, installs locked dependencies with `npm ci`, deploys the backend, then builds the Vite app and publishes `dist`. Keep any future API or AI credentials in Amplify environment variables, never in the client or a committed `.env` file.

The backend uses `amplify/tsconfig.json` with NodeNext module resolution. Shared modules imported by the API must use explicit `.js` extensions in relative imports and re-exports, including type-only imports. The frontend's bundler mode accepts extensionless imports, so `npm run build` alone does not catch this deployment failure. `npm test` includes a regression check that runs `tsc --project amplify/tsconfig.json --noEmit` without deploying AWS resources.

For a backend-enabled branch, restore the prior backend phase that runs `npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID` before the frontend build. Keep the static configuration as the default until that branch has passed its live-data and deployment checks.
