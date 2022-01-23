
import { MUTATIONS } from "../mutations";
import { STATE } from "../state";
import { Store } from "../store";

// instantiate the store
let store = new Store({ mutations: MUTATIONS, state: STATE })

// 
document.getElementById('change_states_a').addEventListener('click', function () {
  store.commit('changeA', 123)
  store.stateLogger('a')
  store.events.subscribe('a', function () {
    console.log(
      'a is changed', a
    )
  })
})

document.getElementById('change_states_b').addEventListener('click', function () {
  store.commit('changeB', 343)
  store.stateLogger('b')
  store.events.subscribe('b', function () {
    console.log(
      'b is changed', b
    )
  })
})

document.getElementById('change_states_c').addEventListener('click', function () {
  store.commit('changeC', 312)
  store.stateLogger('c')
  store.events.subscribe('c', function () {
    console.log(
      'c is changed', c
    )
  })
})