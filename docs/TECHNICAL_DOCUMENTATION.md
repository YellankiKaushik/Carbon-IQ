# CarbonIQ Technical Documentation

## 1. Technical Executive Summary

CarbonIQ is a frontend-first carbon footprint awareness MVP built with Vite, React, TypeScript, Tailwind CSS, Zustand, Recharts, Vitest, localStorage, a Gemini -> OpenRouter -> static fallback AI insight chain, and Firebase Hosting.

Technically, CarbonIQ is a static single-page React application. It does not use a backend database, authentication, server-rendering, or server-side API layer in the current MVP. The application keeps product state in a Zustand store and persists important state slices into browser localStorage. Carbon calculations, AI response validation, challenge logic, leaderboard sorting, profile sanitization, and story-card data composition live in testable utility modules.

The system is designed for hackathon reliability. Core footprint calculation is deterministic and does not require network access. AI personalization is attempted only for the One Lever insight. If Gemini fails, OpenRouter is attempted. If both providers fail or keys are absent, static fallback logic still produces a dashboard-safe recommendation.

The app is built into a `dist/` directory and deployed to Firebase Hosting under project `carbon-iq-1994a`. Firebase serves the compiled static assets with an SPA rewrite to `index.html`.

### Technical one-line summary

CarbonIQ is a Vite + React + TypeScript frontend-first carbon awareness MVP using localStorage persistence, deterministic carbon calculations, a Gemini -> OpenRouter -> static fallback AI insight chain, and Firebase Hosting deployment.

### Engineering highlights

- Frontend-first MVP with no backend service required for core flow.
- Typed data models in `src/types/index.ts`.
- Zustand store with localStorage persistence in `src/store/useAppStore.ts`.
- Deterministic carbon calculator in `src/utils/calculator.ts`.
- Gemini primary, OpenRouter fallback, and static fallback AI insight engine in `src/utils/aiInsight.ts`.
- Demo mode with seeded footprint and fallback insight.
- Recharts category chart with fixed dimensions to avoid responsive measurement warnings.
- Story card generation with `html-to-image`.
- Responsive Tailwind UI across landing, quiz, dashboard, challenge, leaderboard, and story card.
- Vitest coverage for calculator, AI fallback, challenge, leaderboard, story data, profile helpers, and demo mode.
- Firebase Hosting deployment through `firebase.json` and `.firebaserc`.

### Current limitations

- API calls are made from the frontend, so Vite `VITE_` keys are browser-visible after build.
- Persistence is localStorage-only.
- Leaderboard/community data is seeded demo data.
- Carbon factors are simplified awareness estimates, not scientific audit values.
- Production should move AI calls behind Firebase Functions or Cloud Run.

## 2. System Overview

CarbonIQ is built as a static React SPA with local deterministic logic and optional AI enrichment.

```txt
[Landing Page]
    |
    v
[Quiz / Onboarding]
    |
    v
[Carbon Calculator]
    |
    v
[App State Store + localStorage]
    |
    v
[Dashboard Renderer]
    |
    v
[AI Insight Engine]
    |
    v
[Gemini Provider]
    |
    | fallback
    v
[OpenRouter Provider]
    |
    | fallback
    v
[Static Insight Generator]
    |
    v
[One Lever Card]
    |
    v
[Challenge + Check-in]
    |
    v
[Leaderboard]
    |
    v
[Story Card]
    |
    v
[Firebase Hosted Static App]
```

### Deterministic parts

- Quiz data definitions.
- Carbon calculator category estimates.
- Biggest-category detection.
- Monthly budget calculation.
- Static fallback insights.
- Challenge creation and check-in behavior.
- Duplicate same-day check-in detection.
- Leaderboard sorting and current-user insertion.
- Story filename generation and caption composition.
- Profile name sanitization and fallback.

### AI-driven parts

- One Lever insight generation when Gemini or OpenRouter keys are available.
- AI response parsing, validation, normalization, and provider source attribution.

### Demo/sample data parts

- Demo footprint from `getDemoFootprint()`.
- Demo insight from `getDemoInsight()`.
- Seed leaderboard entries from `SEED_LEADERBOARD`.
- Community snapshot values derived from seeded leaderboard data.

### Locally persisted parts

- User profile.
- Quiz answers.
- Footprint breakdown.
- AI or fallback insight.
- Challenge.
- Check-ins.
- Demo mode flag.

## 3. Repository and Codebase Structure

Actual repository structure:

```txt
Carbon-IQ/
|-- src/
|   |-- components/
|   |   `-- Navbar.tsx
|   |-- pages/
|   |   |-- Landing.tsx
|   |   |-- Quiz.tsx
|   |   |-- Dashboard.tsx
|   |   |-- Challenges.tsx
|   |   |-- Leaderboard.tsx
|   |   `-- StoryCard.tsx
|   |-- store/
|   |   `-- useAppStore.ts
|   |-- types/
|   |   `-- index.ts
|   |-- utils/
|   |   |-- aiInsight.ts
|   |   |-- calculator.ts
|   |   |-- carboniq.test.ts
|   |   |-- challengeLogic.ts
|   |   |-- leaderboard.ts
|   |   |-- profile.ts
|   |   |-- quizData.ts
|   |   `-- storyData.ts
|   |-- App.tsx
|   |-- index.css
|   |-- main.tsx
|   `-- vite-env.ts
|-- docs/
|   |-- PROJECT_EXPLANATION.md
|   |-- TECHNICAL_DOCUMENTATION.md
|   `-- TESTING_NOTES.md
|-- firebase.json
|-- .firebaserc
|-- .env.example
|-- .gitignore
|-- package.json
|-- pnpm-lock.yaml
|-- pnpm-workspace.yaml
|-- postcss.config.js
|-- tailwind.config.js
|-- tsconfig.json
|-- index.html
`-- README.md
```

