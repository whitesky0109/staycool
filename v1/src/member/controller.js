/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import '@babel/polyfill';
import { backendSrv } from '../utils';

import common from '../common';

import * as model from './model';
import * as view from './view';

export default class MemberCtrl {
  constructor() {
    this.positionArr = {
      TOP: 0, JUG: 0, MID: 0, BOT: 0, SUP: 0,
    };

    this.init();
  }

  init() {
    view.init();

    view.initPieChart();
    this.updateMembers();

    common.controller.updateVersion();
  }

  async updateMembers() {
    try {
      const { data } = await backendSrv.getMembers();
      this.positionArr = model.updatePosition(this.positionArr, data);

      view.updateMemberTable(data);
      view.updateMemberChart(data, this.positionArr);
    } catch (e) {
      console.error(e);
    }
  }
}
