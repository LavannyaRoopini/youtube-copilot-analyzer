import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze/:videoId" element={<Analyzer />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <footer className="bg-black bg-opacity-30 text-white text-center py-6 mt-16">
          <p>© 2024 YouTube Copilot Analyzer | Made with ❤️ by LavannyaRoopini</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
