/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { locationSrv, emptyElement, backendSrv } from '../utils';
import commonCtrl from '../common';
import * as commonData from '../common/genData';

import * as rankingView from './view';
import * as rankingData from './genData';

class RankingCtrl {
  constructor() {
    const getParams = locationSrv.getRequest(); // ???
    const season = commonData.getSeason(getParams.season);
    this.season = season;
  }

  init() {
    rankingView.init();
    rankingView.setSeasonTitle(this.season);

    commonCtrl.setUpdateFunc((ss) => {
      emptyElement('seasonTitle');
      emptyElement('rankingFirst');
      emptyElement('rankingHighRankers');
      emptyElement('rankingList');

      rankingView.setSeasonTitle(ss);
      this.updateSeasonData(ss);
    });

    this.updateSeasonData(this.season);
    commonCtrl.updateVersion();
  }

  async updateSeasonData(season) {
    try {
      const { data } = await backendSrv.getSeasonData(season);

      const summaryUsers = commonData.summaryUsers(data);
      const keys = rankingData.sortedSummaryUsers(summaryUsers);

      const first = keys[0];
      rankingView.setFirstMember(first, summaryUsers[first]);

      for (let i = 1; i < 5; i += 1) {
        rankingView.setHighRanker(keys[i], summaryUsers[keys[i]]);
      }

      rankingView.setRankingTable(keys, summaryUsers);
    } catch (e) {
      console.error(e);
    }
  }
}

const ranking = new RankingCtrl();

ranking.init();

export default ranking;
