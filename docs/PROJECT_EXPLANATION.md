# CarbonIQ Project Explanation

## 1. Executive Summary

CarbonIQ is a personal carbon footprint awareness platform built for PromptWars Virtual - Challenge 3: Carbon Footprint Awareness Platform. It helps individuals estimate their lifestyle carbon footprint, understand which category contributes the most, receive one personalized high-impact recommendation, join that recommendation as a challenge, track estimated CO2 saved, compare progress on a sample leaderboard, and generate a shareable Carbon Story card.

The product is designed for people who care about climate action but do not know where to begin. Many sustainability tools either stop at a number or overwhelm users with generic advice. CarbonIQ takes a different product stance: it translates awareness into one focused action through the One Lever principle.

CarbonIQ uses a frontend-first Vite, React, TypeScript, Tailwind CSS, Recharts, localStorage, Firebase Hosting, and Google Analytics for Firebase stack. Its AI layer attempts Gemini first, falls back to OpenRouter if Gemini is unavailable or rate-limited, and finally falls back to deterministic static insight logic so the core user experience remains stable. Firebase Analytics captures safe product-level events to understand key interactions such as quiz completion, demo dashboard usage, challenge engagement, and story-card sharing behavior.

The live product is deployed on Firebase Hosting:

```txt
https://carbon-iq-1994a.web.app
```

### One-line pitch

CarbonIQ helps individuals understand their lifestyle carbon footprint and reduce it through one personalized high-impact action.

### Short elevator pitch

CarbonIQ is a personal carbon footprint awareness platform for everyday users. It starts with a short lifestyle quiz, calculates an estimated annual and monthly footprint, and shows a clear category breakdown across transport, food, home energy, and consumption. Instead of giving users a long list of generic eco tips, CarbonIQ identifies their biggest footprint category and recommends one high-impact action through a Gemini-first AI insight flow with OpenRouter and static fallback resilience. The user can join that action as a challenge, check in, track estimated CO2 saved, compare progress on a sample leaderboard, and share a Carbon Story card. It is a lightweight, Firebase-hosted hackathon MVP that turns climate awareness into a simple behavior loop.

### Product tagline options

1. Measure your footprint. Change one thing that matters.
2. One carbon insight. One action. Real momentum.
3. Carbon awareness, simplified into one high-impact habit.
4. Find your biggest footprint driver and act on it.
5. From climate confusion to one clear next step.

## 2. Challenge Alignment

PromptWars Virtual - Challenge 3 asks builders to design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights. CarbonIQ directly maps to that requirement.

It is not an enterprise ESG dashboard, audit tool, or compliance product. It is intentionally scoped around individual lifestyle awareness: commuting, diet, home energy, shopping, and travel. The product does not claim scientific audit precision. It uses estimated values to help users see patterns, identify the highest-impact category, and start one practical behavior change.

| Challenge Requirement | CarbonIQ Response |
| --- | --- |
| Help individuals understand their carbon footprint | The quiz and dashboard estimate annual/monthly CO2 and show category percentages. |
| Provide personalized insights | The AI One Lever insight uses quiz answers and footprint breakdown to recommend one action. |
| Encourage simple actions | The One Lever principle turns many possible tips into one focused challenge. |
| Support tracking | The challenge check-in flow tracks streak and estimated CO2 saved. |
| Make the experience accessible | Short quiz, clear cards, readable summaries, mobile-friendly layout, and no account requirement. |
| Show demo-readiness | Demo dashboard uses clearly labeled sample data and lets judges understand the product quickly. |
| Use AI meaningfully | Gemini is the primary insight provider, with OpenRouter and static fallback for resilience. |
| Deploy on Google infrastructure | The static Vite app is deployed on Firebase Hosting under project `carbon-iq-1994a`. |

CarbonIQ is aligned with the challenge because it completes the loop from awareness to action:

```txt
Understand -> Personalize -> Act -> Track -> Share
```

## 3. Problem Definition

Carbon footprint awareness has a usability problem. Most people have heard that commuting, diet, electricity, shopping, and travel affect emissions, but they often do not know which of those choices matters most for their own life. Without that clarity, climate advice becomes a noisy list.

The user problem is not only informational. It is emotional and behavioral. A user may care about sustainability but still feel stuck because the next step is unclear, too broad, or too guilt-heavy. CarbonIQ is built around the idea that climate awareness should feel specific, achievable, and motivating.

### Emotional pain

- Confusion: users do not know which habit is driving the most emissions.
- Guilt: climate content can make people feel judged instead of guided.
- Lack of clarity: users may see dozens of recommendations without knowing which to choose.
- Low confidence: people may assume their personal action is too small to matter.
- Drop-off: if the product ends at a score, users leave without changing behavior.