There is no custom `vite.config.ts` or `vite.config.js` in the repository at the time of this audit. The project uses Vite defaults through the `vite` CLI.

| Path | Responsibility |
| --- | --- |
| `src/App.tsx` | Lazy-loads pages, hydrates store, renders global `Navbar`, switches pages by store state. |
| `src/components/Navbar.tsx` | Fixed app navigation with desktop text tabs and mobile icon tabs. |
| `src/pages/Landing.tsx` | Landing page, problem framing, One Lever preview, demo and quiz CTAs. |
| `src/pages/Quiz.tsx` | Name capture, seven-question quiz, validation, previous/next/home navigation. |
| `src/pages/Dashboard.tsx` | Main result dashboard, chart, budget, AI insight, demo banner, community snapshot. |
| `src/pages/Challenges.tsx` | Active challenge UI, check-in, duplicate protection messaging, recent activity. |
| `src/pages/Leaderboard.tsx` | Seeded leaderboard plus current-user ranking. |
| `src/pages/StoryCard.tsx` | Social-ready story card preview, PNG download, caption copy, app link copy. |
| `src/store/useAppStore.ts` | Zustand app state and localStorage persistence. |
| `src/types/index.ts` | Core TypeScript interfaces. |
| `src/utils/aiInsight.ts` | AI prompt building, Gemini/OpenRouter calls, response validation, fallback insight. |
| `src/utils/calculator.ts` | Deterministic footprint estimate and demo footprint. |
| `src/utils/challengeLogic.ts` | Challenge creation and check-in mutation logic. |
| `src/utils/leaderboard.ts` | Seed data, user badge, ranking and sorting. |
| `src/utils/profile.ts` | Display-name sanitization and possessive display helper. |
| `src/utils/quizData.ts` | Quiz question and option definitions. |
| `src/utils/storyData.ts` | Story card data, caption, and filename generation. |
| `src/utils/carboniq.test.ts` | Vitest logic coverage. |
| `firebase.json` | Firebase Hosting public directory, ignored files, SPA rewrite. |
| `.firebaserc` | Firebase project alias to `carbon-iq-1994a`. |
| `.env.example` | Placeholder-only frontend environment variable names. |

## 4. Technology Stack and Engineering Decisions

| Technology | Role in CarbonIQ | Why It Was Used | Tradeoff |
| --- | --- | --- | --- |
| Vite | Build tool and dev server | Fast React development and static builds | Build-time env variables are embedded into frontend bundle |
| React | UI framework | Component-based SPA architecture | No server rendering in current setup |
| TypeScript | Type safety | Interfaces for app state, AI responses, challenge data, story data | Requires careful typing around AI JSON |
| Tailwind CSS | Styling | Fast responsive UI implementation | Utility classes can become verbose |
| Zustand | State management | Small store with simple actions and localStorage persistence | No normalized server state or cache layer |
| Recharts | Category chart | Quick pie chart visualization | Adds bundle weight and chart-specific rendering constraints |
| localStorage | Persistence | No backend required for MVP continuity | User state is browser-local and not secure storage |
| Gemini API | Primary AI provider | Google-first AI strategy | Free-tier quota/rate limits can fail requests |
| OpenRouter API | Secondary AI fallback | Keeps AI flow resilient if Gemini fails | External provider dependency |
| Static fallback | Final insight fallback | Guarantees dashboard remains usable | Less personalized than AI |
| Firebase Hosting | Deployment | Fast Google-hosted static app deployment | No server runtime for API protection |
| Vitest | Logic testing | Fast tests for utilities and store behavior | Does not cover pixel-perfect UI |
| Firebase CLI | Deployment tool | Deploys `dist/` to Firebase Hosting | Requires authenticated local environment |
| pnpm | Package manager | Efficient dependency install and script execution | Windows shell may require direct `.cmd` usage in some environments |

### Why Vite + React

Vite provides fast local development and a simple production build to static assets. React fits the app's page-based component model: landing, quiz, dashboard, challenge, leaderboard, and story card are separate UI surfaces with shared state.

### Why TypeScript

CarbonIQ has several structured data contracts: quiz answers, footprint breakdowns, AI responses, challenges, check-ins, leaderboard rows, and story card data. TypeScript keeps these contracts explicit and improves testability.

### Why Tailwind

Tailwind supports rapid product UI iteration with responsive classes. This matters for a hackathon MVP because the UI needs to become polished quickly without building a custom design system.

### Why localStorage for MVP

localStorage gives persistence without authentication, database setup, or backend deployment. It is appropriate for demo continuity and frontend-first delivery, but it is not the right persistence layer for production user accounts.

### Why Firebase Hosting

Firebase Hosting is well-suited for a Vite static app. It supports a simple `pnpm build -> dist -> firebase deploy --only hosting` workflow and aligns the project with Google infrastructure.

### Why Gemini primary + OpenRouter fallback

Gemini supports the Google-first AI strategy. OpenRouter protects the demo from Gemini quota or rate-limit failures. Static fallback protects the app from both external providers failing.

### Why no backend in MVP

The MVP objective is to prove the product loop quickly: calculate, recommend, challenge, track, and share. A backend would improve security and persistence but would also increase implementation complexity. The production roadmap should add a backend proxy for AI calls.

## 5. Application Architecture

```txt
Presentation Layer
|-- Landing page
|-- Quiz page
|-- Dashboard page
|-- Challenge page
|-- Leaderboard page
`-- Story card page

State Layer
|-- User profile
|-- Quiz answers
|-- Footprint breakdown
|-- AI insight
|-- Challenge progress
|-- Check-ins
|-- Demo mode flag
`-- localStorage persistence

Logic Layer
|-- Carbon calculator
|-- AI insight generation
|-- Challenge/check-in logic
|-- Leaderboard sorting
|-- Story card data composition
`-- Profile/name sanitization

