// Example usage for different module systems

// CommonJS usage
const { Store } = require('../dist/state_manager.cjs.js');

// ES Module usage
// import { Store } from '../dist/state_manager.esm.js';

// Browser usage (UMD)
// <script src="../dist/state_manager.umd.js"></script>
// Then use: window.StateManager.Store

// Example state and mutations
const initialState = {
  count: 0,
  user: null,
  todos: []
};

const mutations = {
  increment(state, data) {
    return { count: state.count + (data || 1) };
  },
  decrement(state, data) {
    return { count: state.count - (data || 1) };
  },
  setUser(state, user) {
    return { user };
  },
  addTodo(state, todo) {
    return { todos: [...state.todos, todo] };
  },
  removeTodo(state, index) {
    const newTodos = [...state.todos];
    newTodos.splice(index, 1);
    return { todos: newTodos };
  }
};

// Create store instance with batch updates enabled
const store = new Store({
  state: initialState,
  mutations,
  options: {
    batchUpdates: true // Enable batching for better performance
  }
});

// Subscribe to state changes with automatic cleanup
const unsubscribeCount = store.subscribe('count', (newValue) => {
  console.log('Count changed to:', newValue);
});

const unsubscribeUser = store.subscribe('user', (newValue) => {
  console.log('User changed to:', newValue);
});

// Subscribe once (auto-unsubscribe after first call)
const unsubscribeOnce = store.subscribeOnce('todos', (todos) => {
  console.log('Todos initialized:', todos);
});

// Use mutations
store.commit('increment', 5);
store.commit('setUser', { name: 'John', id: 1 });
store.commit('addTodo', { id: 1, text: 'Learn state management', done: false });

// Direct state access (triggers subscriptions with batching)
store.state.count = 10;
store.state.user = { name: 'Jane', id: 2 };
store.state.todos.push({ id: 2, text: 'Optimize performance', done: false });

// Batch updates will be flushed automatically, but you can also flush manually
// store.flushBatchUpdates();

// Unsubscribe when done (prevents memory leaks)
unsubscribeCount();
unsubscribeUser();

// Get current state
console.log('Current state:', store.getState());

// Check subscriber count
console.log('Count subscribers:', store.getSubscriberCount('count'));

// Clear all subscriptions
store.clearSubscriptions();

// Performance comparison example
console.log('\n--- Performance Test ---');

const performanceStore = new Store({
  state: { data: [] },
  mutations: {
    addData: (state, item) => ({ data: [...state.data, item] })
  }
});

// Test with batch updates disabled
performanceStore.setBatchUpdates(false);
const start1 = performance.now();
for (let i = 0; i < 1000; i++) {
  performanceStore.state.data = [...performanceStore.state.data, i];
}
const end1 = performance.now();
console.log(`Without batching: ${end1 - start1}ms`);

// Test with batch updates enabled
performanceStore.setBatchUpdates(true);
const start2 = performance.now();
for (let i = 0; i < 1000; i++) {
  performanceStore.state.data = [...performanceStore.state.data, i];
}
performanceStore.flushBatchUpdates();
const end2 = performance.now();
console.log(`With batching: ${end2 - start2}ms`); 