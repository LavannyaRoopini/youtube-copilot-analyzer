import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Film, History } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black bg-opacity-50 text-white backdrop-blur-md border-b border-purple-400 border-opacity-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-red-600 rounded-full p-2">
              <Youtube size={28} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold">YouTube Copilot</h1>
              <p className="text-xs text-gray-300">AI-Powered Video Analyzer</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
              <Film size={20} />
              <span className="hidden sm:inline">Analyze</span>
            </Link>
            <Link to="/history" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
              <History size={20} />
              <span className="hidden sm:inline">History</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
