<template>
	<div id="homeAddBanner" class="home-addbanner-div">
		<img :src="src" :height="height" :width="width">
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	components: {},
})
export default class HomeAddBannerComponent extends Vue {
	src: string = "/static/airgg/img/league.png";
	height: number = 580
	width: number = 1080
}
</script>
