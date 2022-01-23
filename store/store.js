import { PubSub } from "./pubsub"

export class Store {
  constructor({ mutations, state }) {
    this.mutations = mutations || {}
    this.events = new PubSub()
    let self = this
    this.state = new Proxy((state || {}), {
      /**
       * 
       * @param {any} target - the object that the proxy refers to 
       * @param {string} property - the property of the object that needs to be changed
       * @param {any} value - the value that needs to be set
       * @param {any} receiver - the orignal object without mutation
       * @returns Boolean
       */
      set: function (target, property, value, receiver) {
        // only change if the value has changed
        if (value === receiver[property]) {
          return true
        }
        console.log("hit setter function", target, property, value, receiver)
        target[property] = value
        self.events.publish(property, value)
        return true
      },
      /**
       * 
       * @param {any} target 
       * @param {string} property 
       * @returns true (truthy values)
       */
      get: function (target, property) {
        if (!target.hasOwnProperty(property)) {
          return `the ${property} does not exists`
        }
        return target[property]
      }
    })
  }

  /**
   * 
   * @param {*} key 
   * @param {*} data 
   * @returns 
   */
  commit(key, data) {
    if (!this.mutations[key]) {
      console.log(`mutation ${key} does not exist`)
      return false
    }
    let self = this
    let newState = this.mutations[key](this.state, data)
    /**
     * Object.assign is used here and not Object.spread {...}
     * this was because, Object.assign() calls setters on the target object
     * self.state = { ...self.state, ...newState }
     * while Object.spread do not.
     * 
     */
    self.state = Object.assign(self.state, newState)
    return true
  }

  stateLogger(key) {
    // console.log(this.state)
    console.log(this.state[key] || null)
  }

}