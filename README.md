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

## Amplify Hosting

`amplify.yml` builds the Vite app with `npm ci` and publishes `dist`. Keep any future API or AI credentials in Amplify environment variables, never in the client or a committed `.env` file.
