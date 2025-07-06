# State Manager
A simple light weight javaScript library for State Management.

## Installation

```bash
npm install state_manager
```

## Build Outputs

This library is built for multiple module systems:

- **CommonJS**: `dist/state_manager.cjs.js` - For Node.js and bundlers that use `require()`
- **ES Module**: `dist/state_manager.esm.js` - For modern bundlers and browsers that support ES modules
- **UMD**: `dist/state_manager.umd.js` - For direct browser usage via `<script>` tag

## Usage

### CommonJS
```javascript
const { Store } = require('state_manager');
```

### ES Modules
```javascript
import { Store } from 'state_manager';
```

### Browser (UMD)
```html
<script src="node_modules/state_manager/dist/state_manager.umd.js"></script>
<script>
  const { Store } = window.StateManager;
</script>
```

## How to use

### Basic Setup

1. **Install the package:**
   ```bash
   npm install state_manager
   ```

2. **Import and create a store:**
   ```javascript
   import { Store } from 'state_manager';
   
   const store = new Store({
     state: { count: 0, user: null },
     mutations: {
       increment: (state, data) => ({ count: state.count + (data || 1) }),
       setUser: (state, user) => ({ user })
     }
   });
   ```

### State Management

**Subscribe to state changes:**
```javascript
// Subscribe to a property
const unsubscribe = store.subscribe('count', (newValue) => {
  console.log('Count changed to:', newValue);
});

// Subscribe once (auto-unsubscribe after first call)
store.subscribeOnce('user', (user) => {
  console.log('User initialized:', user);
});

// Unsubscribe when done (prevents memory leaks)
unsubscribe();
```

**Update state via mutations:**
```javascript
// Use mutations for predictable state changes
store.commit('increment', 5);
store.commit('setUser', { name: 'John', id: 1 });
```

**Direct state access (triggers subscriptions):**
```javascript
// Direct assignment triggers reactive updates
store.state.count = 10;
store.state.user = { name: 'Jane', id: 2 };
```

### Advanced Features

**Batch updates for performance:**
```javascript
// Enable batch updates
const store = new Store({
  state: { items: [] },
  mutations: { /* ... */ },
  options: { batchUpdates: true }
});

// Multiple updates will be batched
for (let i = 0; i < 1000; i++) {
  store.state.items.push(i);
}
// All updates are published at once when batch is flushed
```

**Error handling:**
```javascript
// Mutations with error handling
const mutations = {
  safeUpdate: (state, data) => {
    try {
      // Your logic here
      return { newData: data };
    } catch (error) {
      console.error('Mutation failed:', error);
      return state; // Return unchanged state
    }
  }
};
```

**Memory management:**
```javascript
// Clear all subscriptions
store.clearSubscriptions();

// Clear subscriptions for specific property
store.clearSubscriptions('count');

// Get subscriber count
const count = store.getSubscriberCount('user');
```

## Example

```javascript
import { Store } from 'state_manager';

const initialState = {
  count: 0,
  user: null
};

const mutations = {
  increment(state, data) {
    return { count: state.count + (data || 1) };
  },
  setUser(state, user) {
    return { user };
  }
};

const store = new Store({
  state: initialState,
  mutations
});

// Subscribe to changes
store.events.subscribe('count', (newValue) => {
  console.log('Count changed to:', newValue);
});

// Use mutations
store.commit('increment', 5);
store.commit('setUser', { name: 'John' });

// Direct state access (triggers subscriptions)
store.state.count = 10;
```

## Development

```bash
# Build all formats
npm run build

# Watch mode
npm run watch

# Clean dist folder
npm run clean
```
