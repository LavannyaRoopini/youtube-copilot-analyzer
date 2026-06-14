import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import KeyPointList from '../components/KeyPointList';
import AnalysisPanel from '../components/AnalysisPanel';
import LoadingSpinner from '../components/LoadingSpinner';
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

const Analyzer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTo, setSeekTo] = useState<number | undefined>(undefined);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (videoData?.status === 'processing' && pollCount < 60) {
      interval = setInterval(() => {
        if (videoId) {
          apiService.getVideo(videoId).then((data) => {
            setVideoData(data);
            setPollCount((prev) => prev + 1);
          });
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoData?.status, videoId, pollCount]);

  const fetchVideoData = async () => {
    if (!videoId) return;
    try {
      setIsLoading(true);
      const data = await apiService.getVideo(videoId);
      setVideoData(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load video data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPointClick = (seconds: number) => {
    setSeekTo(seconds);
  };

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))/,
      /(?:youtu\.be\/([a-zA-Z0-9_-]+))/,
      /(?:youtube\.com\/embed\/([a-zA-Z0-9_-]+))/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const getEmbedUrl = () => {
    const youtubeId = extractVideoId(videoData?.url || '');
    return `https://www.youtube.com/embed/${youtubeId}`;
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <LoadingSpinner message="Loading video analysis..." />
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-red-200 mb-4">{error || 'Video not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
            title="Share"
          >
            <Share2 size={20} />
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
            title="Download"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">{videoData.title}</h1>
        {videoData.description && (
          <p className="text-gray-400 line-clamp-3">{videoData.description}</p>
        )}
      </div>

      {/* Status */}
      {videoData.status === 'processing' && (
        <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <span className="text-blue-200">Analysis in progress... This may take a minute.</span>
        </div>
      )}

      {videoData.status === 'failed' && (
        <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded-lg p-4">
          <span className="text-red-200">Failed to analyze this video. Please try again.</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Video Player & Key Points */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div>
            <iframe
              width="100%"
              height="400"
              src={getEmbedUrl()}
              title={videoData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-2xl"
            ></iframe>
          </div>

          {/* Key Points */}
          <KeyPointList
            keyPoints={videoData.key_points || []}
            currentTime={currentTime}
            onKeyPointClick={handleKeyPointClick}
          />
        </div>

        {/* Right Column - Analysis Panel */}
        <div>
          <AnalysisPanel
            summary={videoData.analysis?.summary}
            tags={videoData.analysis?.tags}
            mood={videoData.analysis?.mood}
            difficulty={videoData.analysis?.difficulty}
            isLoading={videoData.status === 'processing'}
          />
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
