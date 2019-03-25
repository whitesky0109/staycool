/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { locationSrv, emptyElement, backendSrv } from '../utils';
import commonCtrl from '../common';
import * as commonData from '../common/genData';

import * as profileView from './view';
import * as profileData from './genData';

class ProfileCtrl {
  constructor() {
    this.getParams = locationSrv.getRequest(); // ???
    this.season = 'ALL';
    this.userName = this.getParams.userName;
  }

  init() {
    profileView.init();
    profileView.setUserName(this.userName);
    this.updateUserData(this.userName, this.season);

    commonCtrl.setUpdateFunc((ss) => {
      emptyElement('profileName');
      emptyElement('profileMainInfo');
      emptyElement('profileChampTableBody');

      profileView.setUserName(this.userName);
      this.updateUserData(this.userName, ss);
    });

    commonCtrl.updateVersion();
  }

  async updateUserData(name, season) {
    try {
      const { data } = await backendSrv.getSeasonUserData(name, season);

      const { line, winRatio, champion } = commonData.summaryMostData(data);
      profileView.setMainInfo(line, winRatio);

      const lineData = commonData.summaryLine(data);
      const { winratioArr, playrateArr } = profileData.setLineInfo(lineData);
      profileView.addWinrateRadarChart(winratioArr);
      profileView.addPlayrateRadarChart(playrateArr);
      profileView.updateChart();

      const champData = commonData.summaryChampion(data);
      const tableData = profileData.genTableData(champData);
      profileView.setChampTable(tableData);

      profileView.setRadarChartBackgroundImg(champion);
    } catch (e) {
      console.error(e);
    }
  }
}

const profile = new ProfileCtrl();

profile.init();

export default profile;
