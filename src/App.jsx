import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import PracticePage from './pages/PracticePage';
import DiscoverPage from './pages/DiscoverPage';
import LibraryPage from './pages/LibraryPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path="/" element={<Navigate to="/practice" replace />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
