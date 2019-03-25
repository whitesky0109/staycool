/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { backendSrv, locationSrv } from '../utils';

import commonCtrl from '../common';
import * as commonView from '../common/view';
import * as commonData from '../common/genData';

import * as homeView from './view';
import * as homeData from './genData';

class HomeCtrl {
  constructor() {
    const getParams = locationSrv.getRequest(); // ???
    const season = commonData.getSeason(getParams.season);
    this.season = season;

    commonCtrl.updateVersion();
  }

  init() {
    homeView.init();
    homeView.setSeasonTitle(this.season);

    this.getSeasonData(this.season);

    commonCtrl.setUpdateFunc((ss) => {
      homeView.clearPage();
      homeView.setSeasonTitle(ss);

      this.getSeasonData(ss);
    });
  }

  async getSeasonData(season) {
    try {
      const { data } = await backendSrv.getSeasonData(season);

      const summaryUsers = commonData.createSummaryUsers(data);
      const carry = commonData.findCarry(summaryUsers);

      this.loadUserData(carry.userId);
      const kda = homeData.getKda(carry);
      homeView.setUserKDA(kda);
    } catch (e) {
      console.error(e);
    }
  }

  async loadUserData(userName) {
    try {
      const { data: userData } = await backendSrv.getUserData(userName);
      const { champion, line } = commonData.summaryMostData(userData);

      homeView.setBestPlayer(userName);
      homeView.setUserLine(line);

      const { data: championInfo } = await backendSrv.getChampionImg(champion);

      const champElem = document.getElementById('bestChampion');
      commonView.setImg(champElem, championInfo.data[champion], null);
    } catch (e) {
      console.error(e);
    }
  }
}

const home = new HomeCtrl();


home.init();
