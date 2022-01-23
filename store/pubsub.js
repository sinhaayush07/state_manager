export class PubSub {
  constructor() {
    this.events = {}
  }
  /**
   * 
   * @param {string} event - event to subscribe
   * @param {function} callback - a callback function to be registered against that event
   */
  subscribe(event, callback) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event.toString()] = []
    }
    return this.events[event.toString()].push(callback)
  }

  publish(event, data) {
    console.log('event being published', event, data)
    if (!this.events.hasOwnProperty(event)) {
      return []
    }
    return this.events[event.toString()].map(cb => cb(data, event))
  }

}