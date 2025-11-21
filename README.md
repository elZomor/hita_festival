# Arab Festival Archive

A comprehensive, bilingual (Arabic/English) web application dedicated to the Arab Festival at the Higher Institute of Theatrical Arts in Cairo.

## Features

### 🎭 Core Functionality
- **Festival Archive**: Browse festival editions by year with detailed show information
- **Show Details**: View comprehensive show information with external booking integration
- **Critical Articles**: Read and filter theatrical criticism and analysis
- **Symposia**: Access critical symposia discussions and summaries
- **Student Creativity**: Platform for student creative contributions

### 🌐 Localization
- **Bilingual Support**: Full Arabic (RTL) and English (LTR) support
- **Dynamic Direction**: Automatic text direction switching
- **Default Language**: Arabic
- **Persistent Selection**: Language preference saved in localStorage

### 🎨 Design
- **Theme**: Theatre-inspired design with dark/light mode
- **Colors**: Deep red curtain, warm gold highlights, black stage aesthetic
- **Responsive**: Mobile-first design up to desktop
- **Animations**: Subtle hover effects, smooth transitions, micro-interactions

### ⚡ Technical Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **React Query** for data fetching
- **i18next** for internationalization
- **Tailwind CSS** for styling
- **Vite** for build tooling

## Project Structure

```
src/
├── api/                # React Query client + resource hooks
├── components/
│   ├── common/          # Reusable UI components
│   └── layout/          # Layout components (Header, Footer)
├── contexts/            # React contexts (Theme)
├── features/            # Feature-specific components
│   └── festival/        # Festival-related components
├── i18n/                # Localization files
│   └── locales/         # Translation files (ar.json, en.json)
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── App.tsx              # Main app component
```

## Routes

- `/` - Home page
- `/festival` - Festival editions list
- `/festival/:year` - Specific festival edition
- `/festival/:year/shows/:slug` - Show detail page
- `/articles` - Articles listing
- `/articles/:slug` - Article detail
- `/symposia` - Symposia listing
- `/symposia/:id` - Symposium detail
- `/creativity` - Student creativity hub
- `/about` - About page

## Mock API

- Development data originally lived under `public/api/*.json`, but you can now point `VITE_API_BASE_URL` to the live backend (default: `http://localhost:8005`).
- The festivals listing already consumes `GET /hita_arab_festival/festivals`, mapping the BE response into the UI-friendly `FestivalEdition` type.
- Other resources still read from the local JSON mocks; migrate them gradually by updating `src/api/hooks.ts`.

## API Utility

- `src/api/reactQueryClient.ts` centralizes access to backend endpoints through a reusable `ReactQueryApiClient`.
- Configure the base URL via `VITE_API_BASE_URL`; relative paths fall back to Vite's dev proxy if unset.
- The helper exposes typed `useQuery` / `useMutation` builders, `buildQueryKey`, and `withQueryParams` helpers to keep React Query usage consistent across features.
- `src/api/hooks.ts` wraps common resources (festival editions, shows, articles, symposia, creativity submissions) so pages can stay declarative and only worry about presentation.

```ts
import { apiQueryClient, withQueryParams } from './api/reactQueryClient';
import type { FestivalEdition, Show } from './types';

export const useFestivalEditions = () =>
  apiQueryClient.useQuery<FestivalEdition[]>({
    queryKey: ['festivalEditions'],
    path: '/festival-editions',
  });

export const useShowBySlug = (year: number, slug?: string) =>
  apiQueryClient.useQuery<Show | undefined>({
    queryKey: ['show', year, slug],
    path: () => withQueryParams(`/festival/${year}/shows`, { slug }),
    enabled: () => Boolean(slug),
  });
```

## Color Palette

- **Theatre Black**: `#0a0a0a`
- **Theatre Red**: `#8B1538`
- **Theatre Gold**: `#C9A962`
- **Theatre Cream**: `#F5F1E8`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features Implementation

### Booking Integration
Shows include an external booking URL that opens in a new tab when users click "احجز تذكرتك" / "Book Your Ticket"

### Filtering
- Festival shows: Filter by date, venue, and country
- Articles: Filter by year, show, and type

### Tabs Navigation
Festival edition pages include tabbed navigation for:
- Shows (العروض)
- Critical Articles (المقالات النقدية)
- Symposia (الندوات)
- Student Creativity (إبداع الطلاب)

### Student Submissions
The creativity page includes a frontend-only submission form that demonstrates the UI for future backend integration.

## Accessibility

- Semantic HTML throughout
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- RTL support for Arabic content
- High contrast ratios for readability

## Future Enhancements

- Connect to Supabase backend
- Add search functionality
- Implement media galleries for shows
- Add video/audio embeds for symposia
- Enable real student submission processing
- Add social sharing features
- Implement user authentication for submissions
