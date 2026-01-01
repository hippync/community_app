# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 1. Project overview

- **Name:** Collaboro — plateforme québécoise qui transforme l'entraide en récompenses locales et réputation humaine.
- **Current scope:** Single-page promotional website (landing) built to explain the vision and collect manifestations of interest for a future pilot in Montréal.
- **Tech stack:** React 18 + TypeScript, Vite, Tailwind CSS, Lucide icons, Supabase (for persisting contact/interest submissions).
- **Key business flows implemented in code:**
  - Marketing/vision pages for: accueil, fonctionnement, communauté, sécurité.
  - "Rejoindre" (join) flow that validates a minimal form, rate-limits submissions, and records entries in Supabase.
- **Extended blueprint:** The `plan/workspace.md` file contains a detailed, job-oriented blueprint for how product, design, engineering, marketing, testing/QA, and studio ops should collaborate around Collaboro. Use it as the source of truth for new flows, pilots, and safety/privacy work.

## 2. Development commands

All commands are run from the repository root.

- **Install dependencies**
  - Local development: `npm install`
  - CI-style clean install (matches GitHub Actions): `npm ci`

- **Run the dev server**
  - `npm run dev`
  - Starts the Vite dev server for the React app.

- **Build for production**
  - `npm run build`
  - Creates an optimized production bundle (used in CI build verification).

- **Preview the production build locally**
  - `npm run preview`
  - Serves the built assets so you can validate the production bundle locally.

- **Linting (ESLint)**
  - `npm run lint`
  - Runs ESLint over the whole project using the config implied by `@eslint/js`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.

- **Type checking (TypeScript)**
  - `npm run typecheck`
  - Uses `tsc --noEmit -p tsconfig.app.json` to perform a full project type check.
  - In CI, an additional `npx tsc --noEmit` check runs (see `.github/workflows/ci.yml`), so keep both passing.

- **Tests**
  - There is currently **no test script** defined in `package.json` and no test runner configured. If you add a testing setup (e.g. Vitest/Jest), document the commands for running the full suite and an individual test here.

## 3. Runtime configuration & Supabase

The only dynamic backend integration currently implemented is the Supabase client used by the "Rejoindre" form.

- Supabase client configuration: `src/lib/supabaseClient.ts`
  - Expects the following Vite environment variables to be defined at build/runtime:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
  - If either is missing, the app throws at startup to avoid silently running without persistence.

- Data model expectations (Supabase):
  - Table `manifestations_interet` with (at minimum) columns matching:
    - `first_name`, `email`, `role`, `quartier`, `motivation`, `created_at`.
  - A **unique constraint on `email`** is assumed (error code `23505` is mapped to the special `EMAIL_DUPLICATE` error in the service layer).
  - A view or table `manifestations_stats` is expected for future admin statistics.

- RLS considerations (from code comments):
  - Inserts into `manifestations_interet` are performed without a `select` because row-level security (RLS) is expected to block `SELECT` for anonymous users. Reads are reserved for future authenticated/admin flows.

If you work on the "Rejoindre" flow or add new features that rely on Supabase, keep these contracts in sync with the actual Supabase schema.

## 4. Frontend architecture

### 4.1 Entry point and application shell

- **Entry point:** `src/main.tsx`
  - Uses `createRoot` from `react-dom/client` to mount `<App />` into the `root` DOM element.
  - Wraps the tree in `React.StrictMode`.
- **Application shell & navigation:** `src/App.tsx`
  - Holds a `currentPage` string in local state (values like `"accueil"`, `"fonctionnement"`, `"communaute"`, `"securite"`, `"rejoindre"`).
  - Passes `currentPage` and `setCurrentPage` to `Navigation`.
  - Renders the active page component via a `switch` in `renderPage()`.
  - On each page change, `useEffect` triggers `window.scrollTo({ top: 0, behavior: 'smooth' })` to keep navigations feeling like section jumps in a single-page site.

This is a **simple internal state-based router**, not React Router. When adding new "pages", follow the existing pattern:

1. Add a new component under `src/pages`.
2. Add a new `id`/label entry in `src/components/Navigation.tsx`.
3. Extend the `switch` in `src/App.tsx` to handle the new page id.

### 4.2 Navigation & layout components

- **`src/components/Navigation.tsx`**
  - Provides the fixed top navigation bar with desktop and mobile layouts.
  - Uses `lucide-react` icons (`Menu`, `X`) and Tailwind classes for styling.
  - Maintains local `isMobileMenuOpen` state to show/hide the mobile menu.
  - Accepts `currentPage` and `onNavigate(pageId)` props from `App` and calls `onNavigate` when a nav item is clicked.

- **`src/components/Card.tsx`**
  - Core presentational primitive for structured content blocks.
  - Exports three components:
    - `Card` – generic container with a consistent rounded, elevated look, optional hover elevation.
    - `ImageCard` – card with a background image, gradient overlay, tags, and title/description overlaid at the bottom.
    - `IconCard` – card variant combining an icon block, title, and description with a colored header area.
  - These are reused across pages to maintain a coherent visual language.

- **Global styles:** `src/index.css`
  - Tailwind is used via `@tailwind base/components/utilities`.
  - Defines custom CSS variables for brand colors and utility classes such as `.card-modern`, `.btn-primary`, `.btn-secondary`, and `.tag`.
  - When extending the design system, prefer adding new utilities here rather than duplicating Tailwind class lists across components.

