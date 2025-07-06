export class PubSub {
  constructor() {
    this.events = new Map()
    this.subscriberCount = 0
  }

  /**
   * Subscribe to an event
   * @param {string} event - event to subscribe
   * @param {function} callback - callback function to be registered
   * @param {object} options - subscription options
   * @returns {function} unsubscribe function
   */
  subscribe(event, callback, options = {}) {
    if (typeof event !== 'string' || typeof callback !== 'function') {
      throw new Error('Event must be a string and callback must be a function')
    }

    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }

    const subscriber = {
      id: ++this.subscriberCount,
      callback,
      once: options.once || false
    }

    this.events.get(event).add(subscriber)

    // Return unsubscribe function
    return () => this.unsubscribe(event, subscriber)
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first call)
   * @param {string} event - event to subscribe
   * @param {function} callback - callback function
   * @returns {function} unsubscribe function
   */
  once(event, callback) {
    return this.subscribe(event, callback, { once: true })
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - event name
   * @param {object} subscriber - subscriber object or callback function
   */
  unsubscribe(event, subscriber) {
    if (!this.events.has(event)) return

    const subscribers = this.events.get(event)

    if (typeof subscriber === 'function') {
      // Remove by callback function
      for (const sub of subscribers) {
        if (sub.callback === subscriber) {
          subscribers.delete(sub)
          break
        }
      }
    } else {
      // Remove by subscriber object
      subscribers.delete(subscriber)
    }

    // Clean up empty event sets
    if (subscribers.size === 0) {
      this.events.delete(event)
    }
  }

  /**
   * Publish an event to all subscribers
   * @param {string} event - event name
   * @param {any} data - data to pass to subscribers
   * @returns {number} number of subscribers notified
   */
  publish(event, data) {
    if (!this.events.has(event)) {
      return 0
    }

    const subscribers = this.events.get(event)
    const toRemove = []

    let notifiedCount = 0

    for (const subscriber of subscribers) {
      try {
        subscriber.callback(data, event)
        notifiedCount++

        // Mark for removal if it's a once subscription
        if (subscriber.once) {
          toRemove.push(subscriber)
        }
      } catch (error) {
        console.error(`Error in subscriber callback for event '${event}':`, error)
      }
    }

    // Remove once subscriptions
    toRemove.forEach(sub => subscribers.delete(sub))

    // Clean up empty event sets
    if (subscribers.size === 0) {
      this.events.delete(event)
    }

    return notifiedCount
  }

  /**
   * Get the number of subscribers for an event
   * @param {string} event - event name
   * @returns {number} subscriber count
   */
  subscriberCount(event) {
    return this.events.has(event) ? this.events.get(event).size : 0
  }

  /**
   * Clear all subscribers for an event
   * @param {string} event - event name (optional, clears all if not provided)
   */
  clear(event) {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }

  /**
   * Get all event names
   * @returns {string[]} array of event names
   */
  getEvents() {
    return Array.from(this.events.keys())
  }
}