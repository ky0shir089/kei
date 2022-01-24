import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import alert from '@/store/alert'
import auth from '@/store/auth'
import pretest from '@/store/pretest'
import cart from '@/store/cart'
import posttest from '@/store/posttest'
import result from '@/store/result'

const vuexPersist = new VuexPersist({
  key: 'kei',
  storage: sessionStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    prevUrl: '',
  },
  mutations: {
    setPrevUrl: (state, value) => {
      state.prevUrl = value
    },
  },
  actions: {
    setPrevUrl: ({ commit }, value) => {
      commit('setPrevUrl', value)
    },
  },
  getters: {
    prevUrl: state => state.prevUrl,
  },
  modules: {
    alert,
    auth,
    pretest,
    cart,
    posttest,
    result
  }
})
