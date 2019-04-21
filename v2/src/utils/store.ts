import Vue from 'vue';
import Vuex from 'vuex'
import { settings } from './index';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        home: {
            season: settings.nowSeason,
        },
    },
    mutations: {
        updateSeason: (state, payload) => {
            state.home.season = payload;
        }
    }
});

export default store;