### Practical pain

- Many carbon calculators feel long, technical, or boring.
- Generic recommendations do not reflect the user's lifestyle.
- A single annual number is hard to translate into action.
- Tracking carbon reduction is not usually built into lightweight calculators.
- Social sharing often requires extra tools or platform-specific integrations.

### Behavioral pain

- Awareness does not automatically become action.
- Users need feedback loops to keep going.
- Habit change works better when the action is small enough to repeat.
- Motivation improves when progress is visible through streaks, saved CO2, and simple comparison.

### Product opportunity

CarbonIQ positions itself as a lightweight, AI-assisted awareness tool. It does not try to solve every climate behavior problem in one product. It focuses on helping a user move from "I wonder what my footprint is" to "I know my biggest category and I have one action to try this week."

That creates a strong hackathon MVP opportunity because the product is easy to demo, easy to understand, and still deep enough to show product thinking across onboarding, dashboarding, AI insight generation, behavior tracking, and storytelling.

## 4. Target Users

CarbonIQ is designed for people who want personal climate clarity without complexity.

| User Type | Need | How CarbonIQ Helps |
| --- | --- | --- |
| Students | A quick way to understand lifestyle footprint and climate choices | Short quiz, visual dashboard, simple language, shareable story card |
| Young professionals | Practical actions that fit busy routines | One Lever recommendation and lightweight check-in habit |
| Urban individuals | Insight into commute, diet, shopping, and energy choices | Category breakdown highlights transport, food, energy, and consumption |
| Eco-conscious beginners | Guidance without judgment or jargon | Clear explanations, estimates, and one focused action |
| Climate-curious users | A starting point for personal awareness | Demo dashboard and real quiz make exploration low-friction |
| Hackathon/demo users | Fast understanding of product value | Clearly labeled demo mode and end-to-end user flow |
| Communities or groups | Simple awareness challenge concept | Sample leaderboard and challenge mechanics show group potential |

## 5. Product Vision

CarbonIQ can be framed as:

```txt
A personal carbon intelligence layer for everyday lifestyle decisions.
```

The long-term vision is not simply a better calculator. The opportunity is to help users build a personal climate awareness habit: understand their patterns, choose practical behavior changes, track progress, and share momentum with others.

### Mission statement

Help individuals turn carbon footprint awareness into one clear, personalized, trackable action.

### Vision statement

Make personal climate intelligence simple enough for everyday users and motivating enough to become a repeated behavior.

### Product philosophy

CarbonIQ follows a five-step product philosophy:

```txt
Measure -> Understand -> Act -> Track -> Share
```

- Measure: estimate lifestyle footprint through a short quiz.
- Understand: show category breakdown and biggest driver.
- Act: recommend one high-impact behavior.
- Track: turn the action into a challenge with check-ins and saved CO2.
- Share: create a Carbon Story card and caption that make progress visible.

## 6. Core Product Idea: The One Lever Principle

The One Lever principle is the heart of CarbonIQ.

Many climate products tell users to do everything: eat less meat, drive less, save electricity, recycle, buy less, fly less, reduce waste, and change appliances. The problem is that a list of ten recommendations can feel like no recommendation at all. Users may agree with the advice but still not act because the product has not helped them prioritize.

CarbonIQ makes a product decision: find the user's biggest estimated category and turn it into one concrete action.

### Why too many eco tips fail

- They create choice overload.
- They are rarely tied to the user's personal footprint.
- They make small and large actions look equally important.
- They do not naturally become a habit.
- They often feel like a lecture rather than guidance.

### Why one action works better

One action is easier to remember, easier to start, and easier to track. It gives the user a clear next step and lets the dashboard remain focused. The One Lever principle also creates a stronger story: "Your biggest category is transport, so your highest-impact action is to replace two car commutes per week."

### Before CarbonIQ

The user gets generic advice:

```txt
Eat less meat, drive less, save electricity, recycle, buy less, fly less...
```

### With CarbonIQ

The user gets one personalized action:

```txt
Your highest-impact category is transport.
Your One Lever is to replace two short car trips per week with public transport, walking, cycling, or carpooling.
```

### One Lever product flow

```txt
Quiz Answers
-> Footprint Breakdown
-> Largest Category Detection
-> AI One Lever Recommendation
-> Challenge Assignment
-> CO2 Savings Tracking
```

This is what differentiates CarbonIQ from a simple scorecard. It does not only calculate. It prioritizes.

## 7. Solution Overview

CarbonIQ works as a guided product experience from first impression to shareable output.