Integration Layer
|-- Gemini API
|-- OpenRouter API
`-- Firebase Hosting

Testing Layer
|-- Vitest logic tests
|-- TypeScript verification
`-- Production build verification
```

### Presentation layer

The presentation layer is organized by user journey surface. Each page consumes store state and utility outputs, then renders a clear UI. Navigation is store-driven rather than URL-router driven.

### State layer

The state layer is centralized in `useAppStore.ts`. State is persisted using prefixed localStorage keys such as `carboniq_user`, `carboniq_quizAnswers`, and similar keys.

### Logic layer

Domain logic is intentionally separated from page components. This makes calculator, AI parsing, challenge check-ins, leaderboard sorting, and story data testable.

### Integration layer

The only runtime external APIs are Gemini and OpenRouter, both called from `aiInsight.ts`. Firebase Hosting serves the compiled frontend.

### Testing layer

Tests focus on deterministic logic and AI fallback behavior rather than brittle UI snapshots.

## 6. Frontend Routing and User Flow Architecture

CarbonIQ does not use React Router. It uses a store field named `currentPage` and a switch statement in `App.tsx`.

Supported page values:

- `landing`
- `quiz`
- `dashboard`
- `challenges`
- `leaderboard`
- `story`

Pages are lazy-loaded using `React.lazy`, and a `Suspense` fallback renders `Loading CarbonIQ...`.

### Real user flow

```txt
Landing CTA
-> Quiz
-> Save name + answers
-> Calculate footprint
-> Generate AI insight
-> Save app state
-> Dashboard
-> Challenge
-> Leaderboard
-> Story Card
```

### Demo flow

```txt
Landing demo CTA
-> Set demo mode
-> Load seeded sample profile/data
-> Dashboard with demo banner
-> Start real quiz clears demo mode
```

### Returning user flow

```txt
App loads
-> useEffect calls hydrate()
-> localStorage values are read
-> Store receives user/results/challenge/check-ins/demo flag
-> User can continue from restored app state
```

### Navigation behavior

`Navbar.tsx` renders on every page except the landing page. On desktop it shows a brand/Home button and page tabs. On mobile it shows icon buttons with accessible labels. If no footprint exists yet, the nav offers a Start Quiz action instead of result-dependent pages.

## 7. State Management and localStorage Persistence

The Zustand store in `src/store/useAppStore.ts` is the operational center of the app.

| State Field | Purpose | Source | Persistence |
| --- | --- | --- | --- |
| `user` | Current user profile with sanitized display name | Quiz name input or demo mode | `carboniq_user` |
| `quizAnswers` | Partial or complete quiz answers | Quiz selections or demo answers | `carboniq_quizAnswers` |
| `footprint` | Calculated or demo footprint | `calculateFootprint()` or `getDemoFootprint()` | `carboniq_footprint` |
| `insight` | AI or fallback One Lever insight | `generateOneLeverInsight()` or `getDemoInsight()` | `carboniq_insight` |
| `insightLoading` | AI loading UI flag | Store action state | Not persisted |
| `challenge` | Active challenge derived from insight | `joinChallenge()` | `carboniq_challenge` |
| `checkIns` | Daily check-ins | `checkIn()` | `carboniq_checkIns` |
| `currentPage` | Current UI page | `setPage()` | Not persisted |
| `isDemoMode` | Whether dashboard is showing sample data | `loadDemoState()` or real calculation | `carboniq_isDemoMode` |
| `quizSubmitting` | Quiz submit/loading state | Quiz flow | Not persisted |

### Store helper behavior

- `loadFromStorage()` safely reads and parses JSON.
- `saveToStorage()` safely writes JSON.
- `removeFromStorage()` removes a specific state key.
- Each helper catches storage errors to avoid breaking the UI in restricted browser contexts.

### Quiz completion pseudocode

```txt
When user completes quiz:
    validate current answer
    set quizSubmitting true
    calculateFootprint(quizAnswers)
    set footprint
    set isDemoMode false
    save footprint
    save isDemoMode false
    set page to dashboard
    generateInsight()
    save insight when available
    set quizSubmitting false
```

### Demo mode clearing

`calculateQuizFootprint()` explicitly sets `isDemoMode` to `false`. `resetQuiz()` also clears footprint, insight, quiz answers, and demo mode.

## 8. Data Models and Type System

Core types live in `src/types/index.ts`.

| Type / Interface | Role | Important Fields |
| --- | --- | --- |
| `UserProfile` | User identity for personalization | `id`, `display_name`, `created_at` |
| `QuizAnswers` | Complete quiz payload | `commute_mode`, `commute_days`, `diet_type`, `home_energy_usage`, `shopping_frequency`, `travel_frequency`, `reduction_preference` |
| `CategoryBreakdown` | Category totals or percentages | `transport`, `food`, `energy`, `consumption` |
| `FootprintBreakdown` | Calculator output | `total_kg_co2_year`, `total_kg_co2_month`, `category_breakdown`, `category_percentages`, `biggest_category`, `monthly_budget`, `current_spend`, `is_estimate` |
| `OneLever` | Primary recommendation | `category`, `action`, `savings_estimate_kg`, `why_it_matters` |
| `SecondaryTip` | Secondary recommendation | `category`, `action`, `savings_estimate_kg` |
| `AIInsightResponse` | Dashboard insight contract | `one_lever`, `secondary_tips`, `source`, `created_at` |
| `Challenge` | Active user challenge | `id`, `source`, `category`, `action_description`, `joined_at`, `streak_count`, `total_saved_kg`, `saving_per_checkin_kg`, `status` |
| `CheckIn` | Daily challenge completion | `id`, `challenge_id`, `date`, `saved_kg`, `created_at` |
| `CheckInResult` | Check-in action response | `success`, `message`, `challenge`, `checkIns` |
| `LeaderboardEntry` | Leaderboard row | `user_name`, `is_current_user`, `total_saved_kg`, `streak_count`, `badge` |
| `StoryCardData` | Share card data | `total_saved_kg`, `annual_footprint_kg`, `biggest_win`, `streak_count`, `leaderboard_rank`, `share_caption`, `download_filename` |
| `QuizOption` | Quiz answer option | `value`, `label`, `icon` |
| `QuizQuestion` | Quiz question definition | `id`, `question`, `options` |

TypeScript improves the codebase by:

- keeping page components aligned with utility outputs,
- preventing missing fields in story-card/challenge rendering,
- giving tests stable contracts,
- requiring AI parsing code to normalize uncertain JSON into a known `AIInsightResponse`,
- making future refactors safer.

## 9. Carbon Calculator Logic

The calculator lives in `src/utils/calculator.ts`. It is deterministic and does not require network access.

### Inputs

The calculator consumes `QuizAnswers`:

- commute mode,
- commute days,
- diet type,
- home energy usage,
- shopping frequency,
- travel frequency,
- reduction preference.

The current implementation uses the first six categories directly in calculation. `reduction_preference` is included in the AI prompt context but not used in the deterministic calculator formula.

### Categories

The calculator outputs four categories:

- `transport`
- `food`
- `energy`
- `consumption`

`consumption` combines shopping and travel factors.

### Calculation behavior

```txt
transport = commuteModeFactor * commuteDaysMultiplier
food = dietFactor
energy = homeEnergyFactor
consumption = shoppingFactor + travelFactor

