/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import '@babel/polyfill';
import { backendSrv, locationSrv } from '../utils';

import common from '../common';

import * as view from './view';
import * as model from './model';

export default class HomeCtrl {
  constructor() {
    const getParams = locationSrv.getRequest(); // ???
    const season = common.model.getSeason(getParams.season);
    this.season = season;

    common.controller.updateVersion();
  }

  init() {
    view.init();
    view.setSeasonTitle(this.season);

    this.getSeasonData(this.season);

    common.controller.setUpdateFunc((ss) => {
      view.clearPage();
      view.setSeasonTitle(ss);

      this.getSeasonData(ss);
    });
  }

  async getSeasonData(season) {
    try {
      const { data } = await backendSrv.getSeasonData(season);

      const summaryUsers = common.model.createSummaryUsers(data);
      const carry = common.model.findCarry(summaryUsers);

      this.loadUserData(carry.userId);
      const kda = model.getKda(carry);
      view.setUserKDA(kda);
    } catch (e) {
      console.error(e);
    }
  }

  async loadUserData(userName) {
    try {
      const { data: userData } = await backendSrv.getUserData(userName);
      const { champion, line } = common.model.summaryMostData(userData);

      view.setBestPlayer(userName);
      view.setUserLine(line);

      const { data: championInfo } = await backendSrv.getChampionImg(champion);

      const champElem = document.getElementById('bestChampion');
      common.view.setImg(champElem, championInfo.data[champion], null);
    } catch (e) {
      console.error(e);
    }
  }
}
