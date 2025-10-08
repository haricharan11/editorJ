# JOLT Editor Usage Guide

## Quick Start

The JOLT Editor is a Web Component that can be used in any HTML page or web application.

### Installation

```bash
npm install @jolt-editor/core
```

### Basic Usage

#### HTML Integration

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
    mode="edit"
    spec='[{"operation": "shift", "spec": {"name": "userName"}}]'
    input='{"name": "John Doe", "age": 30}'>
  </jolt-editor>
</body>
</html>
```

#### JavaScript Integration

```javascript
import { JoltEditor } from '@jolt-editor/core';

// Create element programmatically
const editor = document.createElement('jolt-editor');
editor.mode = 'test';
editor.spec = '[{"operation": "shift", "spec": {"input": "output"}}]';
editor.input = '{"input": "value"}';

document.body.appendChild(editor);

// Listen for changes
editor.addEventListener('jolt-change', (event) => {
  console.log('Spec changed:', event.detail.spec);
  console.log('Input changed:', event.detail.input);
  console.log('Output:', event.detail.output);
});
```

## Development Setup

### Running the Development Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will open your browser at http://localhost:3000 with the test page.

3. **Run with TypeScript watch mode:**
   ```bash
   npm run dev:full
   ```
   This runs both the Vite dev server and TypeScript type checking in watch mode.

### Development Scripts

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check:watch` - Run TypeScript in watch mode
- `npm run dev:full` - Run dev server and TypeScript watch together
- `npm run test:dev` - Run development server tests

## Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `'edit' \| 'test'` | `'edit'` | Editor mode (edit spec or test transformation) |
| `spec` | `string` | `''` | JOLT specification (JSON string) |
| `input` | `string` | `''` | Input JSON data |
| `output` | `string` | `''` | Output from transformation (read-only) |
| `autoTransform` | `boolean` | `false` | Auto-run transformation on changes |
| `readOnly` | `boolean` | `false` | Make editors read-only |
| `theme` | `'light' \| 'dark'` | `'light'` | Editor theme |
| `height` | `string` | `'500px'` | Component height |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `jolt-change` | `{spec, input, output}` | Fired when spec or input changes |
| `jolt-transform` | `{spec, input, output}` | Fired after transformation |
| `jolt-error` | `{error, source}` | Fired on validation/transform error |

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import '@jolt-editor/core';

function JoltEditorComponent({ spec, input, onTransform }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleTransform = (e) => {
      onTransform(e.detail);
    };

    editor.addEventListener('jolt-transform', handleTransform);
    return () => editor.removeEventListener('jolt-transform', handleTransform);
  }, [onTransform]);

  return (
    <jolt-editor 
      ref={editorRef}
      spec={spec}
      input={input}
      mode="test"
    />
  );
}
```

### Vue

```vue
<template>
  <jolt-editor 
    :spec="spec"
    :input="input"
    @jolt-transform="handleTransform"
  />
</template>

<script>
import '@jolt-editor/core';

export default {
  data() {
    return {
      spec: '[{"operation": "shift", "spec": {}}]',
      input: '{}'
    };
  },
  methods: {
    handleTransform(event) {
      console.log('Output:', event.detail.output);
    }
  }
};
</script>
```

### Angular

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import '@jolt-editor/core';

@Component({
  selector: 'app-jolt',
  template: `
    <jolt-editor 
      #editor
      [attr.spec]="spec"
      [attr.input]="input"
      (jolt-transform)="onTransform($event)"
    ></jolt-editor>
  `
})
export class JoltComponent implements AfterViewInit {
  @ViewChild('editor') editorRef!: ElementRef;
  
  spec = '[{"operation": "shift", "spec": {}}]';
  input = '{}';

  ngAfterViewInit() {
    const editor = this.editorRef.nativeElement;
    editor.addEventListener('jolt-transform', this.onTransform.bind(this));
  }

  onTransform(event: CustomEvent) {
    console.log('Output:', event.detail.output);
  }
}
```

## Hot Module Replacement (HMR)

During development, the component supports HMR for instant updates:

1. Make changes to the component source code
2. The browser will automatically update without full page reload
3. Component state is preserved when possible

To verify HMR is working, check the browser console for:
```
[DEV] Hot Module Replacement is enabled
[HMR] JoltEditor component updated
```

## TypeScript Support

The component includes full TypeScript definitions:

```typescript
import { 
  JoltEditor,
  JoltSpec,
  JoltInput,
  JoltOutput,
  JoltTransformResult,
  JoltEditorConfig,
  EditorMode
} from '@jolt-editor/core';

// Type-safe property access
const editor = document.querySelector<JoltEditor>('jolt-editor');
if (editor) {
  const mode: EditorMode = editor.mode;
  editor.spec = JSON.stringify(spec);
}
```

## Troubleshooting

### Component not rendering
- Ensure the custom element is registered: Check console for `[DEV] Custom element "jolt-editor" is registered`
- Verify the script is loaded as a module: `<script type="module">`

### TypeScript errors
- Run `npm run type-check` to identify issues
- Ensure `vite-env.d.ts` is present for HMR types

### HMR not working
- Check Vite server is running on port 3000
- Verify no firewall/proxy blocking WebSocket connections
- Look for HMR messages in browser console

## Examples

See the `index.html` file for a complete working example with interactive controls and multiple editor instances.