import Vue from 'vue'
import App from './App'

import './config/bootstrap'
import './config/msg'
import './config/axios'
import './config/mq'

import store from './config/store'
import router from './config/router'
import VueMaterial from 'vue-material'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(VueMaterial)

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')