total_kg_co2_year = transport + food + energy + consumption
total_kg_co2_month = round(total_kg_co2_year / 12)
category_percentages = each category / total_kg_co2_year
biggest_category = max(category_breakdown)
monthly_budget = round(total_kg_co2_month * 0.8)
current_spend = total_kg_co2_month
```

### Calculator input flow

```txt
Quiz answers
-> lifestyle factor lookup
-> category estimates
-> total annual footprint
-> monthly footprint
-> biggest category
-> monthly budget comparison
-> dashboard summary
```

### Important engineering note

The factors are internally consistent awareness estimates. They are not region-specific, audit-grade, or scientific measurement values. The app labels them as estimates.

## 10. One Lever Recommendation Logic

The One Lever system combines deterministic category detection with optional AI personalization.

```txt
Footprint Breakdown
-> Largest Category
-> User Lifestyle Context
-> AI Insight Prompt
-> Structured Recommendation
-> One Lever Card
-> Challenge Suggestion
```

### Deterministic category detection

`calculateFootprint()` identifies `biggest_category` by choosing the category with the highest numeric total.

### AI personalization

`generateOneLeverInsight()` sends quiz answers and footprint breakdown into the AI prompt. The prompt asks for:

- one highly specific primary recommendation,
- two secondary tips,
- estimated savings values,
- strict JSON output.

### Static fallback recommendations

If AI providers are unavailable, `getFallbackInsight()` maps the largest category to a deterministic recommendation:

- transport: swap two car commutes,
- food: replace meat-heavy meals,
- energy: reduce AC/heating and idle appliances,
- consumption: avoid non-essential purchase and choose longer-lasting items.

### Product effect

The One Lever card is dashboard-dominant because it is the main behavior-change output. It prevents the app from becoming only a calculator.

## 11. AI Insight Engine Deep Dive

The AI system is implemented in `src/utils/aiInsight.ts`.

### Function tree

```txt
generateOneLeverInsight()
|-- getDefaultEnv()
|-- requestGeminiInsight()
|   |-- buildPrompt()
|   |-- fetchWithTimeout()
|   |-- parseAIInsightText()
|   `-- normalize output
|-- if Gemini fails -> requestOpenRouterInsight()
|   |-- buildPrompt()
|   |-- fetchWithTimeout()
|   |-- parseAIInsightText()
|   `-- normalize output
`-- if OpenRouter fails -> getFallbackInsight()
```

### Provider order

1. Gemini, if `VITE_GEMINI_API_KEY` is available.
2. OpenRouter, if `VITE_OPENROUTER_API_KEY` is available.
3. Static fallback insight.

### Timeout behavior

`fetchWithTimeout()` uses `AbortController` and `AI_TIMEOUT_MS = 12000`. This prevents AI requests from hanging indefinitely.

### JSON parsing and validation

`parseAIInsightText()`:

- extracts the first JSON object from text,
- supports snake_case and camelCase response keys,
- validates allowed categories,
- validates positive savings values,
- validates action and explanation text,
- normalizes secondary tips,
- attaches `source` and `created_at`.

### AI response pseudocode

```txt
try:
    insight = await callGemini(context)
    return { ...insight, source: "gemini" }
catch:
    try:
        insight = await callOpenRouter(context)
        return { ...insight, source: "openrouter" }
    catch:
        return staticFallback(context)
```

### User-safe error handling

Provider failures are swallowed inside the AI chain and do not surface raw API errors to the UI. The dashboard shows whichever provider succeeds or the fallback label.

### Observed behavior

Gemini may return 429 in free-tier usage. CarbonIQ handles this by falling back to OpenRouter, keeping the user experience stable. Demo mode may show `Fallback Insight`.

## 12. Gemini Integration

Gemini is the primary provider in CarbonIQ.

### Role

Gemini receives structured quiz answers and the calculated footprint breakdown, then returns a JSON One Lever recommendation.

### Conceptual data sent

- Quiz answer values.
- Category totals.
- Category percentages.
- Biggest category.
- Monthly and annual footprint values.
- User reduction preference.

### Structured output expectation

The prompt requires strict JSON:

- `one_lever`
- `category`
- `action`
- `savings_estimate_kg`
- `why_it_matters`
- `secondary_tips`

### Failure behavior

If Gemini fails, times out, rate-limits, returns invalid JSON, or omits required fields, CarbonIQ attempts OpenRouter next.

### Environment variable

Gemini is configured through:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

