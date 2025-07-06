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

- Just clone or copy paste, totally your preference.
- replace values of state and mutations with your own.
- and you have a small store ready to be used anywhere.
- if you want to listen to a change in the value of a property in state, subscribe to the property name like store.events.subscribe(<'propertyName'>)
- if you want to change a property, write your desired mutation and use it via store.commit(<'propertyName'>, data)

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
