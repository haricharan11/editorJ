# JOLT Editor - System Architecture

## Overview

JOLT Editor is a full-stack web application that provides a browser-based IDE for creating and testing JOLT JSON transformation specifications. The system consists of a frontend Web Component built with Lit and Monaco Editor, and a backend Node.js/Express server that executes JOLT transformations using Java through a bridge interface.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Browser                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    JOLT Editor Web Component                │    │
│  │                                                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │    │
│  │  │   Monaco    │  │   Monaco    │  │   Monaco    │       │    │
│  │  │   Editor    │  │   Editor    │  │   Editor    │       │    │
│  │  │   (Spec)    │  │   (Input)   │  │  (Output)   │       │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────┐     │    │
│  │  │          Layout Manager & Event System           │     │    │
│  │  └──────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│                              │ HTTP/REST API                        │
│                              │ Port 3000 (Dev)                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                              ▼                                       │
│                     Express Server (Port 4001)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    API Layer (/api/jolt/*)                 │    │
│  │                                                             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │Transform │  │ Validate │  │Operations│  │  Health  │  │    │
│  │  │ Endpoint │  │ Endpoint │  │ Endpoint │  │ Endpoint │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                     JOLT Middleware Layer                   │    │
│  │                                                             │    │
│  │  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐  │    │
│  │  │   Security    │  │  Rate Limiter  │  │  LRU Cache   │  │    │
│  │  │   Middleware  │  │   (Optional)   │  │ (100 items)  │  │    │
│  │  └───────────────┘  └────────────────┘  └──────────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                      JOLT Service Layer                     │    │
│  │                                                             │    │
│  │  ┌────────────────────────────────────────────────────┐   │    │
│  │  │               Java Bridge (java-bridge)              │   │    │
│  │  │                                                      │   │    │
│  │  │  - JVM Process Management                           │   │    │
│  │  │  - Memory Management (GC, Heap monitoring)          │   │    │
│  │  │  - Java ↔ JavaScript Type Conversion               │   │    │
│  │  └────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                              ▼                                       │
│                      Java Virtual Machine (JVM)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    JOLT Core Library                        │    │
│  │                  (jolt-core-0.1.8.jar)                     │    │
│  │                                                             │    │
│  │  - Chainr (Multi-operation transformer)                    │    │
│  │  - Shiftr (Structure shifting)                             │    │
│  │  - Defaultr (Default values)                               │    │
│  │  - Removr (Field removal)                                  │    │
│  │  - Cardinality (Array/Object conversion)                   │    │
│  │  - Sortr (Sorting operations)                              │    │
│  │  - Modify operations (Beta features)                       │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└───────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Components

#### 1. Web Component (`<jolt-editor>`)
- **File**: `src/jolt-editor.ts`
- **Purpose**: Main custom element that encapsulates the entire editor
- **Responsibilities**:
  - Initialize and manage Monaco Editor instances
  - Handle component lifecycle (connectedCallback, disconnectedCallback)
  - Manage component properties and attributes
  - Dispatch custom events to parent application

#### 2. Layout Manager
- **File**: `src/components/jolt-layout-manager.ts`
- **Purpose**: Manage different editor layouts
- **Modes**:
  - **Basic Mode**: Single editor for JOLT spec authoring
  - **Test Mode**: Three-panel layout (spec, input, output)
- **Features**:
  - Responsive grid layout
  - Panel resizing and visibility control
  - Mode switching animations

#### 3. Monaco Editor Integration
- **File**: `src/utils/monaco-loader.ts`
- **Purpose**: Lazy load and configure Monaco Editor
- **Configuration**:
  - JSON language support with syntax highlighting
  - Custom JSON schemas for JOLT validation
  - Editor themes (light/dark)
  - Performance optimizations

#### 4. Event System
- **Custom Events**:
  - `spec-change`: Fired when JOLT specification changes
  - `input-change`: Fired when input JSON changes
  - `transform-request`: Request transformation execution
  - `transform-complete`: Transformation result ready
  - `validation-error`: Validation errors occurred
  - `layout-mode-changed`: Editor layout mode switched

### Backend Components

#### 1. Express Server
- **File**: `examples/express-integration/server.js`
- **Port**: 4001 (configurable)
- **Features**:
  - CORS configuration for cross-origin requests
  - JSON body parsing with size limits
  - Static file serving for web component
  - Error handling middleware

#### 2. JOLT Middleware
- **File**: `middleware/jolt-transformer.mjs`
- **Purpose**: Express middleware factory for JOLT operations
- **Endpoints**:
  ```
  POST /api/jolt/transform  - Execute JOLT transformation
  POST /api/jolt/validate   - Validate JOLT specification
  GET  /api/jolt/operations - List available JOLT operations
  GET  /api/jolt/health     - Service health check
  ```

#### 3. Security Middleware
- **File**: `middleware/security-middleware.mjs`
- **Features**:
  - Request size limiting (default 10MB)
  - Content Security Policy (CSP) headers
  - Input sanitization and validation
  - JSON depth limiting to prevent DoS
  - Rate limiting (optional)

#### 4. JOLT Service
- **File**: `middleware/jolt-service.mjs`
- **Purpose**: Core service for JOLT transformations
- **Features**:
  - JVM lifecycle management
  - Java-JavaScript type conversion
  - Memory management and garbage collection
  - Error translation and handling
  - Result caching with LRU strategy

#### 5. Java Bridge
- **Package**: `java-bridge`
- **Purpose**: Node.js to Java interoperability
- **Capabilities**:
  - JVM process spawning and management
  - Java class loading and instantiation
  - Method invocation with type marshalling
  - Asynchronous and synchronous operations

## Data Flow

### 1. Transformation Request Flow

```
User Input → Web Component → HTTP POST → Express Server
    ↓                                           ↓
Monaco Editor                            Security Check
    ↓                                           ↓
Validation                              JOLT Middleware
    ↓                                           ↓
Event Dispatch                          Cache Lookup
                                               ↓
                                        JOLT Service
                                               ↓
                                        Java Bridge
                                               ↓
                                           JVM/JOLT
                                               ↓
                                        Transformation
                                               ↓
                                        Cache Store
                                               ↓
                                        HTTP Response
                                               ↓
                                        Web Component
                                               ↓
                                        Output Display
```

### 2. API Request/Response Format

#### Transform Request
```json
POST /api/jolt/transform
{
  "spec": [
    {
      "operation": "shift",
      "spec": {
        "input.path": "output.path"
      }
    }
  ],
  "input": {
    "input": { "path": "value" }
  }
}
```

#### Transform Response
```json
{
  "success": true,
  "output": {
    "output": { "path": "value" }
  },
  "executionTime": 45,
  "cached": false
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Invalid JOLT specification",
    "type": "ValidationError",
    "details": "..."
  }
}
```

## Memory Management

### JVM Configuration
- **Heap Size**: Configurable (default 512MB)
- **Garbage Collection**: G1GC with 200ms max pause
- **String Deduplication**: Enabled for memory efficiency
- **Monitoring**: Periodic memory checks every 60 seconds

### Cache Strategy
- **Type**: LRU (Least Recently Used)
- **Size**: 100 items (configurable)
- **TTL**: No expiration (memory-based eviction)
- **Key**: Hash of spec + input JSON

## Security Considerations

### Input Validation
- JSON schema validation for spec and input
- Maximum payload size enforcement
- JSON depth limiting to prevent stack overflow
- Special character escaping

### CORS Configuration
- Configurable allowed origins
- Credentials support
- Preflight request handling

### Rate Limiting (Optional)
- Per-IP request limiting
- Sliding window algorithm
- Configurable limits and windows

### Content Security Policy
- Script-src restrictions
- Frame-ancestors limitations
- XSS protection headers

## Performance Optimizations

### Frontend
- Monaco Editor lazy loading
- Debounced change handlers (300ms)
- Virtual DOM updates with Lit
- CSS containment for rendering optimization

### Backend
- LRU cache for repeated transformations
- Connection pooling for JVM communication
- Asynchronous request handling
- Memory monitoring and proactive GC

## Deployment Architecture

### Development
```
Developer Machine
├── Frontend Dev Server (Vite) - Port 3000
├── Backend API Server (Express) - Port 4001
└── JVM Process (JOLT)
```

### Production
```
Load Balancer
├── Static Assets (CDN)
│   └── Web Component Bundle
└── API Servers (Multiple Instances)
    ├── Node.js Process
    └── JVM Process
```

### Docker Deployment (Recommended)
```yaml
services:
  frontend:
    image: nginx:alpine
    volumes:
      - ./dist:/usr/share/nginx/html
    ports:
      - "80:80"

  backend:
    image: node:18-openjdk-slim
    volumes:
      - ./middleware:/app
    ports:
      - "4001:4001"
    environment:
      - JAVA_OPTS=-Xmx1g
```

## Monitoring and Observability

### Health Checks
- `/api/jolt/health` - Service availability
- JVM memory statistics
- Transform count metrics
- Cache hit ratio

### Logging
- Request/response logging
- Transformation metrics
- Error tracking
- JVM GC events

### Metrics to Monitor
- Response times (P50, P95, P99)
- Memory usage (Node.js and JVM)
- Cache hit rate
- Error rate by type
- Active connections

## Technology Stack

### Frontend
- **Lit 3.x**: Web Components framework
- **Monaco Editor**: VS Code's editor engine
- **TypeScript 5.x**: Type safety and tooling
- **Vite 6.x**: Build tool and dev server
- **Material Web Components**: UI components

### Backend
- **Node.js 18+**: JavaScript runtime
- **Express 4.x**: Web application framework
- **java-bridge**: Java interoperability
- **LRU Cache**: Caching implementation
- **CORS**: Cross-origin resource sharing

### Java/JOLT
- **Java 8+**: Runtime environment
- **JOLT 0.1.8**: JSON transformation library
- **Maven**: Dependency management

### Development Tools
- **Web Test Runner**: Component testing
- **Playwright**: Cross-browser testing
- **TypeScript**: Static typing
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Extension Points

### Adding New JOLT Operations
1. Update JOLT JAR to version with new operations
2. Update `getOperations()` in jolt-service.mjs
3. Add operation documentation
4. Update frontend validation schemas

### Custom Middleware
```javascript
// Add custom middleware before JOLT middleware
app.use('/api/jolt', customAuthMiddleware, joltMiddleware);
```

### Frontend Customization
```javascript
// Extend the web component
class CustomJoltEditor extends JoltEditor {
  // Add custom functionality
}
customElements.define('custom-jolt-editor', CustomJoltEditor);
```

## Future Enhancements

### Planned Features
- WebSocket support for real-time collaboration
- Cloud function deployment for serverless execution
- Visual JOLT builder with drag-and-drop
- Integration with data pipeline tools
- Performance profiling and optimization hints

### Scalability Improvements
- Redis cache for distributed deployments
- Kubernetes operator for auto-scaling
- GraphQL API alternative
- WebAssembly JOLT implementation

## References

- [JOLT Documentation](https://github.com/bazaarvoice/jolt)
- [Lit Documentation](https://lit.dev/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/)
- [Express.js Guide](https://expressjs.com/)
- [Java Bridge Documentation](https://github.com/joeferner/node-java)