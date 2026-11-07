# Beehive Brief

Beehive Brief is a fixture-first civic-information prototype for following Utah legislation. Its sample records are deliberately labeled as cached demo fixtures: they are not official legislative records and do not substitute for bill text, votes, agendas, or fiscal notes.

## Local development

Use Node.js 24 (tested with 24.14.1). The full-page rendering tests use Node's built-in module hooks to handle Vite SVG imports without adding test dependencies.

```bash
npm install
npm run dev
```

The dashboard is at `/`.

The frontend uses bundled fixtures without API requests. “View all bills” clears the topic and search; “Explore your impact” opens HB 218's persona picker. Bill briefs show fixture-derived effective dates or an unavailable message. The household simulator changes only the hypothetical household count and divides a fixed hypothetical annual cost by that count; its output is not an official fiscal figure, forecast, or household charge. Empty or invalid inputs do not produce an estimate.

Run `npm run lint`, `npm test`, and `npm run build` before handoff. For a browser smoke test, filter and search the dashboard, clear them with “View all bills,” follow the impact CTA, switch personas, edit and clear the simulator input, and open and refresh `/bills/hb-218`, `/bills/sb-142`, `/bills/hb-301`, and a meeting agenda. Check unknown bill/meeting routes and narrow-screen layout as well. Schedule labels such as “Today” and “Next” describe the prototype schedule, not the current date.

## Bill read API

`api/bills.js` exports an AWS Lambda-compatible, read-only handler. It uses the validated fixture repository and provides:

- `GET /api/bills?topic=Housing&query=home`
- `GET /api/bills/HB%20218`

It intentionally contains no credentials and does not make browser-side calls to protected services. Replace the fixture repository with a server-side Utah Legislature adapter only after validating the official response and preserving each official source URL with the field it supports.

### Utah Legislature live data

The endpoint is ready to use the official Utah Legislature developer service when the server runtime has `UTAH_LEGISLATURE_DEVELOPER_TOKEN`; optionally set `UTAH_LEGISLATURE_SESSION` (defaults to `2026GS`). These environment variables belong in AWS Amplify environment variables and must never be placed in frontend code or committed files. When configured, the API reads the official bill list or bill detail endpoint and caches the bill list for one hour. If the official service is unavailable, the API clearly reports that it served cached demo fixtures instead.

## Amplify Hosting

`amplify.yml` builds the Vite app with `npm ci` and publishes `dist`. Keep any future API or AI credentials in Amplify environment variables, never in the client or a committed `.env` file.

Connect this repository and branch in Amplify Hosting and use the checked-in build settings. No environment variables are required for the fixture-only frontend. In Hosting → Rewrites and redirects, configure a **200 rewrite** to `/index.html` for SPA paths (including `/bills/<slug>` and `/meetings/<slug>`), preserving static asset requests. Refresh those direct URLs after deployment to verify the hosting rule; Vite's local SPA fallback alone does not verify the deployed Amplify configuration.
