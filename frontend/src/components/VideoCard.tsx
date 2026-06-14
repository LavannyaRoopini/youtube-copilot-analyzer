import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Clock, Zap } from 'lucide-react';

interface VideoCardProps {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  status: string;
  keyPointCount?: number;
  createdAt: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  description,
  duration,
  status,
  keyPointCount = 0,
  createdAt
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const statusColors: Record<string, string> = {
    completed: 'bg-green-600',
    processing: 'bg-yellow-600',
    pending: 'bg-blue-600',
    failed: 'bg-red-600'
  };

  return (
    <Link to={`/analyze/${id}`}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-700 hover:border-purple-500">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white line-clamp-2 flex-1">{title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[status] || 'bg-gray-600'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700">
            <div className="flex items-center gap-4">
              {duration && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatDuration(duration)}</span>
                </div>
              )}
              {status === 'completed' && (
                <div className="flex items-center gap-1">
                  <Zap size={14} />
                  <span>{keyPointCount} points</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={14} />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Footer action */}
          <div className="pt-2 border-t border-gray-700 flex items-center gap-2 text-purple-400 group">
            <Play size={16} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">View Analysis</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
