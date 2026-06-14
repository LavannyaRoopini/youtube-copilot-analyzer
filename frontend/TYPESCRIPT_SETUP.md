/* TypeScript React Setup Guide */

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── KeyPointList.tsx
│   │   ├── AnalysisPanel.tsx
│   │   ├── URLInput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── VideoCard.tsx
│   ├── pages/               # Page-level components
│   │   ├── Home.tsx
│   │   ├── Analyzer.tsx
│   │   └── History.tsx
│   ├── services/            # API and business logic
│   │   └── api.ts
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
└── Dockerfile               # Docker configuration
```

## TypeScript Configuration

### Key Settings

- **target**: ES2020 - Modern JavaScript target
- **jsx**: react-jsx - Modern React JSX transform
- **strict**: true - Full type checking
- **paths**: @ alias for src directory
- **module**: ESNext - Modern module system

## Styling

### Tailwind CSS Classes

```tsx
// Background gradients
className="bg-gradient-to-br from-purple-600 to-indigo-900"

// Responsive design
className="md:grid-cols-2 lg:grid-cols-3"

// Dark mode
className="bg-gray-800 text-white"

// Animations
className="animate-spin"
className="animate-pulse"
className="transition-all duration-300"
```

## Component Patterns

### Functional Component with Props

```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

### Using Hooks

```typescript
const [state, setState] = React.useState<string>('');
const [data, setData] = React.useState<DataType | null>(null);

useEffect(() => {
  // Side effects
}, [dependencies]);
```

### Error Handling

```typescript
try {
  const response = await apiService.analyzeVideo(url);
  setData(response);
} catch (err: any) {
  setError(err.message || 'An error occurred');
}
```

## API Service Pattern

```typescript
class APIService {
  private client: AxiosInstance;

  async analyzeVideo(url: string) {
    const response = await this.client.post('/analyze', { url });
    return response.data;
  }
}
```

## Routing

```tsx
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/analyze/:videoId" element={<Analyzer />} />
  </Routes>
</Router>
```

## Build & Development

### Development Server
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Type Checking
```bash
tsc --noEmit
```
