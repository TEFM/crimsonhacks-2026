# Beehive Brief: Utah Bill Tracker & Translator

**Tagline:** What Utah is deciding—and what it means for you.

## Product concept

Beehive Brief combines a Utah bill tracker with a plain-language bill translator. A user should be able to move from *“This bill is being discussed tomorrow”* to *“Here is how it could affect me”* in one click.

The product is intentionally a single experience rather than two separate tools: every tracked bill has a translator and impact view.

## Four-hour MVP

Build one dashboard with four panels.

### 1. Bills to watch

- Search and filter by topics such as housing, water, education, transportation, and public safety.
- Show bill number, official title, sponsor, current status, latest action, and next event.
- Include a short, plain-English summary.

### 2. What’s happening next

- Show upcoming committee meetings and floor-calendar items.
- List bills scheduled for each agenda.
- Highlight bills being discussed today or next.
- Link back to the official agenda/source.

### 3. Bill detail and translator

- Plain-English explanation.
- Current law → proposed change.
- Who is affected and when the change would begin.
- Personalized view using personas: renter/homeowner, parent/student, small-business owner, driver/commuter, and taxpayer.
- Voting and action timeline.

### 4. Impact snapshot

- Fiscal-note cost card: state cost, local cost, and official source link.
- A clearly labeled, assumption-based future-impact estimate.
- A related prior bill and its observed implementation/effect.

## Recommended demo scope

Do **not** attempt every Utah bill. Seed 6–10 selected bills and make three of them exceptionally polished “hero bills.”

Each hero bill should include:

- Official title, sponsor, status, and source URL.
- Three-to-five sentence source-backed summary.
- Committee meeting or floor-calendar item.
- Voting timeline and vote totals.
- Fiscal impact card.
- Personalized impact explanation.
- One transparent scenario calculation.
- One related historical bill/effect card.

Use cached demo fixtures first. Add a live data pull only if the core experience is already working. Utah’s official Legislature developer tools provide JSON data for bills, committees, meeting calendars/agendas, reading calendars, and legislators: <https://le.utah.gov/data/developer.htm>.

## Primary user flow

```text
Landing dashboard
  → Select “Housing bills this week”
  → Open a bill
  → Read the plain-language explanation
  → Choose “I’m a renter”
  → View personal impact and fiscal estimate
  → Review vote history and next discussion
  → Open the official legislative source
```

## Demo moment

> “I’m a renter in Salt Lake County. This bill changes ___. It may affect me by ___. It is scheduled for discussion at ___. It passed committee 7–4 and has an estimated state cost of ___.”

## Build priorities

| Feature | Build now | Keep it small |
| --- | --- | --- |
| Bill tracker | Yes | 6–10 seeded bills or a single official feed |
| Voting history | Yes | Timeline and chamber vote totals; individual votes optional |
| Meetings/agendas | Yes | Next 3–5 relevant meetings |
| Bill translator | Yes | Structured AI output verified against source text |
| Personal impact | Yes | Five persona buttons |
| Cost tracker | Yes | Fiscal-note values and source links |
| Future simulator | Yes | One-variable, assumption-based calculator |
| Prior bill effects | Yes | One related-bill card per hero bill |
| Accounts, alerts, maps | No | Put these on the roadmap |

## Technical approach

- **Frontend:** Use **React + Vite** for the single-page interface.
- **Runtime/tooling:** Use **Node.js + npm** for local development, builds, and backend functions.
- **Styling:** Use Tailwind CSS only if the team already knows it; otherwise use a simple component/CSS approach to protect build time.
- **Data:** Start with local JSON fixtures; optionally connect to Utah Legislature JSON feeds.
- **AI translation:** Ask for structured fields: `plain_summary`, `current_vs_proposed`, `affected_groups`, `personalized_impact`, `uncertainties`, and `source_citations`.
- **Trust:** Keep an official source link beside every generated explanation.
- **Disclosure:** Label outputs: “AI-assisted explanation, not legal or financial advice. Verify against official bill text.”

### React and Node.js implementation choice

React + Vite is the preferred frontend because it is quick to build, easy to demo as a dashboard, and deploys cleanly as a static single-page app. Node.js powers the Vite build process and should also be used for any protected server-side work.

Start with a frontend-only app using seeded bill fixtures. Add a Node.js serverless function/API only for AI translation, private API tokens, or live-data transformation. Do not build a separate always-running Express server during the hackathon unless the team already has it working.

### AWS Amplify deployment requirement

The app must be deployable as a public website through **AWS Amplify Hosting**. Keep the initial architecture simple and deployment-safe:

- Use a Git-connected Amplify app for continuous deployment from the project repository.
- Include a production build command and output directory in the repository (`npm run build`; for React + Vite, publish `dist`).
- Keep Utah bill fixtures in the frontend repository so the demo works without a backend or live-data dependency.
- Put any AI calls, private API tokens, or future live-data transformations behind a Node.js Amplify serverless function/API route; never expose secrets in browser code.
- Store secrets only as Amplify environment variables, never in committed `.env` files.
- Configure a catch-all rewrite to `index.html` if using a single-page Vite/React app, so direct links to individual bill pages work after deployment.
- Add a `README.md` section with the repository connection, environment variables, build settings, and Amplify deployment steps.

**Deployment acceptance check:** a fresh clone can build successfully, Amplify can publish it without local-only dependencies, and a shared URL loads the dashboard plus a direct bill-detail URL.

### Simulator framing

Do not claim to predict outcomes. Frame it as an illustrative estimate with visible assumptions.

```text
Estimated annual household impact
= annual program cost ÷ estimated affected households
```

## Four-hour delivery schedule

| Time | Outcome |
| --- | --- |
| 0:00–0:20 | Pick three hero bills, assign roles, define fixture schema |
| 0:20–1:15 | Build dashboard shell and bill-detail page |
| 1:15–2:00 | Add bill status, voting timeline, and meeting cards |
| 2:00–2:45 | Add translator/persona cards and cost simulator |
| 2:45–3:20 | Add previous-bill comparison and source links |
| 3:20–3:45 | Polish fixtures, responsive layout, and error states |
| 3:45–4:00 | Rehearse the 90-second demo; capture backup screenshots/video |

## Suggested team split (four people)

- **Interface:** Dashboard, bill pages, and visual polish.
- **Data:** Utah bill, vote, meeting, and agenda fixtures/API integration.
- **Translator:** Structured prompts, persona impacts, historical comparisons.
- **Integration/demo:** Simulator, QA, source verification, and presentation narrative.

## Pitch

Utahns can locate bill text, but often cannot quickly answer: **Is this being discussed soon, how did my representatives vote, and what does it mean for my life?**

Beehive Brief turns official legislative information into a transparent, source-linked civic briefing—from committee agenda to personal impact.

## Post-hackathon roadmap

- Address-based legislator lookup.
- Watchlists and bill-change alerts.
- Topic notifications.
- Community testimony summaries.
- Longitudinal dashboards showing whether enacted bills achieved their stated goals.
