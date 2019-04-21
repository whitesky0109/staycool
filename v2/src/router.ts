import VueRouter, { RouteConfig, RouterOptions } from "vue-router";

import Home from "./components/home/index.vue";

const routes: RouteConfig[] = [
    { path: '/', component: Home },
]

const opt: RouterOptions = {
    routes,
}

export default new VueRouter(opt);