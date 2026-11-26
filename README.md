# QaBox Website

React + TypeScript + Vite website for QaBox. Product messaging follows the connected workflow in the QaBox architecture: browser capture and exploration, Application Knowledge import, test management, MCP-enabled agent workflows, automation reporting, and AI Bug Analysis.

## Product workflow

1. Use the browser Extension for Single Page Scan, Manual Record, bounded same-application Auto Crawl, or AI Auto Scan.
2. In AI Auto Scan, the agent reasons through MCP, Desktop Bridge handles browser-task handoff, and the Extension performs browser actions.
3. The Extension packages captured page and Application Knowledge data and sends the bundle to Desktop Bridge.
4. Desktop stages the bundle. The user selects the destination Project and Scan folder; files are uploaded and the manifest finalizes the import.
5. Use the separate Android USB scanning workflow for mobile application context.
6. Manage Test Cases, Test Plans, and Test Runs in the project.
7. Connect compatible AI coding clients through the local QaBox MCP server. The agent can use supported project, scan, Application Knowledge, and QA resources to help generate automation.
8. Execute scripts with the configured test runner. Reporter integrations return results and supported evidence to QaBox.
9. Use AI Bug Analysis to investigate failed results, logs, stack traces, broken scenarios, and screenshots/evidence. Review the suggested bug, root cause, problematic flow, potential fix, reproduction steps, expected/actual results, severity suggestion, and technical analysis. Share the reviewed report with the developer; QA reruns automation after the fix is deployed.

## Important boundaries

- MCP exposes agent-facing QA tools; it is not itself the browser automation engine.
- During AI Auto Scan, the Extension performs browser actions and Desktop Bridge handles task handoff.
- Browser exploration is bounded by the selected application scope and safety limits.
- QaBox authentication and target-application authentication are separate.
- PRD/source-document integration is planned.
- Assisted locator healing is experimental and requires QA review.
- Do not imply reporter packages are publicly installable unless their release status has been verified.

## Pages

- / — Product overview and workflow.
- /pricing — Contact page for current access and commercial information.
- /docs — Documentation for capture modes, Desktop Bridge, Application Knowledge import, Android USB scanning, test management, MCP, automation, Reporter, and AI Bug Analysis.
- /sign-in and /sign-up — Account forms using the existing auth API endpoints.
- /dashboard — Signed-in welcome page and desktop deep-link handoff.

## Development

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Vite writes the production site to dist/.

## Backend configuration

Set VITE_API_BASE_URL to the actual QaBox API origin when the API is hosted separately. If left empty, authentication requests use the same origin as the website. Confirm the production API origin before publishing.

## Desktop downloads

Installer links are not published on the website yet. The website directs visitors to contact the QaBox team for current access rather than showing unverified download URLs.

## Notes

- Authentication retains the existing qabox_token and qabox_user localStorage keys.
- Successful sign-in/register offers the qabox://open?token=... desktop-app deep link.
- Do not publish unsupported integration, framework, pricing, or roadmap claims as current product features.
- Do not place private API secrets in Vite environment variables; values prefixed with VITE_ are public in the browser bundle.