For production, this call should move behind Firebase Functions or Cloud Run so the key is not exposed in the browser.

## 13. OpenRouter Fallback Integration

OpenRouter is the secondary AI provider.

### Role

OpenRouter protects the One Lever flow from Gemini quota or rate-limit issues. It receives the same conceptual prompt and returns the same expected JSON shape.

### Environment variables

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

### Response handling

OpenRouter content is read from `choices[0].message.content`, then parsed through the same validation pipeline as Gemini. The parser supports camelCase fields such as `oneLever` and `savingsEstimateKg`.

### Source badge

If OpenRouter succeeds, the dashboard source badge shows:

```txt
AI: OpenRouter
```

If OpenRouter fails, CarbonIQ falls back to static logic.

## 14. Static Fallback Insight System

Static fallback exists to guarantee a usable dashboard.

```txt
No API key / provider failure / invalid AI response
-> static fallback insight
-> dashboard still renders
-> user still receives a One Lever action
```

### Why it exists

- Hackathon demos should not depend entirely on external AI availability.
- Users without configured API keys still need a complete product experience.
- Gemini quota/rate limits should not break the app.

### Demo mode

Demo mode uses `getDemoInsight()`, which returns a transport-focused fallback insight. The dashboard labels it as `Fallback Insight`.

### Limitations

Static fallback is less personalized than AI because it uses category-based templates rather than nuanced language generation.

## 15. Dashboard Architecture

`src/pages/Dashboard.tsx` is the central product surface.

### State consumed

- `footprint`
- `insight`
- `insightLoading`
- `retryInsight`
- `joinChallenge`
- `challenge`
- `checkIns`
- `user`
- `isDemoMode`
- `setPage`
- `resetQuiz`

### Main sections

- Demo mode banner.
- Personalized dashboard header.
- Annual/monthly/biggest category/One Lever summary cards.
- Category breakdown chart.
- Category percentage rows.
- Monthly carbon budget.
- One Lever insight card.
- Provider badge.
- "How this insight was generated" details.
- Retry AI Insight button.
- Collapsible secondary tips.
- Community snapshot with sample data.
- Challenge progress panel.
- Recalculate, Leaderboard, and Story Card actions.

### Chart data creation

Dashboard maps `footprint.category_breakdown` into Recharts pie data and uses `getCategoryLabel()` plus `getCategoryColor()` for labels and colors.

### Reliability behavior

The dashboard remains useful in all AI states:

- AI loading: loading panel.
- AI success: One Lever card with provider badge.
- AI fallback: fallback card with source badge.
- No footprint: prompt to start quiz.

## 16. Demo Mode Architecture

Demo mode is implemented in `loadDemoState()` inside `useAppStore.ts`.

### Flow

```txt
Click View Demo Dashboard
-> loadDemoState()
-> create sample user with display_name "You"
-> load demo answers
-> load demo footprint
-> load demo fallback insight
-> clear challenge/check-ins
-> set currentPage to dashboard
-> set isDemoMode true
-> persist demo state
```

### Dashboard labeling

When `isDemoMode` is true, dashboard shows:

- `Demo Mode` badge,
- sample-data banner,
- `Sample Data` badge,
- `Calculate My Real Footprint` CTA.

### Real quiz transition

Clicking `Calculate My Real Footprint` calls `resetQuiz()` and navigates to quiz. Real calculation sets `isDemoMode` to false.

## 17. Quiz and Onboarding Architecture

The quiz is implemented in `src/pages/Quiz.tsx`, with question definitions in `src/utils/quizData.ts`.

### Quiz data flow

```txt
Question data
-> User answer selection
-> Validation
-> Store answer state
-> Final submission
-> Calculator + AI insight
```

### Implementation details

- Optional name capture happens before the first footprint question.
- Names are stored through `setUserName()` and sanitized in the store.
- `step` tracks quiz progress.
- `showNameInput` controls whether the user is on the onboarding step.
- `validationError` prevents continuing without an answer.
- Previous navigation can return to the name step or earlier questions.
- Home navigation lets users leave the quiz without refreshing.
- Submit calculates footprint and starts AI insight generation.

### Quiz questions

The quiz covers:

- commute mode,
- commute days,
- diet type,
- home energy usage,
- shopping frequency,
- travel frequency,
- reduction preference.

## 18. Challenge, Check-in, and Streak Logic

Challenge logic is split between `src/pages/Challenges.tsx` and `src/utils/challengeLogic.ts`.

### Challenge creation

`createChallengeFromInsight()` creates a challenge from the current One Lever:

- category from insight,
- action description from insight action,
- saving per check-in as `round(savings_estimate_kg / 30)`, minimum 1,
- streak count starts at 0,
- total saved starts at 0.

### Check-in pseudocode

```txt
if user already checked in today:
    return duplicate check-in message
else:
    create check-in
    increase streak
    add saving_per_checkin_kg to total_saved_kg
    persist challenge and check-ins
    show success message
```

### Duplicate protection

`applyChallengeCheckIn()` checks existing check-ins for the same challenge ID and today's ISO date.

### Product effect

This system turns a recommendation into a repeatable action and gives the dashboard measurable progress.

## 19. Leaderboard Logic

Leaderboard logic lives in `src/utils/leaderboard.ts` and renders in `src/pages/Leaderboard.tsx`.

### Flow

```txt
Seeded entries + current user
-> sort by saved CO2
-> assign visual rank by render index
-> render leaderboard
```

### Seeded data

`SEED_LEADERBOARD` contains sample users and saved CO2 values. This is not real community data.

### Current user insertion

`getLeaderboardWithUser()` creates a current-user entry using:

- display name,
- total saved kg,
- streak count,
- badge from `getUserBadge()`.

It combines the current user with seed entries, sorts descending by saved CO2, and returns `entries` plus `userRank`.

### Fairness decision

Ranking by CO2 saved rewards improvement, not a naturally lower starting footprint.