| Product Layer | Purpose | User Value |
| --- | --- | --- |
| Landing page | Explain the problem, solution, and One Lever idea | User understands why the product exists |
| Quiz | Collect lifestyle signals with low friction | User can generate a result quickly |
| Calculator | Estimate footprint and category breakdown | User sees annual/monthly footprint and biggest category |
| Dashboard | Organize results, budget, AI insight, and progress | User understands their footprint without being overloaded |
| AI One Lever | Generate one personalized high-impact recommendation | User gets a clear next action |
| Demo mode | Show product value immediately with sample data | Judges and users can preview without completing the quiz |
| Challenge | Convert recommendation into a repeatable action | User starts a habit loop |
| Check-in | Track streak and estimated saved CO2 | User gets progress feedback |
| Leaderboard | Add sample community motivation | User sees ranking by improvement |
| Story card | Create shareable proof of progress | User can communicate their action socially |
| Firebase Analytics | Track safe product-level interactions | Builder can learn which flow moments users reach without logging personal data |

## 8. Full User Journey

### First-time user journey

```txt
Visit Landing Page
-> Understand problem
-> Start Quiz
-> Enter name and lifestyle details
-> Submit quiz
-> View personalized dashboard
-> Read One Lever insight
-> Join challenge
-> Check in
-> View leaderboard
-> Generate story card
```

#### What the user sees

The user first sees a clean landing page with the message: "Understand your carbon footprint. Change one thing that matters." They see the One Lever preview and understand that the product is about prioritization, not guilt.

The quiz asks seven focused questions and captures an optional display name. After submission, the dashboard shows the user's estimated footprint, category breakdown, monthly budget, largest category, AI insight, community snapshot, and challenge progress.

#### What decision the user makes

The main decision is whether to turn the One Lever recommendation into a challenge. CarbonIQ makes that decision easier by keeping the call-to-action close to the insight.

#### Product value delivered

The user leaves with:

- an estimated footprint,
- a largest category,
- one personalized action,
- a way to track progress,
- a shareable story artifact.

### Returning user journey

```txt
Open app
-> localStorage restores state
-> View dashboard
-> Check progress
-> Continue challenge
-> Share story card
```

CarbonIQ currently uses localStorage rather than accounts or a backend database. This is appropriate for the frontend-first MVP because it preserves continuity without adding authentication friction.

### Demo user journey

```txt
Click View Demo Dashboard
-> See clearly labeled demo/sample data
-> Understand how dashboard works
-> Start real quiz
```

Demo mode is important because hackathon judges and first-time visitors may not want to complete a quiz before understanding the product. CarbonIQ solves that by offering sample data, while clearly labeling it as sample data so users do not mistake it for a real result.

## 9. Feature-by-Feature Product Breakdown

### 9.1 Landing Page

#### Purpose

The landing page explains CarbonIQ's product promise before asking the user to act.

#### What the user sees

- A clear hero: "Understand your carbon footprint. Change one thing that matters."
- Primary CTA: "Calculate Your CarbonIQ"
- Secondary CTA: "View Demo Dashboard"
- A note that demo mode uses sample data
- A One Lever preview card
- Problem explanation
- Five-step "How it works" section
- One Lever explanation
- Gemini/OpenRouter/Firebase positioning

#### Why it exists

The landing page is not a generic marketing screen. It establishes the product logic: climate advice is hard to prioritize, so CarbonIQ gives one personalized action.

#### How it supports the product goal

It frames the product around clarity, focus, and action before the quiz begins.

### 9.2 Carbon Quiz

#### Purpose

The quiz gathers enough lifestyle information to estimate a user's footprint without making onboarding feel heavy.

#### What the user sees

- Optional name input
- Progress indicator
- Seven lifestyle questions
- Previous, Next, and Home controls
- Clear validation if the user tries to continue without choosing an option
- Mobile-friendly answer cards

#### Why it exists

The quiz is the user's data entry point. It is intentionally short because the product is about awareness and action, not audit-grade measurement.

#### How it supports the product goal

It collects the signals needed for the calculator and AI insight while preserving momentum.

### 9.3 Personalized Dashboard

#### Purpose

The dashboard is the user's central carbon intelligence view.

#### What the user sees

- Personalized heading such as "Kaushik's CarbonIQ Dashboard" or "Your CarbonIQ Dashboard"
- Demo badge and sample-data banner when demo mode is active
- Annual footprint card
- Monthly footprint card
- Biggest category card
- One Lever savings card
- Category breakdown chart and percentages
- Largest category highlight
- Carbon budget and over/remaining explanation
- Visually dominant One Lever card
- Community snapshot with sample data
- Challenge progress panel

#### Why it exists

The dashboard translates raw quiz answers into a readable product story. It answers:

- How large is my estimated footprint?
- Which category matters most?
- What should I do first?
- How am I progressing?

