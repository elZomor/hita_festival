# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (Vite, default port 5173)
npm run build        # Production build (runs tsc + vite build)
npm run preview      # Preview production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking without emitting
```

No test framework is configured in this project.

## Environment

Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:8005
```

The backend is a Django REST API. All requests go to `/hita_arab_festival/` endpoints.

## Architecture

### API Layer (`src/api/`)

- **`reactQueryClient.ts`** — Core `ReactQueryApiClient` class + `useApiQuery`/`useApiMutation` hooks. Automatically converts snake_case ↔ camelCase between backend and frontend. The singleton `apiQueryClient` is exported for direct use.
- **`hooks.ts`** — All data-fetching hooks. Each hook maps raw API types to frontend types via dedicated `map*` functions. Key hooks: `useFestivalEditions`, `useFestivalEditionById`, `useShows`, `useShow`, `useArticles`, `useSymposia`, `useCreativityEntries`, `useComments`, `useReserveShow`, `useSubmitComment`.

### Data Flow

Backend returns paginated responses `{ count, results[], totalPages, currentPage, next, previous }`. The `select` option in each `useApiQuery` call extracts and transforms `results` into frontend types. The `DetailEntry` type (`src/types/index.ts`) is a recursive structure used for complex structured fields (cast, crew, awards, organizing team).

### Routing

Shows are accessed via `/shows/:pk` where `pk` is the show's numeric ID (not a slug). Festival editions use `/festival/:festivalSlug` where `festivalSlug` is the festival's string ID from the backend.

### Internationalization

- Default language: Arabic (`ar`), stored in `localStorage`
- RTL/LTR direction is toggled automatically based on selected language
- Translation files: `src/i18n/locales/ar.json` and `en.json`
- A custom post-processor (`numbersPostProcessor`) converts Western digits to Arabic numerals when `lng === 'ar'`
- Use `useTranslation()` hook from `react-i18next` in components

### Theming

`ThemeContext` provides dark/light mode. Theme colors are defined in `tailwind.config.js` as custom tokens: `theatre-black` (#0a0a0a), `theatre-red` (#8B1538), `theatre-gold` (#C9A962), `theatre-cream` (#F5F1E8).

### Key Patterns

- **Adding a new API hook**: Define API response type, write a `map*` function, export a `useApiQuery` call in `hooks.ts` using `buildQueryKey`, `withQueryParams`, and the `select` option.
- **Articles/Symposia/Creativity** all share `ArticleApiResult` from the same `/hita_arab_festival/articles` endpoint, differentiated by `?type=ARTICLE|SYMPOSIA|CREATIVITY`.
- **`DetailEntry[]`** fields (cast, crew, notes, awards, extraDetails) come from polymorphic API fields that can be JSON strings, arrays, or plain strings — the `mapStructuredField` / `parseStructuredField` helpers handle all formats.
- Page components in `src/pages/` that have sub-tabs (e.g. `ShowDetail`, `FestivalEdition`) delegate to sub-components in `src/pages/show-detail/` and `src/pages/festival-detail/`.
