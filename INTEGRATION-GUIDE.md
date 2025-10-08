# JOLT Editor Integration Guide

## Keyboard Shortcuts Configuration

The JOLT Editor component includes keyboard shortcuts that can potentially conflict with parent applications. To prevent conflicts, we provide configuration options to control keyboard behavior.

### Default Behavior (Safe for Integration)

By default, the component:
- **Does NOT capture F1** - The browser's help will open normally
- **Uses scoped event listeners** - Only responds to events within the component
- **Prevents event bubbling** - Shortcuts won't interfere with parent app
- **Can be completely disabled** - All shortcuts can be turned off

### Configuration Options

```html
<!-- Safe integration with all shortcuts disabled -->
<jolt-editor
  disable-shortcuts="true"
  api-url="https://api.example.com">
</jolt-editor>

<!-- Enable F1 capture for help (use cautiously) -->
<jolt-editor
  capture-f1="true"
  api-url="https://api.example.com">
</jolt-editor>

<!-- Default safe configuration -->
<jolt-editor
  api-url="https://api.example.com">
</jolt-editor>
```

### Available Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `disable-shortcuts` | boolean | false | Disables ALL keyboard shortcuts |
| `capture-f1` | boolean | false | Captures F1 key for help (may conflict with browser) |

### Keyboard Shortcuts (when enabled)

| Shortcut | Action | Scope | Can Conflict? |
|----------|--------|-------|---------------|
| F1 | Toggle help | Component | Yes (disabled by default) |
| Ctrl/Cmd + Enter | Transform JSON | Component | No (scoped) |
| Ctrl/Cmd + Shift + M | Toggle layout | Component | No (scoped) |
| Ctrl/Cmd + F | Search in help | Help modal | No (scoped) |
| Escape | Close help | Help modal | No (scoped) |

### Preventing Conflicts

1. **For maximum safety**, disable all shortcuts:
   ```javascript
   const editor = document.querySelector('jolt-editor');
   editor.disableShortcuts = true;
   ```

2. **To handle shortcuts in parent app**:
   ```javascript
   // Parent app can intercept before component
   document.addEventListener('keydown', (e) => {
     if (e.key === 'F1') {
       e.stopPropagation(); // Prevent from reaching component
       // Handle F1 in parent app
     }
   }, true); // Use capture phase
   ```

3. **Programmatic control**:
   ```javascript
   const editor = document.querySelector('jolt-editor');

   // Temporarily disable during certain operations
   editor.disableShortcuts = true;
   performOperation();
   editor.disableShortcuts = false;
   ```

### Event Handling

All keyboard events are:
- **Scoped to component** - Only active when component has focus
- **Stop propagation** - Won't bubble to parent elements
- **Preventable** - Parent can intercept in capture phase

### Focus Management

The component:
- Sets `tabindex="0"` on main element for keyboard accessibility
- Only responds to events when focused or when event target is within component
- Properly manages focus for modal dialogs

### Best Practices for Integration

1. **Test shortcuts** in your application context
2. **Document any conflicts** for your users
3. **Consider disabling shortcuts** if your app has complex keyboard handling
4. **Use programmatic APIs** instead of relying on shortcuts:

```javascript
// Instead of relying on Ctrl+Enter
const editor = document.querySelector('jolt-editor');
await editor.handleTransform();

// Instead of F1
editor.showHelpModal();
```

### Accessibility Considerations

Even with shortcuts disabled, the component remains fully accessible:
- All functions available via buttons
- Proper ARIA labels and roles
- Tab navigation supported
- Screen reader compatible

### Example: Safe Integration in React

```jsx
function JoltEditorWrapper() {
  const editorRef = useRef(null);

  useEffect(() => {
    // Disable shortcuts in forms or complex UIs
    if (editorRef.current) {
      editorRef.current.disableShortcuts = true;
    }
  }, []);

  return (
    <jolt-editor
      ref={editorRef}
      api-url={API_URL}
      disable-shortcuts="true"
    />
  );
}
```

### Example: Safe Integration in Angular

```typescript
@Component({
  selector: 'app-jolt-wrapper',
  template: `
    <jolt-editor
      [attr.disable-shortcuts]="disableShortcuts"
      [attr.api-url]="apiUrl"
    ></jolt-editor>
  `
})
export class JoltWrapperComponent {
  disableShortcuts = true; // Safe by default
  apiUrl = environment.apiUrl;
}
```

## Troubleshooting

### Shortcuts not working
- Check if `disable-shortcuts` is set to `true`
- Ensure component has focus (click on it)
- Check browser console for errors

### F1 opens browser help instead of component help
- Set `capture-f1="true"` attribute
- Note: This may prevent browser help from opening

### Conflicts with parent app shortcuts
- Set `disable-shortcuts="true"`
- Use programmatic API methods instead
- Implement custom keyboard handling in parent

## Support

For issues or questions about integration, please refer to the [GitHub repository](https://github.com/your-org/jolt-editor).