# CarbonIQ

CarbonIQ is a personal carbon footprint awareness platform for PromptWars Virtual - Challenge 3: Carbon Footprint Awareness Platform.

GitHub repository: https://github.com/YellankiKaushik/Carbon-IQ

Live demo: https://carbon-iq-1994a.web.app

## Challenge

Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Problem Statement

People often see climate advice as generic, overwhelming, or disconnected from their own lifestyle. CarbonIQ gives individuals a quick estimated footprint, highlights the category driving the most impact, and turns that result into one practical action they can track.

## Chosen Vertical

Individual lifestyle awareness. CarbonIQ focuses on everyday choices across transport, food, home energy, shopping, and travel. It is not an enterprise ESG, audit, or compliance product.

## Core Idea

Most carbon calculators stop at a score. CarbonIQ turns the result into one clear next action using the One Lever principle: identify the single highest-impact personalized habit change, let the user join it as a challenge, and track estimated CO2 saved over time.

## Key Features

- Expanded landing page with product value proposition, problem framing, workflow, and AI/Firebase notes.
- Consistent app navigation with Home, dashboard tabs, quiz previous controls, and recalculate entry points.
- Clearly labeled demo dashboard with sample-data banner and "Calculate My Real Footprint" CTA.
- Optional display name with safe fallback to "You".
- Seven-question carbon quiz with validation and progress.
- Rule-based estimated annual and monthly footprint calculator.
- Category breakdown for transport, food, home energy, and consumption.
- Monthly carbon budget gauge set to an 80% reduction target.
- Personalized dashboard summary cards, category percentages, community sample snapshot, and challenge progress.
- One Lever insight from Gemini first, OpenRouter second, and deterministic fallback when APIs are unavailable.
- AI provider badge and an expandable explanation of how the insight was generated.
- Challenge tracking with streak, daily duplicate prevention, and total CO2 saved.
- Leaderboard ranked by total CO2 saved, not lowest footprint.
- Shareable Carbon Story card with user name, annual footprint, One Lever action, savings, streak, rank, clean filename, caption copy, app-link copy, and PNG download support.
- localStorage persistence for demo continuity.
- Responsive layouts tuned for phone, tablet, and desktop review flows.

## User Flow

Landing -> Carbon Quiz -> Footprint Dashboard -> One Lever Insight -> Join Challenge -> Check In -> Leaderboard -> Carbon Story Card.

Reviewers can also click "View Demo Dashboard" to skip directly into a realistic preloaded dashboard. Demo mode is explicitly labeled so sample data is not confused with a real user result.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Recharts
- Lucide React
- html-to-image
- Vitest

## Architecture

```txt
src/
  components/
    Navbar.tsx
  pages/
    Landing.tsx
    Quiz.tsx
    Dashboard.tsx
    Challenges.tsx
    Leaderboard.tsx
    StoryCard.tsx
  store/
    useAppStore.ts
  types/
    index.ts
  utils/
    aiInsight.ts
    calculator.ts
    challengeLogic.ts
    leaderboard.ts
    quizData.ts
    storyData.ts
    carboniq.test.ts
```

State is managed with a small Zustand store and persisted to localStorage. Core carbon, challenge, leaderboard, and story-card logic lives in testable utility files.

## One Lever AI Logic

CarbonIQ uses a three-step provider chain:

1. Gemini is the primary AI provider when `VITE_GEMINI_API_KEY` is configured.
2. OpenRouter is the secondary AI provider when `VITE_OPENROUTER_API_KEY` is configured.
3. Static rule-based fallback is used if both providers are missing, fail, time out, or return invalid JSON.

Both AI providers receive the same One Lever prompt. The prompt includes quiz answers and the calculated footprint breakdown, then asks for:

- One highly specific primary recommendation.
- Two secondary tips.
- Estimated savings values clearly framed as awareness estimates.

The response is parsed and validated before use. The One Lever card is visually dominant on the dashboard. Secondary tips are collapsed so the product remains focused on one action.

## Fallback Logic

If Gemini and OpenRouter are missing, unavailable, or return invalid JSON, CarbonIQ uses deterministic fallback logic based on the largest footprint category:

- Transport: replace two car or taxi commutes per week.
- Food: replace two meat-heavy meals per week.
- Energy: reduce high AC/heating usage and switch off idle appliances.
- Consumption: avoid one non-essential purchase per month.

The app remains fully usable without any API keys.

## Carbon Calculation Assumptions

