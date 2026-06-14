# Frontend Installation & Setup

## Prerequisites

- Node.js 16+ (https://nodejs.org/)
- npm 8+ or yarn

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx       # Navigation header
│   ├── VideoPlayer.tsx  # Embedded player component
│   ├── KeyPointList.tsx # Interactive key points
│   ├── AnalysisPanel.tsx # AI analysis results
│   ├── URLInput.tsx     # Video URL input form
│   ├── LoadingSpinner.tsx # Loading state
│   └── VideoCard.tsx    # History card component
├── pages/               # Full-page components
│   ├── Home.tsx         # Landing page
│   ├── Analyzer.tsx     # Video analysis page
│   └── History.tsx      # Video history page
├── services/            # API and utilities
│   └── api.ts           # API service with Axios
├── App.tsx              # Main app router
└── index.tsx            # React entry point
```

## Available Scripts

### `npm start`
Start development server with HMR

### `npm run build`
Create optimized production build

### `npm test`
Run test suite

### `npm run lint`
Lint code with ESLint

## Key Technologies

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS
- **React Router v6**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Lucide React**: Icon library
- **Vite**: Fast build tool

## Component Hierarchy

```
App
├── Header
├── Home
│   └── URLInput
├── Analyzer
│   ├── VideoPlayer
│   ├── KeyPointList
│   └── AnalysisPanel
├── History
│   └── VideoCard
└── Footer
```

## API Integration

The frontend communicates with the backend API:

```typescript
// Analyze a video
await apiService.analyzeVideo('https://youtube.com/...');

// Get video details
await apiService.getVideo(videoId);

// List all videos
await apiService.listVideos(skip, limit);

// Check analysis status
await apiService.checkStatus(videoId);
```

## Styling

Tailwind CSS utilities for styling:

- **Colors**: bg-purple-600, text-white, etc.
- **Spacing**: p-4, m-2, gap-3, etc.
- **Responsive**: md:, lg:, xl: breakpoints
- **Animations**: animate-spin, animate-pulse
- **Transitions**: transition-all, duration-300

## Type Safety

All components are fully typed:

```typescript
interface VideoData {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  key_points: KeyPoint[];
}

const MyComponent: React.FC<Props> = (props) => {
  // Type-safe props
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port already in use
```bash
npm start -- --port 3001
```

### Clear node_modules and cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection issues
Check that backend is running on `http://localhost:8000`
Update `REACT_APP_API_URL` in `.env.local`

## Production Build

```bash
npm run build
serve -s build
```

Production build is optimized and minified.

## Docker Support

```bash
docker build -t youtube-analyzer-frontend .
docker run -p 3000:3000 youtube-analyzer-frontend
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. ✅ Open http://localhost:3000
4. ✅ Test video analysis feature
5. ✅ Build for production
