<template>
<fragment>
	<banner-component />
	<menu-component />

	<home-add-banner />

	<season-monitor />

	<home-main/>
	<footer-component />
</fragment>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// load components
import BannerComponent from '../common/banner.vue';
import MenuComponent from '../common/menu.vue';
import HomeAddBanner from './homeAddBanner.vue';
import SeasonMonitor from '../common/seasonMonitor.vue';
import homeMain from './home.vue';
import FooterComponent from '../common/footer.vue';

import "./style.css";

@Component({
	components: {
		// use Components
		BannerComponent,
		MenuComponent,
		SeasonMonitor,

		HomeAddBanner,
		homeMain,

		FooterComponent
	},	
})
export default class HomeComponent extends Vue {
}
</script>
