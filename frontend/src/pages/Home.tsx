import React from 'react';
import { useNavigate } from 'react-router-dom';
import URLInput from '../components/URLInput';
import { Sparkles, Zap, Clock, BookOpen } from 'lucide-react';
import { apiService } from '../services/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.analyzeVideo(url);
      navigate(`/analyze/${response.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze video. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="inline-block">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-75 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            <h1 className="relative text-5xl md:text-6xl font-black text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="text-yellow-400" size={48} />
              YouTube Copilot
            </h1>
          </div>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Transform YouTube videos into interactive learning experiences with AI-powered analysis and clickable key points
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto">
        <URLInput onSubmit={handleAnalyze} isLoading={isLoading} error={error} />
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30 hover:border-opacity-100 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">AI Analysis</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Powered by advanced AI to understand and analyze video content instantly
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-indigo-500 border-opacity-30 hover:border-opacity-100 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Clickable Points</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Jump to any key point with interactive timestamps - no more searching
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-pink-500 border-opacity-30 hover:border-opacity-100 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-pink-600 rounded-lg">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Summaries</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Get concise summaries, tags, and difficulty levels for every video
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Paste YouTube URL</h3>
              <p className="text-gray-400">Simply paste any YouTube video link into the input box</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="text-white font-semibold mb-1">AI Analyzes Content</h3>
              <p className="text-gray-400">Our AI extracts the transcript and analyzes the video content</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Get Key Points</h3>
              <p className="text-gray-400">Receive interactive key points with timestamps</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Click & Jump</h3>
              <p className="text-gray-400">Click any key point to jump directly to that moment in the video</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-gray-300">Ready to transform your learning? Start analyzing videos now!</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
