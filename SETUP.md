# JOLT Editor - Complete Setup Guide

## System Requirements

### Prerequisites

Before setting up JOLT Editor, ensure you have the following installed:

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Java JDK** (version 8 or higher)
   - Required for JOLT transformations backend
   - Download from: https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`
   - Ensure `JAVA_HOME` environment variable is set

3. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

4. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

## Installation Steps

### Step 1: Clone or Download the Project

```bash
# Clone the repository
git clone https://github.com/your-org/jolt-editor.git
cd jolt-editor

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install:
- Frontend dependencies (Lit, Monaco Editor, etc.)
- Backend dependencies (Express, java-bridge, etc.)
- Development tools (Vite, TypeScript, testing libraries)

### Step 3: Download JOLT JAR File

The JOLT transformation engine requires the JOLT JAR file:

```bash
# Create the lib directory if it doesn't exist
mkdir -p middleware/lib

# Download the JOLT JAR (one of the following methods):

# Method 1: Using wget
wget https://repo1.maven.org/maven2/com/bazaarvoice/jolt/jolt-core/0.1.8/jolt-core-0.1.8.jar \
     -O middleware/lib/jolt-core-0.1.8.jar

# Method 2: Using curl
curl -L https://repo1.maven.org/maven2/com/bazaarvoice/jolt/jolt-core/0.1.8/jolt-core-0.1.8.jar \
     -o middleware/lib/jolt-core-0.1.8.jar

# Method 3: Manual download
# Visit: https://repo1.maven.org/maven2/com/bazaarvoice/jolt/jolt-core/0.1.8/
# Download: jolt-core-0.1.8.jar
# Place it in: middleware/lib/
```

### Step 4: Verify Java Installation

The backend uses Java through the `java-bridge` npm package. Verify Java is properly configured:

```bash
# Check Java version
java -version

# Check JAVA_HOME (Unix/Mac)
echo $JAVA_HOME

# Check JAVA_HOME (Windows)
echo %JAVA_HOME%

# If JAVA_HOME is not set, set it:
# Mac/Linux: Add to ~/.bashrc or ~/.zshrc
export JAVA_HOME=/path/to/java/home
export PATH=$JAVA_HOME/bin:$PATH

# Windows: Set through System Properties > Environment Variables
```

## Running the Application

### Development Mode (Full Stack)

To run both frontend and backend together:

```bash
# Start both frontend (port 3000) and backend (port 4001)
npm run dev
```

This command starts:
- **Frontend**: Vite dev server on http://localhost:3000
- **Backend**: Express server with JOLT API on http://localhost:4001

### Frontend Only

If you only need the UI without backend transformations:

```bash
# Start only the frontend dev server
npm run dev:frontend-only
```

Visit: http://localhost:3000

### Backend Only

To run just the API server:

```bash
# Navigate to the example server directory
cd examples/express-integration

# Start the Express server
node server.js
```

API will be available at: http://localhost:4001/api/jolt

### Production Build

```bash
# Build the frontend for production
npm run build

# The output will be in the dist/ directory
# You can serve it with any static file server
```

## Verification Steps

### 1. Check Frontend is Running

- Open http://localhost:3000 in your browser
- You should see the JOLT Editor interface
- Try switching between "Basic" and "Test" modes

### 2. Check Backend is Running

- Open http://localhost:4001/health in your browser
- You should see: `{"status":"ok","service":"jolt-editor-example"}`

### 3. Test API Endpoints

```bash
# Check JOLT operations endpoint
curl http://localhost:4001/api/jolt/operations

# Test transformation endpoint
curl -X POST http://localhost:4001/api/jolt/transform \
  -H "Content-Type: application/json" \
  -d '{
    "spec": [{"operation": "shift", "spec": {"name": "userName"}}],
    "input": {"name": "John Doe", "age": 30}
  }'
```

### 4. Test Full Integration

1. Open http://localhost:3000
2. Switch to "Test" mode
3. Enter a JOLT spec:
   ```json
   [
     {
       "operation": "shift",
       "spec": {
         "name": "user.fullName",
         "age": "user.age"
       }
     }
   ]
   ```
4. Enter input JSON:
   ```json
   {
     "name": "Jane Smith",
     "age": 25
   }
   ```
5. Click "Transform" button
6. You should see the transformed output

## Configuration

### Frontend Configuration

Edit `vite.config.ts` to modify:
- Development server port
- Build output directory
- Monaco Editor settings

### Backend Configuration

Edit `examples/express-integration/server.js` or create your own server with:

```javascript
import { joltMiddleware } from '@jolt-editor/core/middleware';

const middleware = await joltMiddleware({
  cache: true,           // Enable result caching
  cacheSize: 100,        // Number of cached results
  timeout: 30000,        // Transformation timeout in ms
  jvm: {
    heapSize: '512m'     // JVM heap size
  }
});

app.use('/api/jolt', middleware);
```

## Common Issues and Solutions

### Issue: Java Not Found

**Error**: `java-bridge is not installed or not properly configured`

**Solution**:
1. Ensure Java JDK is installed (not just JRE)
2. Set JAVA_HOME environment variable
3. Add Java bin directory to PATH
4. Restart terminal/IDE after setting environment variables

### Issue: JOLT JAR Not Found

**Error**: `JOLT JAR not found at middleware/lib/jolt-core-0.1.8.jar`

**Solution**:
1. Download the JAR file as described in Step 3
2. Verify file exists: `ls middleware/lib/`
3. Check file permissions are readable

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000` or `:::4001`

**Solution**:
```bash
# Find process using the port (Unix/Mac)
lsof -i :3000
lsof -i :4001

# Kill the process
kill -9 <PID>

# Or use different ports in configuration
```

### Issue: CORS Errors

**Error**: `Access to fetch at 'http://localhost:4001' from origin 'http://localhost:3000' has been blocked by CORS`

**Solution**:
1. Ensure backend server is running
2. Check CORS configuration in server.js includes your frontend URL
3. Clear browser cache and cookies

### Issue: Transformation Timeout

**Error**: `Transformation timeout exceeded`

**Solution**:
1. Increase timeout in middleware configuration
2. Increase JVM heap size for large transformations
3. Simplify complex JOLT specifications

### Issue: Memory Errors

**Error**: `OutOfMemoryError: Java heap space`

**Solution**:
```javascript
// Increase heap size in middleware config
joltMiddleware({
  jvm: {
    heapSize: '1024m'  // Increase from default 512m
  }
})
```

## Development Tools

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check

# Run in watch mode
npm run type-check:watch
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Debugging

1. **Frontend Debugging**:
   - Use browser DevTools
   - Add breakpoints in TypeScript files
   - Check console for errors and HMR messages

2. **Backend Debugging**:
   - Add `console.log` statements in server code
   - Use Node.js inspector: `node --inspect server.js`
   - Monitor JVM memory: Check server console for memory stats

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
- Check [USAGE.md](./USAGE.md) for detailed usage examples
- See [README.md](./README.md) for project overview
- Review example integration in `examples/express-integration/`

## Support

If you encounter issues not covered here:
1. Check existing issues: https://github.com/your-org/jolt-editor/issues
2. Review the documentation in the docs/ directory
3. Contact the development team

## License

MIT - See LICENSE file for details