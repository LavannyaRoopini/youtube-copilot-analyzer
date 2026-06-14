import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Processing video...',
  subMessage
}) => {
  const steps = [
    'Fetching transcript...',
    'Analyzing with AI...',
    'Extracting key points...',
    'Finalizing analysis...'
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-purple-600 animate-spin"></div>
        <Loader size={32} className="absolute inset-0 m-auto text-purple-400 animate-pulse" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">{message}</h3>
        <p className="text-gray-400">{subMessage || steps[currentStep]}</p>
      </div>

      <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-1000"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      <div className="text-sm text-gray-400">
        {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default LoadingSpinner;
