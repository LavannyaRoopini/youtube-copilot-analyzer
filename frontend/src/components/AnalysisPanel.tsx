import React from 'react';
import { BookOpen, Tag, Zap, BarChart3 } from 'lucide-react';

interface AnalysisPanelProps {
  summary?: string;
  tags?: string[];
  mood?: string;
  difficulty?: string;
  isLoading?: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  summary,
  tags = [],
  mood,
  difficulty,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 space-y-4">
        <div className="h-6 bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded-lg w-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded-lg w-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded-lg w-2/3 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 space-y-6">
      {/* Summary */}
      {summary && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold text-white">Summary</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mood && (
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-yellow-400" />
              <span className="text-sm text-gray-400">Content Type</span>
            </div>
            <p className="text-white font-semibold capitalize">{mood}</p>
          </div>
        )}
        
        {difficulty && (
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-green-400" />
              <span className="text-sm text-gray-400">Difficulty</span>
            </div>
            <p className="text-white font-semibold capitalize">{difficulty}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold text-white">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