## 20. Story Card System

Story card rendering lives in `src/pages/StoryCard.tsx`, and data composition lives in `src/utils/storyData.ts`.

### Data flow

```txt
Profile + footprint + insight + challenge + leaderboard
-> StoryCardData
-> visual card preview
-> PNG download / caption copy
```

### Story card contents

- User name or possessive fallback.
- Total saved kg.
- Streak count.
- Leaderboard rank.
- Annual footprint estimate.
- One Lever action.
- Estimated impact.
- CarbonIQ branding.
- Live app URL.
- Share caption.

### Download behavior

`html-to-image` is dynamically imported when the user downloads the card. The card is converted to PNG with `pixelRatio: 2` and downloaded with a clean filename.

### Filename behavior

`createStoryFilename()` sanitizes a display name into:

```txt
carboniq-story-kaushik.png
```

Fallback:

```txt
carboniq-story.png
```

### Clipboard behavior

The component uses `navigator.clipboard.writeText()` when available and falls back to a temporary textarea plus `document.execCommand('copy')`.

## 21. Profile and Display Name Sanitization

Profile helpers live in `src/utils/profile.ts`.

### Flow

```txt
raw name input
-> trim/sanitize
-> safe display name
-> dashboard/challenge/leaderboard/story card
```

### `sanitizeDisplayName()`

This helper:

- removes angle brackets,
- collapses repeated whitespace,
- trims,
- limits names to 30 characters,
- falls back to `You`.

### `possessiveName()`

This helper returns:

- `Your` when the display name is `You`,
- `Kaushik's` for a named user.

This prevents awkward fallback possessive UI in challenge, leaderboard, and story-card headings.

## 22. Responsive Design and Accessibility Engineering

CarbonIQ uses Tailwind responsive classes across page layouts.

### Responsive strategies

- Landing page uses responsive grids and stacked CTAs.
- Quiz uses a centered max-width card and large answer buttons.
- Dashboard summary cards stack on small screens and expand on desktop.
- Category chart uses fixed dimensions to avoid overflow and measurement warnings.
- Challenge progress cards use responsive grids.
- Story card uses mobile-safe padding and two-column metric layout.
- Navbar uses text tabs on desktop and icon controls with ARIA labels on mobile.

### View sizes verified during product hardening

```txt
375px
390px
430px
768px
1024px
desktop full width
```

### Accessibility support

- Semantic buttons.
- ARIA labels for compact mobile navigation.
- Form validation messages.
- Text summaries beside chart data.
- Tap-friendly button sizes.
- Demo/sample status expressed in text.
- Largest category expressed through text label, not color alone.

## 23. Error Handling and Reliability Strategy

| Failure Case | Handling Strategy | User Impact |
| --- | --- | --- |
| Missing quiz answer | Show validation message before moving forward | User knows what to fix |
| Missing profile name | Fallback to `You` | Personalization remains stable |
| localStorage unavailable or corrupted | Storage helpers catch errors and fall back | App still renders |
| Demo mode sample data | Explicit banner and badge | User understands data is sample |
| Gemini failure | Catch and try OpenRouter | AI flow remains stable |
| OpenRouter failure | Catch and use static fallback | Dashboard still gets insight |
| Invalid AI JSON | Parser throws, provider selection continues | Bad AI output does not break UI |
| Duplicate check-in | Return duplicate message | Streak cannot be inflated same day |
| Story card download failure | Show non-blocking warning | User can still copy caption |
| Clipboard API unavailable | Fallback textarea copy | Copy actions remain usable |
| Refresh/reload | Hydrate from localStorage | User state can continue |

## 24. Security Model

### Current MVP security posture

CarbonIQ is a frontend-only static app. It does not include authentication, backend database access, privileged server logic, or protected API routes.

### Secrets handling

Real keys are expected only in `.env.local`. `.env.example` contains placeholders:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

Ignored files:

```txt
.env
.env.local
node_modules/
dist/
.firebase/
```

### Known security limitation

Vite frontend environment variables are embedded in browser bundles at build time. This means any real `VITE_` provider key used in a frontend-only app should be considered browser-visible.

### Production-grade upgrade path

Move AI calls to Firebase Functions or Cloud Run:

```txt
React frontend
-> Firebase Function / Cloud Run endpoint
-> Gemini or OpenRouter provider
-> validated response
-> frontend dashboard
```

This would keep provider keys server-side and allow rate limiting, logging, and abuse protection.

## 25. Firebase Hosting Deployment Architecture

### Project information

| Item | Value |
| --- | --- |
| Firebase project ID | `carbon-iq-1994a` |
| Live URL | `https://carbon-iq-1994a.web.app` |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Deploy command | `firebase deploy --only hosting` |

### Deployment flow

```txt
pnpm build
-> dist/
-> firebase deploy --only hosting
-> https://carbon-iq-1994a.web.app
```

### `firebase.json`

The Firebase config:

- serves `dist` as the public directory,
- ignores Firebase config, dotfiles, and node_modules,
- rewrites all routes to `/index.html` for SPA behavior.

### `.firebaserc`

The default Firebase project alias points to:

```txt
carbon-iq-1994a
```

### Deployment runbook

```bash
pnpm install
pnpm build
firebase use
firebase deploy --only hosting
```

The project intentionally uses Firebase Hosting, not Vercel or Netlify.

## 26. Environment Variables

Placeholder environment variables:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

### How they work

- `.env.example` documents placeholder values only.
- `.env.local` stores real local values.
- Vite injects `VITE_` variables at build time.
- Firebase Hosting serves already-built static files.
- Changing `.env.local` requires rebuilding and redeploying.

Important note:

```txt
For Vite + Firebase Hosting, runtime Firebase Console environment variables are not used by the static frontend. Values must exist at build time.
```

## 27. Testing Strategy

Tests live in `src/utils/carboniq.test.ts`.

### What is covered