### 9.4 AI One Lever Insight

#### Purpose

The AI layer helps personalize the One Lever recommendation.

#### What the user sees

- Provider badge: `AI: Gemini`, `AI: OpenRouter`, or `Fallback Insight`
- One primary action
- Estimated annual savings
- Explanation of why the action was selected
- Expandable "How this insight was generated" section
- Retry option
- Collapsible secondary tips

#### Why it matters

AI is used where it creates product value: turning a structured footprint estimate into a clearer recommendation. It is not used as an unstable open-ended chatbot. The insight remains scoped, explainable, and dashboard-safe.

### 9.5 Demo Mode

#### Purpose

Demo mode helps judges and visitors understand the product quickly.

#### What the user sees

- "View Demo Dashboard" CTA on the landing page
- "Demo Mode" badge
- "Sample Data" badge
- Banner: "You are viewing sample data. Start the quiz to calculate your own CarbonIQ."
- CTA: "Calculate My Real Footprint"

#### Why it exists

Hackathon reviewers often need to evaluate quickly. Demo mode lowers friction while preserving honesty through clear sample-data labeling.

### 9.6 Challenge and Check-in

#### Purpose

The challenge system converts insight into behavior.

#### What the user sees

- Active challenge based on the One Lever action
- Category label
- Joined date
- Streak
- Total CO2 saved
- Per-check-in savings
- Estimated monthly impact
- Check-in button
- Duplicate same-day protection
- Recent activity list

#### Why it exists

Climate behavior change needs a habit loop. Check-ins give the user a simple way to say, "I did the action today," and see progress grow.

### 9.7 Leaderboard

#### Purpose

The leaderboard adds community motivation without requiring a backend.

#### What the user sees

- "Sample Community Leaderboard" label
- Seeded sample users
- Current user highlighted
- Ranking by total CO2 saved
- User rank, total saved, and streak summary

#### Why ranking by saved CO2 matters

Ranking by lowest footprint can punish users who start with higher footprints. CarbonIQ ranks by improvement instead, which better matches the product's behavior-change goal.

### 9.8 Carbon Story Card

#### Purpose

The Carbon Story card turns progress into a shareable artifact.

#### What the user sees

- User name or "Your" fallback
- CO2 saved
- Streak
- Leaderboard rank
- Annual footprint estimate
- One Lever action
- Estimated impact
- CarbonIQ branding
- Live app URL
- Copy Caption
- Copy App Link
- Download Card as Image

#### Why it exists

Social sharing can turn private awareness into public motivation. CarbonIQ avoids complex social integrations and instead provides a clean downloadable card and caption.

## 10. Product Differentiation

| Normal Carbon Calculator | CarbonIQ |
| --- | --- |
| Often stops at a footprint number | Turns the number into one action |
| Gives generic advice | Selects a personalized One Lever based on the largest category |
| Can feel technical or audit-like | Uses friendly estimated awareness language |
| Lacks behavior tracking | Adds challenge, check-in, streak, and saved CO2 |
| Has no community layer | Adds a clearly labeled sample leaderboard |
| Has no shareable output | Generates a Carbon Story card |
| May fail if AI fails | Uses Gemini, OpenRouter, then static fallback |
| Often feels like a report | Feels like an action-oriented product flow |

CarbonIQ is different because it is designed around the moment after the calculation. The important question is not only "What is my footprint?" It is "What should I do next?"

## 11. AI Product Layer

CarbonIQ uses AI as a recommendation layer, not as the whole product.

The core product already has deterministic structure:

- quiz answers,
- footprint calculator,
- category breakdown,
- largest category detection,
- fallback insight logic.

AI improves the experience by generating a more personalized One Lever action and explanation from the user's quiz data and calculated footprint.

### Provider chain

```txt
User Quiz Data
-> Carbon Breakdown
-> AI Insight Request
-> Gemini Attempt
-> OpenRouter Fallback if Gemini Fails
-> Static Fallback if all providers fail
-> Dashboard-safe One Lever Insight
```

### Gemini primary

Gemini is the primary AI provider. This aligns the product with the Google ecosystem and the Firebase-hosted deployment story.

### OpenRouter fallback

During testing, Gemini may return free-tier quota or rate-limit errors. CarbonIQ handles this by falling back to OpenRouter, keeping the user experience stable.

### Static fallback

If both AI providers fail, CarbonIQ still returns a deterministic insight based on the largest footprint category. This is important for a hackathon demo because the dashboard must never be blocked by external AI availability.

### Provider badge transparency

The dashboard shows whether the insight came from Gemini, OpenRouter, or fallback logic. This improves trust because users can see how the recommendation was generated.

## 12. Google/Firebase-First Build Story

