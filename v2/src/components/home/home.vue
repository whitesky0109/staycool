<template>
<div id="homeMainDiv" class="home-main-div col-lg-7">
	<div v-if="userName" id="bestPlayer" class="home-bestplayer">
		<H2 id="bestTitle">{{season}} 시즌 MVP</H2>
		<H3 id="bestUserName">
			<a class="home-user-name" :href="bestUserHref" >{{userName}}</a>
		</H3>
		<div id="bestChampion"></div>
		<p id="bestUserLine">주 라인: {{line}}</p>
		<p id="bestUserKDA">KDA: {{kda}}</p>
		<H3 id="bestDescription" class="mt-5 mr-2 ml-2">
			위 클랜원은 해당 시즌에서 높은 KDA를 달성하여 <br>
			이를 기념하기 위해 시즌 MVP로 임명함.
		</H3>
		<div class="home-master-sign"></div>
	</div>

	<div id="airVideoWindow" class="ml-2 mt-1 mb-2 mr-1">
		<H3>ALR Channel</H3>
		<iframe class="ml-2 mr-2 mb-2 mt-1" width="911" height="512" 
			src="https://www.youtube.com/embed/pMcV0KLQJ1c"
			frameborder="0" allow="autoplay; encrypted-media" 
			allowfullscreen>
		</iframe>
		<H3>영상제작: AlR 뽀으</H3>
	</div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { backendSrv } from '../../utils/index';
import common from '../../common';

@Component
export default class HomeComponent extends Vue {
	userName: string = '';
	line: string;
	bestUserHref: string;
	kda: string;

	// computed Functions
	get season() {
		return this.$store.state.home.season;
	}

	constructor() {
		super();
		this.updateSeasonData(this.season);
	}

	// watch functions
	@Watch('season')
	async onSeasonChange(season: number) {
		this.updateSeasonData(season);
	}

	// methods
	setKda({ kill, asist, death = 1 }: { kill: number, asist: number, death: number }): void {
		this.kda = ((kill + asist) / death).toFixed(2);
	}

	public async updateSeasonData(season: number) {
		try {
			this.userName = '';
			const { data } = await backendSrv.getSeasonData(season);

			const summaryUsers = common.model.createSummaryUsers(data);
			const carry = common.model.findCarry(summaryUsers);

			this.loadUserData(carry.userId);
			this.setKda(carry);
		} catch (e) {
			console.error(e);
		}
	}

	public async loadUserData(userName: string) {
		try {
			const { data: userData } = await backendSrv.getUserData(userName);
			const { champion, line } = common.model.summaryMostData(userData);

			this.userName = userName;
			this.bestUserHref = `/profile/?userName=${userName}`
			this.line = line;

			const { data: championInfo } = await backendSrv.getChampionImg(champion);

			const champElem = document.getElementById('bestChampion');
			common.view.setImg(champElem, championInfo.data[champion], null);
		} catch (e) {
		// tslint:disable-next-line:no-console
		console.error(e);
		}
  	}
}
</script>
