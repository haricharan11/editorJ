# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JOLT Editor is a Web Component for authoring and testing JOLT transformation specifications, built with Lit and Monaco Editor. It's a framework-agnostic component that provides an IDE-like experience for working with JOLT transformations.

## Development Commands

### Frontend Commands
- `npm run dev` - Start BOTH frontend (port 3000) and backend (port 4001)
- `npm run dev:frontend-only` - Start only Vite frontend server on port 3000
- `npm run build` - Build for production (creates dist/)
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check:watch` - Run TypeScript in watch mode
- `npm run dev:full` - Run both type checking and dev server concurrently

### Backend Commands
- `npm run dev:server` - Start Express backend server on port 4001
- `node examples/express-integration/server.js` - Run backend directly

### Testing Commands
- `npm test` - Run all tests with Web Test Runner
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### API Testing
```bash
# Test transformation endpoint
curl -X POST http://localhost:4001/api/jolt/transform \
  -H "Content-Type: application/json" \
  -d '{"spec":[{"operation":"shift","spec":{"name":"output"}}],"input":{"name":"test"}}'

# Check health
curl http://localhost:4001/health

# Get available operations
curl http://localhost:4001/api/jolt/operations
```

**IMPORTANT**: Always save screenshots in the `/temp/screenshots/` directory.

When capturing screenshots with Playwright or any other tool:

- Use the path: `temp/screenshots/[descriptive-filename].png`
- Example: `npx playwright screenshot http://localhost:3040 temp/screenshots/dashboard-view.png`

This keeps the project root clean and organizes all visual assets in one location.

## File Structure

```
jolt-editor/
├── src/                # Frontend source code
│   ├── components/     # Web components
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript definitions
│   └── test/           # Test files
├── middleware/         # Backend middleware
│   ├── lib/            # Java JAR files (jolt-core-0.1.8.jar)
│   ├── index.mjs       # Middleware entry point
│   ├── jolt-service.mjs # JOLT Java bridge service
│   ├── jolt-transformer.mjs # Express middleware
│   └── security-middleware.mjs # Security handlers
├── examples/           # Example integrations
│   └── express-integration/
│       ├── server.js   # Example Express server
│       └── public/     # Static files
├── .agent-os/          # Agent OS configuration
├── dist/               # Build output (generated)
├── node_modules/       # Dependencies (generated)
└── temp/screenshots/   # All captured screenshots with file name starting with datetime, eg: 20250512_164659_myscreenshot. hence with date, time and then description all in file name
```

## Architecture

### Component Structure
The main web component is `<jolt-editor>` which provides two layout modes:
- **Basic Mode**: Single editor for JOLT spec authoring
- **Test Mode**: Three-panel layout with spec, input, and output editors

### Key Files
- `src/jolt-editor.ts` - Main web component with Monaco integration
- `src/components/jolt-layout-manager.ts` - Layout management component handling basic/test mode switching
- `src/utils/monaco-loader.ts` - Monaco Editor initialization and configuration utilities
- `src/types/index.ts` - TypeScript type definitions

### Monaco Editor Integration
The component uses Monaco Editor (VS Code's editor) for all text editing:
- Lazy-loaded from CDN to reduce bundle size
- JSON language support with syntax highlighting and validation
- Custom editor options for optimized JSON editing experience
- Separate instances for spec, input, and output editors

### Event System
The component emits custom events for host application integration:
- `spec-change` - Fired when JOLT spec changes
- `input-change` - Fired when input JSON changes
- `layout-mode-changed` - Fired when switching between basic/test modes

### Styling
- Uses CSS custom properties for theming
- Supports light/dark modes via `theme` attribute
- Responsive layout with grid system for test mode
- All styles scoped to component via Shadow DOM

## Testing Strategy
- Uses Web Test Runner with Playwright for cross-browser testing
- Tests run in real browsers (Chromium, Firefox, WebKit)
- Component tests use @open-wc/testing utilities
- Monaco editor mocking for unit tests

## Important Patterns

### Frontend Patterns
- Debounced change handlers (300ms) for editor content changes
- File upload limited to 5MB with JSON validation
- Editor layout recalculation on mode switches and window resize
- Error boundaries for Monaco initialization failures

### Backend Patterns
- Java Bridge initialization with lazy loading
- LRU cache for transformation results (100 items default)
- Memory monitoring with periodic GC (every 60 seconds)
- Error translation from Java exceptions to JavaScript errors
- Request validation and sanitization middleware

## Backend Architecture

### Java Integration
The backend uses `java-bridge` npm package to execute JOLT transformations:
- JVM is spawned as a child process
- JOLT JAR (jolt-core-0.1.8.jar) must be in middleware/lib/
- Configurable heap size (default 512MB)
- Automatic garbage collection when memory usage exceeds 80%

### API Endpoints
- `POST /api/jolt/transform` - Execute transformation with spec and input
- `POST /api/jolt/validate` - Validate JOLT specification
- `GET /api/jolt/operations` - List available JOLT operations
- `GET /api/jolt/health` - Service health and JVM stats

### Security Features
- Payload size limiting (10MB default)
- JSON depth validation to prevent DoS
- CORS configuration for cross-origin requests
- Content Security Policy headers
- Optional rate limiting

## Phase Development Status
Currently in Phase 1 (Core MVP) with completed:
- ✅ Lit Web Component setup
- ✅ Monaco Editor integration
- ✅ Basic and Test mode layouts
- ✅ JOLT runtime integration via Java Bridge
- ✅ Transformation execution with backend
- ✅ Error handling and display
- ✅ Security middleware

Next priorities (Phase 2):
- WebSocket support for real-time collaboration
- Visual JOLT builder
- Performance profiling tools
- Cloud deployment options