CarbonIQ uses Firebase Hosting as its deployment layer. This is a good fit for the current architecture because the app is a static Vite frontend.

```txt
pnpm build -> dist -> Firebase Hosting
```

Firebase Hosting was selected because it provides:

- fast deployment,
- reliable static hosting,
- a public live URL,
- Google ecosystem alignment,
- simple production build flow,
- good fit for hackathon delivery.

CarbonIQ also uses a Gemini-first AI strategy. The product is honest about its current frontend-first shape: it does not use Firebase Authentication, Firestore, Cloud Functions, or Cloud Run yet. It uses localStorage for MVP persistence.

This makes the project lightweight and demo-ready while leaving a clear production path:

```txt
Frontend MVP today
-> Firebase Functions or Cloud Run AI proxy later
-> Database-backed community progress later
```

## 13. Data and State at Product Level

CarbonIQ stores product state locally so users can refresh and continue the demo without accounts.

| Data Area | What It Represents | Why It Matters |
| --- | --- | --- |
| User profile | Optional display name and creation time | Personalizes dashboard, challenge, leaderboard, and story card |
| Quiz answers | Lifestyle inputs across commute, diet, energy, shopping, travel, and preference | Powers footprint estimate and AI insight |
| Footprint breakdown | Annual/monthly CO2, category totals, percentages, biggest category, budget | Makes carbon awareness concrete |
| AI insight | One Lever action, savings estimate, explanation, provider source | Converts data into personalized guidance |
| Challenge | Active One Lever action, streak, saved CO2, per-check-in savings | Turns recommendation into a habit loop |
| Check-ins | Daily completion records | Prevents duplicates and tracks progress |
| Leaderboard entries | Seeded sample users plus current user | Demonstrates community motivation |
| Story card data | Saved CO2, annual footprint, action, rank, caption, filename | Supports sharing and demo storytelling |
| Demo mode flag | Whether sample dashboard is active | Keeps demo data clearly labeled |

## 14. UX and Design Philosophy

CarbonIQ is designed to feel clear, friendly, and action-oriented. It avoids guilt-heavy messaging and avoids making climate action feel like a homework assignment.

### Core UX decisions

- Short onboarding instead of a long audit form.
- A clear dashboard instead of a dense report.
- One Lever focus instead of many tips.
- Persistent navigation so users never feel trapped.
- Demo transparency so sample data is never misleading.
- Mobile-first spacing and tap targets.
- Story card as a social-ready output.
- Progress feedback through check-ins, streaks, and saved CO2.

### Emotional UX goal

Users should feel:

- informed,
- not guilty,
- guided,
- motivated,
- capable of taking one action.

### Practical UX goal

Users should be able to:

- calculate quickly,
- understand their result,
- take action,
- track progress,
- share outcome.

## 15. Accessibility and Usability

CarbonIQ includes accessibility-conscious product decisions:

- Buttons use semantic button elements.
- Navigation is visible and keyboard-usable.
- Mobile icon navigation includes accessible labels.
- Quiz validation messages are clear.
- The chart is supported by text summaries and percentages.
- Tap targets are large enough for phone use.
- Important states are not represented only through color.
- Demo/sample labeling appears in text, not just styling.
- The dashboard explains estimates rather than presenting them as exact measurements.

This matters because climate awareness should be accessible to beginners, not only technical users or sustainability experts.

## 16. Demo Mode and Judge Experience

Demo mode is one of the most important hackathon-facing features.

It exists because judges need to understand the product quickly. If every reviewer must complete a quiz before seeing the dashboard, the product risks losing attention before showing its strongest value. Demo mode solves that by providing a realistic sample dashboard while clearly labeling it as sample data.

### Ideal judge walkthrough

```txt
1. Open live URL
2. Read landing hero/problem
3. Click View Demo Dashboard
4. Observe labeled sample dashboard
5. Click Calculate My Real Footprint
6. Complete quiz
7. View personalized dashboard
8. Read AI One Lever
9. Join challenge/check in
10. Open leaderboard
11. Generate story card
```

### What judges should notice

- The product explains the problem before showing controls.
- Demo mode is useful but transparent.
- The dashboard has meaningful depth without becoming crowded.
- The AI provider badge makes the AI layer visible.
- The One Lever card is the main product moment.
- Challenge and story card features turn the app from calculator into behavior product.

## 17. Build Journey and Product Evolution

CarbonIQ started as a fast hackathon MVP and then evolved through a product-hardening pass.

The first version established the core idea: a carbon quiz, estimated footprint, AI insight, challenge flow, leaderboard, and story card. The next phase focused on making the app feel like a polished product instead of a generated prototype.

Key product improvements included:

