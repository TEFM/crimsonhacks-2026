# Beehive Brief

Beehive Brief is a fixture-first civic-information prototype for following Utah legislation. Its sample records are deliberately labeled as cached demo fixtures: they are not official legislative records and do not substitute for bill text, votes, agendas, or fiscal notes.

## Local development

```bash
npm install
npm run dev
```

The dashboard is at `/`.

## Bill read API

`api/bills.js` exports an AWS Lambda-compatible, read-only handler. It uses the validated fixture repository and provides:

- `GET /api/bills?topic=Housing&query=home`
- `GET /api/bills/HB%20218`

It intentionally contains no credentials and does not make browser-side calls to protected services. Replace the fixture repository with a server-side Utah Legislature adapter only after validating the official response and preserving each official source URL with the field it supports.

### Utah Legislature live data

The endpoint is ready to use the official Utah Legislature developer service when the server runtime has `UTAH_LEGISLATURE_DEVELOPER_TOKEN`; optionally set `UTAH_LEGISLATURE_SESSION` (defaults to `2026GS`). These environment variables belong in AWS Amplify environment variables and must never be placed in frontend code or committed files. When configured, the API reads the official bill list or bill detail endpoint and caches the bill list for one hour. If the official service is unavailable, the API clearly reports that it served cached demo fixtures instead.

### Live API contract check

`npm test` always exercises the fixture, malformed-response, status-code, and caching contracts. It also contains an opt-in check against the official Utah bill feed; it is skipped unless a token is present, so a secret is never required in source control or ordinary CI.

In PowerShell, run the live check in a single terminal session:

```powershell
$env:UTAH_LEGISLATURE_DEVELOPER_TOKEN = "your-token"
$env:UTAH_LEGISLATURE_SESSION = "2026GS"
npm test
```

The live test validates that returned records are normalized bill IDs and nonempty titles and are labeled as official API data. It does not print the token.

## Amplify Hosting

This repository includes an Amplify Gen 2 HTTP API configuration. The Amplify build deploys a `bills-api` Lambda and public GET-only API Gateway routes at `/api/bills` and `/api/bills/{id}`, then builds the Vite app into `dist`.

### One-time Amplify configuration

1. In Amplify Console, set `UTAH_LEGISLATURE_DEVELOPER_TOKEN` in **Hosting > Secrets**, not Environment variables. It is injected into the Lambda only at runtime.
2. Optionally set the non-secret `UTAH_LEGISLATURE_SESSION` environment variable to `2026GS` (the default).
3. Deploy the branch. The backend deployment output includes `custom.billsApi.endpoint`.
4. Add a non-secret branch environment variable named `VITE_BILLS_API_URL` with that endpoint value, then redeploy. This public API Gateway URL is the only API configuration sent to the browser; the Utah token stays in Lambda.

When `VITE_BILLS_API_URL` is missing or the API fails, the dashboard safely uses visibly labeled demo fixtures. Do not add a `VITE_` prefix to the Utah developer token.
