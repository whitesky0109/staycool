import Vue from 'vue';
import VueRouter from 'vue-router';
import { Plugin } from 'vue-fragment';

import router from './router'; //vue-router
import { store } from './utils'; // vuex

Vue.use(VueRouter);
Vue.use(Plugin);

new Vue({
    router,
    store,
}).$mount('#app');