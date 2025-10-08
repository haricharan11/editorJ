# JOLT Editor

A full-stack Web Component for authoring and testing JOLT transformation specifications, featuring a Monaco-powered frontend and Java-based backend for executing transformations.

## Overview

JOLT Editor provides a complete IDE-like experience for working with JOLT (JSON Language for Transform) specifications. It combines a responsive web interface built with Lit and Monaco Editor with a robust backend service that executes JOLT transformations through a Java bridge.

## Architecture

The system consists of two main components:
- **Frontend**: Web Component with Monaco Editor for authoring JOLT specs
- **Backend**: Express server with Java integration for executing transformations

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Features

- 🎯 **Monaco-Powered Editing** - VS Code's editor engine with IntelliSense and multi-cursor support
- ⚡ **Real-time Transformation** - Execute JOLT transformations with sub-300ms response time
- 🔍 **Schema Validation** - JSON Schema support for spec and input validation
- 🎨 **Themeable Interface** - Light/dark modes with CSS custom properties
- 📦 **Framework-Agnostic** - Web Component works with any framework
- 🧪 **Dual Modes** - Basic (spec-only) and Test (with input/output panels)
- 🚀 **Performance Optimized** - LRU caching and JVM memory management
- 🔒 **Security Features** - Input validation, rate limiting, and CSP headers

## Prerequisites

Before installing, ensure you have:
- **Node.js** v18.0.0 or higher
- **Java JDK** 8 or higher (required for JOLT transformations)
- **npm** (comes with Node.js)

## Quick Start

### 1. Install the package

```bash
npm install @jolt-editor/core
```

### 2. Set up the backend

```bash
# Download required JOLT JAR
mkdir -p middleware/lib
curl -L https://repo1.maven.org/maven2/com/bazaarvoice/jolt/jolt-core/0.1.8/jolt-core-0.1.8.jar \
     -o middleware/lib/jolt-core-0.1.8.jar
```

### 3. Start the development servers

```bash
# Start both frontend (port 3000) and backend (port 4001)
npm run dev
```

### 4. Open the application

Visit http://localhost:3000 to see the JOLT Editor interface.

### 5. Test a transformation

Use this sample JOLT spec:
```json
[
  {
    "operation": "shift",
    "spec": {
      "name": "user.fullName",
      "email": "user.contact.email"
    }
  }
]
```

With this input:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

## Usage

### HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@jolt-editor/core';
  </script>
</head>
<body>
  <jolt-editor
    mode="test"
    spec='[{"operation": "shift", "spec": {"name": "userName"}}]'
    input='{"name": "John Doe"}'>
  </jolt-editor>
</body>
</html>
```

### JavaScript Integration

```javascript
import { JoltEditor } from '@jolt-editor/core';

const editor = document.createElement('jolt-editor');
editor.mode = 'test';
editor.spec = '[{"operation": "shift", "spec": {}}]';

// Listen for transformation results
editor.addEventListener('jolt-transform', (event) => {
  console.log('Output:', event.detail.output);
});

document.body.appendChild(editor);
```

## API Endpoints

The backend provides these REST endpoints:

- `POST /api/jolt/transform` - Execute JOLT transformation
- `POST /api/jolt/validate` - Validate JOLT specification
- `GET /api/jolt/operations` - List available JOLT operations
- `GET /api/jolt/health` - Service health check

## Documentation

- [SETUP.md](./SETUP.md) - Complete installation and setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design
- [USAGE.md](./USAGE.md) - Detailed usage examples
- [CLAUDE.md](./CLAUDE.md) - Development guidelines for Claude AI

## Project Structure

```
jolt-editor/
├── src/                 # Frontend source code
│   ├── components/      # Web components
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript definitions
├── middleware/          # Backend middleware
│   ├── lib/             # Java JAR files
│   └── *.mjs            # Node.js modules
├── examples/            # Example integrations
│   └── express-integration/
├── dist/                # Build output
└── docs/                # Documentation
```

## Development Commands

```bash
# Development
npm run dev              # Start frontend and backend
npm run dev:frontend-only # Frontend only (port 3000)
npm run build           # Build for production

# Testing
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Type Checking
npm run type-check      # Check TypeScript types
npm run type-check:watch # Watch mode for type checking
```

## Troubleshooting

### Common Issues

1. **Java Not Found**: Ensure Java JDK is installed and JAVA_HOME is set
2. **Port Already in Use**: Kill existing processes or use different ports
3. **JOLT JAR Missing**: Download the JAR file as shown in setup
4. **CORS Errors**: Check backend is running and CORS is configured

For detailed troubleshooting, see [SETUP.md](./SETUP.md#common-issues-and-solutions).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- [GitHub Issues](https://github.com/your-org/jolt-editor/issues)
- [Documentation](./docs/)
- [Examples](./examples/)

## License

MIT