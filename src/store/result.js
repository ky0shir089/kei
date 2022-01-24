export default {
  namespaced: true,
  state: {
    result_id: "",
  },
  mutations: {
    set: (state, payload) => {
      state.result_id = payload
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    result_id: state => state.result_id,
  }
}