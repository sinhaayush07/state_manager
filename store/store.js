import { PubSub } from "./pubsub"

export class Store {
  constructor({ mutations, state, options = {} }) {
    this.mutations = mutations || {}
    this.events = new PubSub()
    this.batchUpdates = options.batchUpdates || false
    this.pendingUpdates = new Set()
    this.batchTimeout = null

    let self = this

    // Deep comparison utility
    const deepEqual = (a, b) => {
      if (a === b) return true
      if (a == null || b == null) return false
      if (typeof a !== typeof b) return false
      if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false
        if (Array.isArray(a)) {
          if (a.length !== b.length) return false
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false
          }
          return true
        }
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        if (keysA.length !== keysB.length) return false

        for (const key of keysA) {
          if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false
        }
        return true
      }
      return false
    }

    this.state = new Proxy((state || {}), {
      set: function (target, property, value, receiver) {
        // Deep comparison to avoid unnecessary updates
        if (deepEqual(value, receiver[property])) {
          return true
        }

        target[property] = value

        if (self.batchUpdates) {
          self.pendingUpdates.add(property)
          if (self.batchTimeout) {
            clearTimeout(self.batchTimeout)
          }
          self.batchTimeout = setTimeout(() => {
            self.flushBatchUpdates()
          }, 0)
        } else {
          self.events.publish(property, value)
        }

        return true
      },
      get: function (target, property) {
        if (!target.hasOwnProperty(property)) {
          return undefined // Return undefined instead of string for better error handling
        }
        return target[property]
      }
    })
  }

  /**
   * Flush pending batch updates
   */
  flushBatchUpdates() {
    if (this.pendingUpdates.size === 0) return

    const updates = Array.from(this.pendingUpdates)
    this.pendingUpdates.clear()
    this.batchTimeout = null

    // Publish all updates
    updates.forEach(property => {
      this.events.publish(property, this.state[property])
    })
  }

  /**
   * Commit a mutation
   * @param {string} key - mutation key
   * @param {any} data - mutation data
   * @returns {boolean} success status
   */
  commit(key, data) {
    if (!this.mutations[key]) {
      console.warn(`Mutation '${key}' does not exist`)
      return false
    }
    try {
      const newState = this.mutations[key](this.state, data)
      if (newState && typeof newState === 'object') {
        // Use Object.assign to trigger proxy setters
        Object.assign(this.state, newState)
      }
      return true
    } catch (error) {
      console.error(`Error in mutation '${key}':`, error)
      return false
    }
  }

  /**
   * Get current state
   * @returns {object} current state
   */
  getState() {
    return { ...this.state }
  }

  /**
   * Subscribe to state changes
   * @param {string} property - property to watch
   * @param {function} callback - callback function
   * @param {object} options - subscription options
   * @returns {function} unsubscribe function
   */
  subscribe(property, callback, options = {}) {
    return this.events.subscribe(property, callback, options)
  }

  /**
   * Subscribe to state changes once
   * @param {string} property - property to watch
   * @param {function} callback - callback function
   * @returns {function} unsubscribe function
   */
  subscribeOnce(property, callback) {
    return this.events.once(property, callback)
  }

  /**
   * Unsubscribe from state changes
   * @param {string} property - property name
   * @param {function} callback - callback function
   */
  unsubscribe(property, callback) {
    this.events.unsubscribe(property, callback)
  }

  /**
   * Clear all subscriptions
   * @param {string} property - optional property to clear (clears all if not provided)
   */
  clearSubscriptions(property) {
    this.events.clear(property)
  }

  /**
   * Get subscriber count for a property
   * @param {string} property - property name
   * @returns {number} subscriber count
   */
  getSubscriberCount(property) {
    return this.events.subscriberCount(property)
  }

  /**
   * Enable/disable batch updates
   * @param {boolean} enabled - whether to enable batch updates
   */
  setBatchUpdates(enabled) {
    this.batchUpdates = enabled
    if (!enabled && this.pendingUpdates.size > 0) {
      this.flushBatchUpdates()
    }
  }

  /**
   * Debug method to log state
   * @param {string} key - optional property key
   */
  stateLogger(key) {
    if (key) {
      console.log(`State[${key}]:`, this.state[key])
    } else {
      console.log('Full State:', this.state)
    }
  }
}