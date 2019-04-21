<template>
<footer id="airFooter" class="main-func-div">
    <div id="airVersion">
        <p>Produced by 'AlR 펌프'</p>
        <p v-if="date">Updated by {{date}}</p>
    </div>
</footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { backendSrv } from '../../utils';

@Component
export default class MenuComponent extends Vue {
    date: any = null;
    constructor() {
        super();
    }

    mounted() {
        this.updateVersion();
    }

    render(h) {
        
    }

    async updateVersion() {
        try {
            const { data } = await backendSrv.getVersion()
            this.date = data.date;
        } catch (e) {
            console.error(e);
        }
    }
}
</script>
