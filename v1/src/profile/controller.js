/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { locationSrv, emptyElement, backendSrv } from '../utils';
import common from '../common';

import * as view from './view';
import * as model from './model';

export default class ProfileCtrl {
  constructor() {
    this.getParams = locationSrv.getRequest(); // ???
    this.season = 'ALL';
    this.userName = this.getParams.userName;
  }

  init() {
    view.init();
    view.setUserName(this.userName);
    this.updateUserData(this.userName, this.season);

    common.controller.setUpdateFunc((ss) => {
      emptyElement('profileName');
      emptyElement('profileMainInfo');
      emptyElement('profileChampTableBody');

      view.setUserName(this.userName);
      this.updateUserData(this.userName, ss);
    });

    common.controller.updateVersion();
  }

  async updateUserData(name, season) {
    try {
      const { data } = await backendSrv.getSeasonUserData(name, season);

      const { line, winRatio, champion } = common.model.summaryMostData(data);
      view.setMainInfo(line, winRatio);

      const lineData = common.model.summaryLine(data);
      const { winratioArr, playrateArr } = model.setLineInfo(lineData);
      view.addWinrateRadarChart(winratioArr);
      view.addPlayrateRadarChart(playrateArr);
      view.updateChart();

      const champData = common.model.summaryChampion(data);
      const tableData = model.genTableData(champData);
      view.setChampTable(tableData);

      view.setRadarChartBackgroundImg(champion);
    } catch (e) {
      console.error(e);
    }
  }
}