- navigation and Home controls so users never feel trapped,
- previous-question quiz support,
- clear demo mode labeling,
- user name personalization,
- richer dashboard summary and budget explanation,
- visible AI provider status,
- expandable insight explanation,
- community sample snapshot,
- challenge progress panel,
- polished story card and social caption,
- safe Firebase Analytics event tracking for demo, quiz, dashboard, challenge, leaderboard, and story-card interactions,
- mobile responsiveness improvements,
- tests for the key business logic,
- Firebase Hosting deployment.

This evolution matters because the product moved from "functional demo" to "submission-ready MVP."

## 18. Challenges and Product Decisions

| Challenge | Decision | Reason |
| --- | --- | --- |
| Limited hackathon time | Keep architecture frontend-first | Faster build and deployment with fewer moving parts |
| Need for personalized insight | Use Gemini first, OpenRouter second, static fallback third | Makes AI useful but resilient |
| Gemini quota risk | Hide raw errors and fall back gracefully | Protects user experience during demos |
| No backend database | Use localStorage | Keeps MVP simple and avoids auth friction |
| Need for demo data | Add clearly labeled demo mode | Helps judges preview quickly without misleading users |
| Avoid chatbot instability | Use scoped One Lever insight instead of open chat | Keeps AI focused and predictable |
| Social sharing complexity | Create story card, caption, and app-link copy | Delivers sharing value without social API risk |
| Fair leaderboard logic | Rank by CO2 saved, not lowest footprint | Rewards improvement rather than starting advantage |

## 19. Limitations

CarbonIQ is intentionally honest about its current MVP limits.

- It is a frontend-only MVP.
- Persistence is localStorage-based, not account-based.
- Vite environment variables are exposed in the browser bundle.
- Gemini may hit free-tier quota or rate-limit errors.
- The leaderboard and community metrics are seeded sample data.
- The carbon model is approximate and designed for awareness, not audit-grade reporting.
- Real community features would require backend persistence, authentication, and database logic.
- A production AI architecture should move provider calls to Firebase Functions, Cloud Run, or another trusted backend.

These limitations are not failures of the MVP. They are responsible boundaries for a frontend-first hackathon product.

## 20. Future Roadmap

### Near-term improvements

- Move AI calls behind Firebase Functions or Cloud Run.
- Add backend persistence for users and check-ins.
- Add optional authentication.
- Improve the carbon model with region-specific factors.
- Add more One Lever challenge types.
- Expand analytics into deeper funnel reporting while keeping the no-PII telemetry boundary.
- Improve share links and story-card templates.

### Medium-term improvements

- Community groups.
- School and college challenges.
- Team leaderboards.
- Monthly progress history.
- Richer preset AI coaching.
- Multilingual support.
- More education content around each category.

### Long-term vision

- A personal carbon intelligence platform.
- Integrations with mobility, energy, and spending data.
- Climate education layer for students and communities.
- Community climate action network.
- Personalized habit recommendations that evolve with user behavior.

## 21. Content Generation Base

### LinkedIn Post Angles

1. I built CarbonIQ for PromptWars: a carbon awareness app that recommends one action, not ten.
2. Why one climate action can be more useful than a list of generic eco tips.
3. Building a Gemini-first carbon footprint MVP with OpenRouter fallback.
4. How CarbonIQ turns carbon awareness into a habit loop.
5. From quiz to dashboard to challenge: designing a climate product flow in a hackathon.
6. Why demo mode matters for hackathon judging.
7. Building a Firebase-hosted sustainability MVP with React and TypeScript.
8. The One Lever principle: simplifying behavior change through product design.
9. What I learned hardening a generated MVP into a real product experience.
10. How a story card can make climate progress shareable.

### Medium / Dev.to Article Angles

1. Designing CarbonIQ: A One Lever carbon footprint awareness platform.
2. Building a Firebase-hosted React MVP for climate action.
3. How to design AI fallback chains for hackathon demos.
4. Why carbon calculators should not stop at the score.
5. Turning sustainability advice into behavior loops.
6. Product lessons from improving CarbonIQ after manual QA.
7. Building a shareable story card with React and html-to-image.
8. LocalStorage as a pragmatic MVP persistence layer.
9. Designing transparent demo mode for judges and users.
10. Gemini, OpenRouter, and static fallback: building resilient AI UX.

### Pitch Deck Slide Outline

1. Problem: climate advice is overwhelming and hard to prioritize.
2. Insight: users need one personalized high-impact action.
3. Solution: CarbonIQ estimates footprint and recommends a One Lever.
4. Product Flow: landing, quiz, dashboard, insight, challenge, leaderboard, story.
5. AI Layer: Gemini-first with OpenRouter and static fallback.
6. Demo: sample dashboard and real quiz walkthrough.
7. Architecture Light: Vite, React, TypeScript, Tailwind, Recharts, localStorage, Firebase.
8. User Value: clarity, action, progress, sharing.
9. Roadmap: backend AI proxy, persistence, groups, richer coaching.
10. Closing: CarbonIQ turns awareness into one action users can start today.

