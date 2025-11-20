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
├── components/
│   ├── common/          # Reusable UI components
│   └── layout/          # Layout components (Header, Footer)
├── contexts/            # React contexts (Theme)
├── data/                # Mock data
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

## Mock Data

The application currently uses mock data for demonstration. To connect to a real backend:

1. Update the data fetching logic in pages to use React Query hooks
2. Replace mock data imports with API calls
3. The TypeScript types are already defined and ready to use

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