The calculator uses internally consistent demo emission factors in kg CO2/year. Values are approximate and designed for awareness, not audit-grade reporting. The monthly carbon budget is set at 80% of current estimated monthly footprint to create a simple reduction target.

## Data and State Model

Persisted demo data includes:

- User profile and display name.
- Quiz answers.
- Footprint breakdown.
- AI or fallback insight.
- Active challenge.
- Check-ins.
- Streak and total CO2 saved.

No account system or personal data beyond an optional display name is stored.

## Accessibility

- Semantic buttons and headings.
- Keyboard-accessible quiz answer cards.
- Inline validation for missing answers.
- Text summaries alongside charts.
- Clear focus styles from browser/Tailwind defaults.
- Responsive layouts and mobile-friendly tap targets.
- Estimate disclaimers throughout the flow.

## Testing

Vitest covers the core MVP logic:

- Footprint category totals.
- Biggest category detection.
- Carbon budget values.
- Fallback One Lever insight.
- Duplicate same-day check-in blocking.
- Valid check-in streak and savings updates.
- Leaderboard sorting and current-user highlighting.
- Story card data generation.
- AI provider fallback order and AI JSON parsing.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

## Environment Variables

Copy `.env.example` to `.env.local` if you want AI insights:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

All keys are optional. Without them, CarbonIQ uses static fallback insights.

Do not commit `.env` or `.env.local`.

## Build

```bash
pnpm install
pnpm lint
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Deployment Notes

The project is a static Vite app deployed to Firebase Hosting. Configure `VITE_GEMINI_API_KEY` and/or `VITE_OPENROUTER_API_KEY` before building if AI-powered insights are desired.

Deployment:

- Platform: Firebase Hosting
- Firebase project: carbon-iq-1994a
- Build command: `pnpm build`
- Output directory: `dist`
- Live URL: https://carbon-iq-1994a.web.app

Build command:

```bash
pnpm build
```

Output directory:

```txt
dist
```

Firebase Hosting settings:

```txt
Install command: pnpm install
Build command: pnpm build
Public directory: dist
Single-page app rewrite: yes
```

Manual Firebase deploy:

```bash
firebase login
firebase use <PROJECT_ID>
pnpm build
firebase deploy --only hosting
```

## Security Notes

- Real API keys belong only in `.env.local`.
- `.env` and `.env.local` must never be committed.
- `.env.example` intentionally contains placeholders only.
- `dist`, `node_modules`, and `.firebase` are generated or local files and should stay uncommitted.
- Because this hackathon MVP is frontend-only, Vite environment variables are embedded in the browser bundle. A production version should proxy AI calls through Firebase Functions, Cloud Run, or another trusted backend.

## Repository

https://github.com/YellankiKaushik/Carbon-IQ

## Documentation

- [Project Explanation](docs/PROJECT_EXPLANATION.md)
- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)

## Manual QA Checklist

- Landing page loads.
- "Calculate Your CarbonIQ" starts the quiz.
- "View Demo Dashboard" opens a clearly labeled sample dashboard.
- Quiz requires an option before continuing.
- Quiz completes after all seven questions.
- Dashboard renders the total estimate, chart, category breakdown, and budget gauge.
- One Lever card appears and is visually dominant.
- "Join This Challenge" creates an active challenge.
- Daily check-in increases streak and estimated CO2 saved.
- Duplicate same-day check-in is blocked with a clear message.
- Leaderboard is ranked by total CO2 saved.
- Current user is highlighted on the leaderboard.
- Story card preview and caption appear.
- Copy caption works.
- Copy app link works.
- Download card either downloads a PNG or shows the graceful fallback message.
- Refresh preserves state through localStorage.
- Mobile layout remains readable and tappable.
- Browser console shows no obvious runtime-breaking errors.

## Assumptions

- The footprint model is intentionally simple for a 24-hour MVP.
- localStorage is enough for demo continuity.
- Leaderboard users are seeded mock community members.
- Rankings reward total CO2 saved, not the lowest starting footprint.

## Future Improvements

- Let users choose region-specific emission factors.
- Add richer progress history over weeks and months.
- Add optional anonymous cloud sync.
- Add more robust story-card image templates.
- Add automated UI accessibility checks.

## Screenshots

Screenshots will be added after final UI testing and bug-fix pass.

## Live Demo

[Open CarbonIQ](https://carbon-iq-1994a.web.app)

## LinkedIn Build-in-Public Post

Placeholder: add LinkedIn post link.
