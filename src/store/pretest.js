export default {
  namespaced: true,
  state: {
    pretest: {},
  },
  mutations: {
    set: (state, payload) => {
      state.pretest = payload
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    pretest: state => state.pretest,
  }
}