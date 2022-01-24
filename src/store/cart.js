export default {
  namespaced: true,
  state: {
    carts: [],
  },
  mutations: {
    insert: (state, payload) => {
      state.carts.push({
        id: payload.id,
        title: payload.webinar_name,
        price: payload.webinar_price,
        logo: payload.webinar_banner,
        session: payload.webinar_session,
        class: payload.webinar_class,
        category: payload.webinar_category,
        type: payload.webinar_type,
        level: payload.webinar_level,
        mentor: payload.mentor_name,
        detail: payload.webinar_detail,
      })
    },
    update: (state, payload) => {
      let idx = state.carts.indexOf(payload);
      state.carts.splice(idx, 1)
    },
    set: (state, payload) => {
      state.carts = payload
    },
  },
  actions: {
    add: ({ state, commit }, payload) => {
      let cartItem = state.carts.find(item => item.id === payload.id)
      if (!cartItem) {
        commit('insert', payload)
      }
    },
    remove: ({ state, commit }, payload) => {
      let cartItem = state.carts.find(item => item.id === payload.id)
      if (cartItem) {
        commit('update', cartItem)
      }
    },
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    carts: state => state.carts,
    count: (state) => {
      return state.carts.length
    },
    totalPrice: (state) => {
      let total = 0
      state.carts.forEach(function (cart) {
        total += cart.price
      })
      return total
    },
  }
}