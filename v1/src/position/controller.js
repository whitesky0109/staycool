/* eslint-disable no-loop-func */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { backendSrv } from '../utils';
import commonCtrl from '../common';

import * as view from './view';
import * as model from './model';

export default class PositionCtrl {
  constructor() {
    this.team1Prefix = 'team1UserId';
    this.team2Prefix = 'team2UserId';
  }

  init() {
    view.init();
    commonCtrl.updateVersion();
    this.getUserIds();
  }

  async getUserIds() {
    try {
      const { data } = await backendSrv.getMembers();
      view.createSelectUsers(data);
    } catch (e) {
      console.error(e);
    }
  }

  predict() {
    this.teamPredict(1);
    this.teamPredict(2);
  }

  async teamPredict(teamNum) {
    const teamMemberIDs = view.getTeamMemberIDs(teamNum);

    try {
      const {
        predictLine, champKeysStWinRatio,
      } = await this.updateTeamData(teamMemberIDs);

      view.predictLine(teamNum, predictLine);
      for (let i = 0; i < 5; i += 1) {
        const champName = champKeysStWinRatio[i];

        backendSrv.getChampionImg(champName).then(({ data: championInfo }) => {
          view.setTeamChampImg(teamNum, championInfo.data[champName]);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async updateTeamData(memberIDs) {
    const { data } = await backendSrv.getTeamData(memberIDs);

    const { teamMostData, champKeysStWinRatio } = model.generateTeamData(memberIDs, data);
    const predictLine = model.predictLine(teamMostData);

    return {
      predictLine,
      champKeysStWinRatio,
    };
  }
}
