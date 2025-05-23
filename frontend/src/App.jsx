import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VideoPage from './pages/VideoPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <DashboardPage />
              </>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <>
                <Navbar />
                <VideoPage />
              </>
            }
          />
          <Route
            path="/analytics"
            element={
              <>
                <Navbar />
                <AnalyticsPage />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;