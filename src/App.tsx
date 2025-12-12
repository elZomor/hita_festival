import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './components/layout';
import {
  Home,
  FestivalList,
  FestivalEdition,
  ShowDetail,
  About,
  ComingSoon,
  Articles,
  ArticleDetail,
  Symposia,
  SymposiumDetail,
  Creativity,
  CreativityDetail,
} from './pages';
import './i18n';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/festival" element={<FestivalList />} />
              <Route path="/festival/:festivalSlug" element={<FestivalEdition />} />
              <Route path="/festival/:festivalSlug/shows/:slug" element={<ShowDetail />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/symposia" element={<Symposia />} />
              <Route path="/symposia/:slug" element={<SymposiumDetail />} />
              <Route path="/creativity" element={<Creativity />} />
              <Route path="/creativity/:slug" element={<CreativityDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
