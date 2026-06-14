import React, { useState } from 'react';
import { Youtube, Send, AlertCircle } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  error?: string;
}

const URLInput: React.FC<URLInputProps> = ({ onSubmit, isLoading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  const isValidYouTubeUrl = (urlString: string) => {
    try {
      const patterns = [
        /youtube\.com\/watch\?v=/,
        /youtu\.be\//,
        /youtube\.com\/embed\//
      ];
      return patterns.some(pattern => pattern.test(urlString));
    } catch {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600">
            <Youtube size={24} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here... (youtube.com/watch?v=... or youtu.be/...)"
            className="w-full pl-14 pr-14 py-4 rounded-lg bg-gray-800 border-2 border-gray-700 focus:border-purple-500 text-white placeholder-gray-500 transition-colors focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            title="Analyze video"
          >
            {isLoading ? (
              <div className="animate-spin">
                <Send size={20} />
              </div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-900 bg-opacity-30 border border-red-600 rounded-lg">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {url && !isValidYouTubeUrl(url) && (
          <div className="flex items-start gap-2 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
            <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200 text-sm">Please enter a valid YouTube URL</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default URLInput;
