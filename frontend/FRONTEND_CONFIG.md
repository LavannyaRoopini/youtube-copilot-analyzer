# Frontend Configuration Files

## tailwind.config.js

Tailwind CSS configuration with custom theme extensions:
- Custom purple and indigo color palettes
- Custom animations (spin, pulse, bounce)
- Glow shadow effects
- Gradient utilities

## tsconfig.json

TypeScript compiler options:
- ES2020 target with modern JavaScript features
- Strict type checking enabled
- React JSX support
- Path aliases (@/* for src directory)
- Source maps for debugging

## tsconfig.node.json

Separate TypeScript configuration for Node.js tools (Vite).

## vite.config.ts

Vite build configuration:
- React plugin support
- Path aliases
- Dev server with proxy to backend
- Optimized production builds
- Code splitting for vendors
- Terser minification

## Features

✅ **Type Safety**: Full TypeScript strict mode
✅ **Styling**: Tailwind CSS with custom extensions
✅ **Build**: Vite for fast development and production builds
✅ **Routing**: React Router v6
✅ **API**: Axios with interceptors
✅ **Components**: React 18 functional components
✅ **Development**: Source maps and HMR (Hot Module Replacement)