### Gemini Image Prompt Themes

- Carbon dashboard visualization with clean cards and category breakdown.
- User journey illustration from quiz to One Lever to story card.
- One Lever concept visual showing many tips simplified into one action.
- AI fallback architecture visual showing Gemini, OpenRouter, and static fallback.
- Firebase/Gemini deployment visual for a Google-first hackathon MVP.
- Shareable Carbon Story card mockup.
- Mobile-first climate awareness product screen set.
- Community challenge and leaderboard concept.

### Demo Video Script Outline

1. Open with the problem: people get too many eco tips and not enough clarity.
2. Show the landing page and One Lever preview.
3. Click View Demo Dashboard to show the full product quickly.
4. Point out Demo Mode and sample-data banner.
5. Start the real quiz and enter a name.
6. Complete the quiz and show the personalized dashboard.
7. Highlight the largest category and carbon budget.
8. Show the AI provider badge and One Lever explanation.
9. Join the challenge and check in.
10. Open leaderboard and story card.
11. End with the product thesis: one clear action is easier to start than ten generic tips.

## 22. Visual Storytelling Guide

CarbonIQ should be described visually as clean, modern, green, data-focused, friendly, and action-oriented.

### Landing page visual feel

The landing page feels like a calm climate product, not a dense report. It uses green and teal tones, rounded sections, clear CTAs, and a preview card that makes the One Lever idea tangible.

### Quiz visual feel

The quiz is centered, focused, and low-friction. Answer cards are large enough for mobile users. Progress is visible, and navigation is simple.

### Dashboard visual feel

The dashboard is the product's intelligence layer. It combines summary cards, category breakdown, budget progress, AI insight, and challenge status. It should feel like a personal climate cockpit, but not a corporate analytics dashboard.

### One Lever card visual feel

The One Lever card is visually dominant. It uses an emerald treatment, provider badge, clear action copy, and estimated savings chip. It should feel like the product's main recommendation moment.

### Challenge and leaderboard visual feel

The challenge view feels motivational and practical. The leaderboard is friendly and clearly labeled as sample community data.

### Story card visual feel

The story card feels social-share ready: compact metrics, CarbonIQ branding, One Lever action, app URL, and a clean caption.

### Overall brand mood

CarbonIQ should feel:

- clear,
- friendly,
- modern,
- optimistic,
- not guilt-heavy,
- not overly corporate,
- not overloaded with climate jargon.

## 23. Final Submission Narrative

### Short submission description

CarbonIQ is a personal carbon footprint awareness platform that helps individuals calculate an estimated lifestyle footprint, understand their biggest emission category, and act on one personalized high-impact recommendation. Built for PromptWars Virtual - Challenge 3, CarbonIQ uses the One Lever principle: instead of overwhelming users with generic eco tips, it identifies the category that matters most and turns it into a trackable challenge. Users can check in, build a streak, track estimated CO2 saved, compare progress on a sample leaderboard, and generate a shareable Carbon Story card. The app is deployed on Firebase Hosting and uses a Gemini-first AI flow with OpenRouter and static fallback resilience.

### Longer submission description

CarbonIQ is a frontend-first carbon footprint awareness platform designed to make climate action feel clear, personal, and actionable. The product begins with a short lifestyle quiz covering transport, diet, home energy, shopping, travel, and reduction preferences. From those answers, CarbonIQ calculates an estimated annual and monthly carbon footprint, shows a category breakdown, highlights the largest category, and creates a simple monthly carbon budget.

The core product idea is the One Lever principle. Many carbon tools stop at a score or overwhelm users with a list of generic tips. CarbonIQ instead identifies the user's biggest estimated category and recommends one high-impact action. The AI layer attempts Gemini first, then falls back to OpenRouter, then uses deterministic static logic if both providers fail. This keeps the experience resilient while still making AI visible through a provider badge and an explanation of how the insight was generated.

CarbonIQ then turns the recommendation into a behavior loop. Users can join the One Lever as a challenge, check in once per day, build a streak, and track estimated CO2 saved. A seeded sample leaderboard demonstrates community motivation while ranking users by improvement rather than lowest starting footprint. Finally, the Carbon Story card gives users a social-ready artifact with their action, savings, streak, rank, annual footprint estimate, CarbonIQ branding, live app URL, copy caption, and download support.

The product is deployed on Firebase Hosting under `carbon-iq-1994a` and is designed as a polished hackathon MVP: clear enough for non-technical users, credible enough for judges, and extensible enough for future backend, community, and AI coaching features.

