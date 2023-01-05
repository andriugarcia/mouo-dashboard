import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VuexStore from '..//store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueRouter from 'vue-router'
import router from '../router'

Vue.use(VueRouter)

Vue.use(Vuetify)
Vue.use(Vuex)

const store = new Vuex.Store(VuexStore)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
