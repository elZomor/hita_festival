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
              <Route path="/festival/:year" element={<FestivalEdition />} />
              <Route path="/festival/:year/shows/:slug" element={<ShowDetail />} />
              <Route path="/articles" element={<ComingSoon />} />
              <Route path="/articles/:slug" element={<ComingSoon />} />
              <Route path="/symposia" element={<ComingSoon />} />
              <Route path="/symposia/:id" element={<ComingSoon />} />
              <Route path="/creativity" element={<ComingSoon />} />
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