### What makes CarbonIQ unique

- One Lever principle: one personalized action instead of many generic tips.
- AI is scoped to insight generation, not an unstable open-ended chatbot.
- Gemini-first AI chain with OpenRouter and static fallback resilience.
- Dashboard combines footprint, budget, category breakdown, AI insight, and progress.
- Challenge system turns recommendation into a habit loop.
- Leaderboard rewards CO2 saved rather than lowest footprint.
- Story card makes climate progress shareable.
- Demo mode is useful for judges and clearly labeled as sample data.

### Best demo path

- Open the live Firebase URL.
- Read the landing page hero and problem section.
- Click View Demo Dashboard.
- Observe Demo Mode, sample-data banner, category breakdown, budget, and One Lever card.
- Click Calculate My Real Footprint.
- Complete the quiz with a display name.
- View personalized dashboard and AI provider badge.
- Join the challenge and check in.
- Open leaderboard.
- Open story card and copy caption or download card.

### Technical/product highlights

- Vite, React, TypeScript, Tailwind CSS.
- Zustand state with localStorage persistence.
- Recharts category breakdown.
- Gemini primary, OpenRouter fallback, static fallback insight.
- Firebase Hosting deployment.
- Vitest coverage for calculator, AI parsing/fallback, challenge duplicate check-ins, leaderboard sorting, story data, demo mode, and profile helpers.

## 24. Mind Map

```txt
CarbonIQ
|-- Problem
|   |-- Users do not know highest-emission habits
|   |-- Generic eco tips overwhelm
|   |-- Carbon calculators stop at numbers
|   |-- Motivation needs progress loops
|
|-- Users
|   |-- Students
|   |-- Young professionals
|   |-- Urban individuals
|   |-- Eco-conscious beginners
|   |-- Climate-curious users
|   |-- Hackathon judges
|   |-- Community groups
|
|-- Product Flow
|   |-- Landing page
|   |-- Quiz and onboarding
|   |-- Personalized dashboard
|   |-- Carbon budget
|   |-- Category breakdown
|   |-- AI One Lever
|   |-- Challenge and check-in
|   |-- Leaderboard
|   |-- Story card
|
|-- One Lever Principle
|   |-- Detect biggest category
|   |-- Recommend one action
|   |-- Track as challenge
|   |-- Show saved CO2
|   |-- Make progress shareable
|
|-- AI Layer
|   |-- Gemini primary
|   |-- OpenRouter fallback
|   |-- Static fallback
|   |-- Provider badge
|   |-- Explanation section
|
|-- Dashboard
|   |-- Annual footprint
|   |-- Monthly footprint
|   |-- Biggest category
|   |-- Budget used
|   |-- Category percentages
|   |-- Community sample snapshot
|
|-- Challenge System
|   |-- Join One Lever
|   |-- Check in daily
|   |-- Duplicate protection
|   |-- Streak
|   |-- Saved CO2
|
|-- Story Card
|   |-- User name
|   |-- One Lever action
|   |-- Savings
|   |-- Streak
|   |-- Rank
|   |-- App URL
|   |-- Caption and PNG
|
|-- Deployment
|   |-- Vite build
|   |-- dist output
|   |-- Firebase Hosting
|   |-- Google ecosystem
|
|-- Content Strategy
|   |-- LinkedIn launch
|   |-- Medium article
|   |-- Dev.to article
|   |-- Demo video
|   |-- Pitch deck
|   |-- Image prompts
|
`-- Roadmap
    |-- Firebase Functions or Cloud Run AI proxy
    |-- Auth and backend persistence
    |-- Community groups
    |-- Richer carbon model
    |-- AI coaching
    `-- Personal carbon intelligence platform
```

## 25. Conclusion

CarbonIQ is a personal carbon footprint awareness platform that turns lifestyle data into one clear action. It matters because many people care about climate action but do not know which habit to change first. By using the One Lever principle, CarbonIQ avoids overwhelming users with generic advice and instead focuses attention on the category and action most likely to matter for that user.

The product combines a short quiz, estimated footprint calculator, personalized dashboard, AI-powered insight, challenge tracking, sample leaderboard, and shareable story card. Its AI layer is useful but resilient: Gemini is attempted first, OpenRouter provides fallback, and static logic protects the experience if both providers fail.

As a PromptWars Challenge 3 submission, CarbonIQ is strong because it addresses understanding, tracking, reduction, simple action, personalized insight, and demo readiness in one coherent flow. Beyond the hackathon, it has a clear path toward a larger product: a personal carbon intelligence layer that helps individuals and communities make climate action specific, motivating, and repeatable.
