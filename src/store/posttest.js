export default {
  namespaced: true,
  state: {
    posttest: [],
  },
  mutations: {
    set: (state, payload) => {
      state.posttest = payload
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    posttest: state => state.posttest,
  }
}