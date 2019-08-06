import Vue from 'vue';
import { VuexAltPlugin } from 'vuex-alt';
import App from './App.vue';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.use(VuexAltPlugin, { store });

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
