<template>
<div id="alrHome" class="main-title mb-2">
    <img :src="homeBanner" alt="" :width="width" />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { settings } from '../../utils/index';

@Component
export default class BannerComponent extends Vue {
    homeBanner: string = settings.homeBanner;
    width: string = "1060px";
}
</script>
