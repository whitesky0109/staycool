<template>
<div id="seasonMonitor" class="sub-nav-div">
    <div class="row input-group ml-2 mt-1 mb-2 mr-1 input-group-sm">
        <div class='input-group-append'>
            <span class='input-group-text'>Season</span>
        </div>

        <select id='airSeason' class='form-control input-sm-7' @change="changeSeason($event)" >
            <option v-for="(season, index) in seasons" :key="index" >
                {{season}}
            </option>
            <option value="ALL">ALL</option>
        </select>

        <div class='sub-nav-div-dummy'></div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { settings } from '../../utils/index';

@Component
export default class SeasonMonitorComponent extends Vue {
    seasons: number[] = [];
    constructor() {
        super();
        for (let i = settings.nowSeason; i > 0; i -= 1) {
            this.seasons.push(i);
        }
    }

    changeSeason(event) {
        const {value} = event.target;

        this.$store.commit("updateSeason", value)
    }
}
</script>
