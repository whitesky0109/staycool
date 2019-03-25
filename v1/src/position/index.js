/* eslint-disable no-loop-func */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { backendSrv } from '../utils';
import commonCtrl from '../common';

import * as positionView from './view';
import * as positionData from './genData';

class PositionCtrl {
  constructor() {
    this.team1Prefix = 'team1UserId';
    this.team2Prefix = 'team2UserId';
  }

  init() {
    positionView.init();
    commonCtrl.updateVersion();
    this.getUserIds();
  }

  async getUserIds() {
    try {
      const { data } = await backendSrv.getMembers();
      positionView.createSelectUsers(data);
    } catch (e) {
      console.error(e);
    }
  }

  predict() {
    this.teamPredict(1);
    this.teamPredict(2);
  }

  async teamPredict(teamNum) {
    const teamMemberIDs = positionView.getTeamMemberIDs(teamNum);

    try {
      const {
        predictLine, champKeysStWinRatio,
      } = await this.updateTeamData(teamMemberIDs);

      positionView.predictLine(teamNum, predictLine);
      for (let i = 0; i < 5; i += 1) {
        const champName = champKeysStWinRatio[i];

        backendSrv.getChampionImg(champName).then(({ data: championInfo }) => {
          positionView.setTeamChampImg(teamNum, championInfo.data[champName]);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async updateTeamData(memberIDs) {
    const { data } = await backendSrv.getTeamData(memberIDs);

    const { teamMostData, champKeysStWinRatio } = positionData.generateTeamData(memberIDs, data);
    const predictLine = positionData.predictLine(teamMostData);

    return {
      predictLine,
      champKeysStWinRatio,
    };
  }
}

const position = new PositionCtrl();

position.init();

window.position = position;

export default position;
