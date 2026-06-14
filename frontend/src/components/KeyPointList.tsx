import React from 'react';
import { BookOpen, Clock, Award } from 'lucide-react';

interface KeyPoint {
  id: string;
  topic: string;
  timestamp: string;
  seconds: number;
  description: string;
  confidence: number;
}

interface KeyPointListProps {
  keyPoints: KeyPoint[];
  currentTime?: number;
  onKeyPointClick?: (seconds: number) => void;
}

const KeyPointList: React.FC<KeyPointListProps> = ({ keyPoints, currentTime = 0, onKeyPointClick }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen size={28} className="text-purple-400" />
        Key Points
      </h2>
      
      {keyPoints.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No key points extracted yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {keyPoints.map((point, index) => {
            const isNear = Math.abs(point.seconds - currentTime) < 5;
            const isPassed = point.seconds <= currentTime;
            
            return (
              <button
                key={point.id}
                onClick={() => onKeyPointClick?.(point.seconds)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-102 ${
                  isNear
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 ring-2 ring-yellow-400'
                    : isPassed
                    ? 'bg-gray-700 bg-opacity-50 border-l-4 border-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-purple-300">#{index + 1}</span>
                      <h3 className="text-lg font-bold text-white">{point.topic}</h3>
                      {point.confidence > 0.9 && (
                        <Award size={16} className="text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{point.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="flex items-center gap-1 text-purple-400 font-mono text-sm font-semibold">
                      <Clock size={16} />
                      {point.timestamp}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {(point.confidence * 100).toFixed(0)}% match
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KeyPointList;
