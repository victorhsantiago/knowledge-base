import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import store from './config/store'
import router from './config/router'
import './config/bootstrap'
import './config/msg'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' 

Vue.use(VueMaterial)

Vue.config.productionTip = false

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')