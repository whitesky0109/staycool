/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import '@babel/polyfill';
import { backendSrv } from '../utils';

import commonCtrl from '../common';
import * as memberData from './genData';
import * as memberView from './view';

class MemberCtrl {
  constructor() {
    this.positionArr = {
      TOP: 0, JUG: 0, MID: 0, BOT: 0, SUP: 0,
    };

    this.init();
  }

  init() {
    memberView.init();

    memberView.initPieChart();
    this.updateMembers();

    commonCtrl.updateVersion();
  }

  async updateMembers() {
    try {
      const { data } = await backendSrv.getMembers();
      this.positionArr = memberData.updatePosition(this.positionArr, data);

      memberView.updateMemberTable(data);
      memberView.updateMemberChart(data, this.positionArr);
    } catch (e) {
      console.error(e);
    }
  }
}

const member = new MemberCtrl();

export default member;