| Test Area | Coverage |
| --- | --- |
| Carbon calculator | Category totals, annual/monthly values, biggest category, monthly budget |
| Static fallback insight | Valid fallback One Lever when AI is unavailable |
| AI provider chain | Gemini success, OpenRouter fallback, full fallback, missing keys |
| AI parsing | Invalid JSON rejection and OpenRouter camelCase parsing |
| Challenge check-ins | Valid check-in increments streak/savings, duplicate same-day check-in blocked |
| Leaderboard | Sorting by saved CO2 and current-user highlighting |
| Story data | Saved CO2, streak, rank, annual footprint, filename, app URL in caption |
| Profile helpers | Sanitized display names and possessive fallback |
| Demo mode | Demo flag set and cleared by real calculation |

### Commands

```bash
pnpm test
```

Windows direct fallback:

```bash
.\node_modules\.bin\vitest.cmd run
```

TypeScript check:

```bash
pnpm exec tsc --noEmit
```

Build check:

```bash
pnpm build
```

### Verified during this documentation task

- `pnpm build` passed.
- `.\node_modules\.bin\vitest.cmd run` passed with 16 tests.

## 28. Performance and Efficiency Considerations

### Build and loading

The app uses Vite production build and React lazy-loaded page components in `App.tsx`. This lets major page components split into chunks.

### Static hosting

Firebase Hosting serves static assets from `dist/`, which is efficient for a frontend-only SPA.

### Local computation

The carbon calculator runs synchronously in the browser and does not need a network roundtrip.

### AI request scope

AI calls are only made for insight generation. The dashboard and calculator do not depend on AI availability.

### Fallback efficiency

Fallback insight generation is local and immediate. It prevents the core UI from blocking if AI providers fail.

### Recharts tradeoff

Recharts provides quick charting but contributes to bundle size. Dashboard chart dimensions are fixed at render time to avoid responsive container measurement issues.

### Observed build output

The production build emits chunked assets, including separate page chunks for Dashboard, Landing, Quiz, Challenges, Leaderboard, and StoryCard.

## 29. Code Quality and Maintainability

| Quality Area | Current Approach |
| --- | --- |
| Type safety | Central interfaces in `src/types/index.ts` |
| State management | Single Zustand store with clear actions |
| Domain logic | Utilities separated from pages |
| AI reliability | Provider fallback chain plus JSON validation |
| Testability | Calculator, AI, challenge, leaderboard, story, profile logic covered by Vitest |
| UX resilience | Demo mode, fallback insight, validation, duplicate check-in messages |
| Documentation | README, product explanation, technical documentation |
| Deployment clarity | Firebase config and deploy commands documented |

The codebase is small enough to navigate quickly but separated enough to support future backend or richer AI upgrades.

## 30. Engineering Tradeoffs

| Decision | Why It Was Chosen | Tradeoff | Future Upgrade |
| --- | --- | --- | --- |
| Frontend-only architecture | Fast hackathon delivery | Browser-visible provider keys | Add Firebase Functions or Cloud Run |
| localStorage instead of database | No auth/backend friction | State is browser-local | Add Firestore or another database |
| Firebase Hosting | Simple Google-hosted static deployment | No server runtime | Add Functions/Cloud Run alongside Hosting |
| Gemini primary with OpenRouter fallback | Google-first plus resilience | External AI dependencies | Add backend provider orchestration |
| Static fallback | Guarantees usable dashboard | Less personalized | Expand deterministic rules or server-side AI |
| Seeded leaderboard | Demonstrates community concept | Not real users | Add backend community data |
| Demo mode | Faster judge evaluation | Sample data must be labeled | Add separate demo dataset configuration |
| Story card download | Social value without social APIs | No direct platform publishing | Add share links and richer templates |
| No authentication | Lower friction | No cross-device persistence | Add optional auth |
| No open-ended chatbot | Stability and scope control | Less conversational flexibility | Add preset AI coach behind backend |

## 31. Production Upgrade Roadmap

### Near-term

- Move AI calls to Firebase Functions or Cloud Run.
- Add real backend persistence.
- Add authentication.
- Protect API keys server-side.
- Improve carbon model with region-specific factors.
- Add analytics for funnel and engagement.
- Add screenshots and final documentation assets.

### Medium-term

- Team/community leaderboards.
- Real challenge groups.
- Monthly history charts.
- Email or share links.
- Improved preset AI coach.
- Better carbon datasets.
- Admin moderation for community features.

### Long-term

- Mobile app.
- Integrations with transport, energy, and spending data.
- Climate education API.
- Organization or school dashboards.
- Advanced personalization engine.
- Multi-step carbon reduction plans.
- Multilingual support.

## 32. Architecture Diagrams for Future Visual Generation

### Diagram 1: System architecture

Purpose: show the full app system from UI to logic to deployment.

Boxes:

- React SPA
- Zustand Store
- localStorage
- Utility Logic
- AI Providers
- Firebase Hosting

Arrows:

```txt
React Pages -> Zustand Store -> Utilities
Utilities -> AI Providers
Store -> localStorage
Build -> Firebase Hosting
```

Caption: "CarbonIQ is a frontend-first React MVP with local deterministic logic, optional AI enrichment, and Firebase static hosting."

### Diagram 2: AI fallback pipeline

Purpose: explain resilience.

Boxes:

- Quiz + Footprint Context
- Gemini
- OpenRouter
- Static Fallback
- AIInsightResponse
- Dashboard Badge

Arrows:

```txt
Context -> Gemini -> OpenRouter -> Static Fallback -> Dashboard
```

Caption: "Gemini is attempted first; OpenRouter and static fallback keep the One Lever insight stable."

### Diagram 3: User journey flow

Purpose: show product flow.

Boxes:

- Quiz
- Dashboard
- One Lever
- Challenge
- Leaderboard
- Story Card

Arrows:

```txt
Quiz -> Dashboard -> One Lever -> Challenge -> Leaderboard -> Story Card
```

Caption: "CarbonIQ turns footprint awareness into one tracked and shareable action."

### Diagram 4: State/data flow

Purpose: show how data moves.

Boxes:

- Quiz Answers
- Calculator
- Store
- localStorage
- Dashboard
- Story Card

Arrows:

```txt
Quiz Answers -> Calculator -> Store -> Dashboard
Store <-> localStorage
Store -> Story Card
```

Caption: "User state is persisted locally and reused across dashboard, challenge, leaderboard, and story card."

### Diagram 5: Firebase deployment flow

Purpose: show deployment mechanics.

Boxes:

- Source Code
- pnpm build
- dist
- Firebase Hosting
- Live URL

Arrows:

```txt
Source Code -> pnpm build -> dist -> Firebase Hosting -> carbon-iq-1994a.web.app
```

Caption: "CarbonIQ deploys as a static Vite build to Firebase Hosting."

## 33. Technical Content Generation Base

### Medium technical article angles

1. Building CarbonIQ: A Frontend-First Carbon Awareness MVP with Gemini, OpenRouter, and Firebase.
2. Designing an AI Fallback Chain for a Hackathon MVP.
3. How the One Lever Principle Became a Product Architecture.
4. Using Firebase Hosting for Fast AI Product Deployment.
5. Building Carbon Footprint State Flows with Zustand and localStorage.
6. Making AI Optional Without Breaking Product UX.
7. How to Validate AI JSON Before Rendering It in React.
8. Building a Shareable Story Card with React and html-to-image.
9. Turning a Carbon Calculator into a Challenge System.
10. Engineering Honest Demo Mode for Hackathon Submissions.

### Dev.to article angles

1. React + Vite + Firebase: Building a Static Carbon Awareness MVP.
2. Implementing Gemini to OpenRouter Fallback in a Frontend App.
3. Testing AI Fallback Logic with Vitest.
4. Zustand + localStorage for Hackathon MVP Persistence.
5. TypeScript Interfaces for AI Product Data Models.
6. Building Deterministic Fallbacks for AI Features.
7. Creating a PNG Story Card from a React Component.
8. Sorting a Seeded Leaderboard with Current User Highlighting.
9. Designing Duplicate Check-in Protection in a Frontend MVP.
10. Firebase Hosting Runbook for Vite Apps.

### LinkedIn technical post angles

1. How CarbonIQ keeps AI optional but useful.
2. The fallback chain that protected my hackathon demo.
3. Why I chose Firebase Hosting for CarbonIQ.
4. What localStorage can and cannot do for MVP persistence.
5. Building a typed carbon footprint data model in TypeScript.
6. How I turned a static calculator into a behavior loop.
7. The technical difference between a demo dashboard and real user results.
8. Why frontend-only MVPs still need security notes.
9. Making AI provider source visible in the UI.
10. Testing the business logic behind a climate MVP.

### PPT technical slide outline

1. Technical Problem.
2. System Architecture.
3. Data Flow.
4. AI Pipeline.
5. State Management.
6. Firebase Deployment.
7. Testing.
8. Security Tradeoffs.
9. Future Architecture.
10. Closing.

### Gemini image prompt themes

- Technical architecture of a React carbon awareness MVP.
- AI fallback pipeline: Gemini to OpenRouter to static fallback.
- Dashboard data flow from quiz answers to footprint breakdown.
- Firebase deployment flow from Vite build to live URL.
- Story card generation from app state to PNG.
- localStorage state persistence flow.

## 34. Demo Engineering Walkthrough

### What to show judges

1. Live Firebase URL.
2. Landing page.
3. Demo mode.
4. Quiz.
5. Dashboard.
6. AI badge.
7. OpenRouter fallback behavior.
8. Challenge/check-in.
9. Leaderboard.
10. Story card.
11. GitHub repo.
12. README/docs/tests.

### What to explain technically

- Vite, React, and TypeScript frontend.
- Zustand store and localStorage persistence.
- Deterministic carbon calculator.
- AI provider chain and validation.
- Gemini free-tier quota risk and OpenRouter fallback.
- Static fallback for no-key/offline resilience.
- Firebase Hosting deployment.
- Vitest coverage.
- Security limitation of frontend-exposed Vite env variables.
- Production upgrade path through Firebase Functions or Cloud Run.

## 35. Known Limitations

- Frontend-only MVP.
- localStorage persistence only.
- No real backend database.
- No authentication.
- Frontend-exposed Vite environment variables.
- Gemini may hit quota or rate limits.
- OpenRouter depends on external provider availability.
- Static fallback is less personalized.
- Leaderboard/community data is seeded.
- Carbon model is simplified and approximate.
- Story sharing is download/copy-based rather than direct platform integration.

These are valid hackathon MVP tradeoffs, not hidden production claims.

## 36. Final Technical Assessment

CarbonIQ is technically coherent because the architecture separates presentation, state, deterministic domain logic, AI integration, and deployment concerns. The system does not overbuild beyond the MVP requirement, but it still includes the reliability patterns needed for a strong demo: typed contracts, AI response validation, provider fallback, static fallback, local persistence, and tests for business logic.

The fallback architecture is the most important reliability decision. It means external AI failure does not break the product's core promise. A user can still calculate a footprint, see a dashboard, receive a One Lever recommendation, join a challenge, track progress, and create a story card.

Frontend-first architecture was appropriate for hackathon speed because it allowed rapid iteration and Firebase static deployment. localStorage was acceptable for MVP continuity because there is no account model yet. Firebase Hosting is appropriate because the app builds cleanly to static assets and uses an SPA rewrite.

The system is ready for final submission as a polished hackathon MVP. The clearest next production step is to move AI provider calls behind Firebase Functions or Cloud Run, then add authenticated backend persistence for real user progress, challenge groups, and community leaderboards.
