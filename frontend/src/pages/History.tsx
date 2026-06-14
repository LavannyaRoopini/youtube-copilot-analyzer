import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { apiService } from '../services/api';

interface VideoData {
  id: string;
  url: string;
  title: string;
  description: string;
  duration: number;
  status: string;
  key_points: any[];
  analysis: any;
  created_at: string;
  updated_at: string;
}

const History: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.listVideos();
      setVideos(response.items || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter((video) => {
    if (filter === 'completed') return video.status === 'completed';
    if (filter === 'processing') return video.status === 'processing';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 rounded-lg">
            <Clock size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Analysis History</h1>
            <p className="text-gray-400">Your previously analyzed videos</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {[
          { id: 'all', label: 'All Videos' },
          { id: 'completed', label: 'Completed' },
          { id: 'processing', label: 'Processing' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
              filter === btn.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400">Loading history...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 p-4 bg-red-900 bg-opacity-30 border border-red-600 rounded-lg">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Clock size={48} className="mx-auto text-gray-500" />
          <h2 className="text-2xl font-bold text-gray-300">No videos found</h2>
          <p className="text-gray-500">Start by analyzing a YouTube video to build your history</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              description={video.description}
              duration={video.duration}
              status={video.status}
              keyPointCount={video.key_points?.length || 0}
              createdAt={video.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
