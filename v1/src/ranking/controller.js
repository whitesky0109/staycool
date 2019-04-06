/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { locationSrv, emptyElement, backendSrv } from '../utils';
import common from '../common';

import * as view from './view';
import * as model from './model';

export default class RankingCtrl {
  constructor() {
    const getParams = locationSrv.getRequest(); // ???
    const season = common.model.getSeason(getParams.season);
    this.season = season;
  }

  init() {
    view.init();
    view.setSeasonTitle(this.season);

    common.controller.setUpdateFunc((ss) => {
      emptyElement('seasonTitle');
      emptyElement('rankingFirst');
      emptyElement('rankingHighRankers');
      emptyElement('rankingList');

      view.setSeasonTitle(ss);
      this.updateSeasonData(ss);
    });

    this.updateSeasonData(this.season);
    common.controller.updateVersion();
  }

  async updateSeasonData(season) {
    try {
      const { data } = await backendSrv.getSeasonData(season);

      const summaryUsers = common.model.summaryUsers(data);
      const keys = model.sortedSummaryUsers(summaryUsers);

      const first = keys[0];
      view.setFirstMember(first, summaryUsers[first]);

      for (let i = 1; i < 5; i += 1) {
        view.setHighRanker(keys[i], summaryUsers[keys[i]]);
      }

      view.setRankingTable(keys, summaryUsers);
    } catch (e) {
      console.error(e);
    }
  }
}