### 4.3 Page components

Page components live in `src/pages` and are mostly presentational, with content written in French to match the Québec focus.

- **`Accueil.tsx`** – hero section, high-level vision, quick "how it works" steps, and target personas. Accepts `onNavigate` and uses it to route deeper into the flow (e.g. towards "Fonctionnement" or "Rejoindre").
- **`Fonctionnement.tsx`** – step-by-step explanation of how Collaboro works for the three actor types. Provides a CTA to navigate to "Rejoindre".
- **`Communaute.tsx`** – community vision, illustrative testimonials, and projected impact metrics for the Montréal pilot.
- **`Securite.tsx`** – details on the trust and safety model (reputation system, safe exchange points, community rules, and consequences). Content mirrors the privacy/safety focus described in `plan/workspace.md`.
- **`Rejoindre.tsx`** – the only page with significant interactive logic:
  - Manages form state and validation errors for `firstName`, `email`, `role`, `quartier`, and `motivation`.
  - Calls `manifestationsService.create` on submit.
  - Shows a success screen after submission and surfaces specific error states (including duplicate emails and generic failures).

When changing copy or adding new sections, keep the French tone **chaleureux / communautaire / urbain** consistent with both the README and `plan/workspace.md`.

## 5. Data/service layer: manifestations d'intérêt

- **Service location:** `src/services/manifestations.ts`

### 5.1 Responsibilities

The `manifestationsService` centralizes all logic related to "manifestations d'intérêt" (expressions of interest to join the initiative):

1. **Input validation**
   - Ensures `firstName` length ≥ 2 characters.
   - Validates `email` with a basic regex and normalizes it to lowercase/trimmed.
   - Requires a non-empty `role` and `motivation` (≥ 20 characters after trimming).
   - Throws descriptive `Error` messages for invalid fields. `Rejoindre.tsx` treats these as generic failures; consider tightening the mapping between specific error messages and UI field errors if you evolve this logic.

2. **Client-side rate limiting**
   - Uses an in-memory `Map` keyed by normalized email address.
   - Enforces **one submission per minute per email** by comparing timestamps and throwing an error instructing the user to wait `N` seconds.
   - This is a UX guardrail only; it does not replace server-side rate limiting.

3. **Supabase integration**
   - Inserts a new row into the `manifestations_interet` table with mapped fields (`first_name`, `email`, `role`, `quartier`, `motivation`).
   - Does **not** call `.select()` after insert to avoid RLS issues for anonymous users.
   - Logs Supabase errors to the console with `code`, `message`, `details`, `hint` for debugging.
   - Interprets Postgres error code `23505` as a duplicate email and throws the sentinel `Error('EMAIL_DUPLICATE')`, which `Rejoindre.tsx` maps to a user-friendly message.

4. **Future admin/analytics APIs**
   - `getAll()` fetches all manifestations ordered by `created_at DESC` for an authenticated context.
   - `getStats()` reads from `manifestations_stats` for aggregate statistics; on error, it logs the error and returns `null` instead of throwing.

When adding new data-driven flows (e.g. dashboards, stats pages, admin tools), route them through this service layer instead of calling Supabase directly from components. This keeps validation, error handling, and rate limiting consistent.

## 6. Project blueprint and workflows (`plan/workspace.md`)

The `plan/workspace.md` file is a high-level operational blueprint for how Collaboro should be built and evolved. It introduces a **job-based, department-oriented structure** that is important for coordinating future work, including work done by agents.

Key concepts to be aware of:

- **Control tower** (`00-control-tower/*`):
  - Defines how incoming requests become tickets, how definitions of done (DoD) are standardized, and how releases are evaluated (go/no-go).

- **Departments** (01–06):
  - `01-product/` – MVP scope, trust/reputation specs, pilot planning.
  - `02-design/` – sitemap and flows, UI copy and microtexts, minimal design system.
  - `03-engineering/` – MVP architecture, reputation/points implementation, safe exchange points, privacy/Loi 25 basics.
  - `04-marketing/` – landing page conversion, partner outreach scripts, weekly growth loops.
  - `05-testing-qa/` – QA passes for MVP flows and release decision frameworks.
  - `06-studio-ops/` – lightweight partner agreements, initial privacy policy, safety guidelines for P2P exchanges.

- **Routing chains (flows)**
  - The bottom of `plan/workspace.md` documents reusable chains like:
    - New feature flow (from intake triage → product spec → design → engineering → QA → release).
    - Weekly growth loop.
    - Pilot partner flows.

When planning non-trivial changes (especially those touching trust/safety, privacy/Loi 25, or partner agreements), align your work with the relevant job files and flows described in `plan/workspace.md`. This ensures code changes stay consistent with the broader product and operational strategy.

## 7. CI pipeline

- GitHub Actions workflow: `.github/workflows/ci.yml`.
- Trigger: pull requests targeting `main`.
- Steps run on `ubuntu-latest` with Node.js 20:
  1. `npm ci` – clean dependency install.
  2. `npx tsc --noEmit` – TypeScript type check.
  3. `npm run lint` – ESLint.
  4. `npm run build` – build verification.

Agents should ensure these steps remain green when proposing or applying changes. On internal PRs (non-forks), a success comment is posted to indicate that quality checks passed and that Vercel will deploy a preview.
