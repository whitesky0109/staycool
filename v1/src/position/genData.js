/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as commonData from '../common/genData';

export const predictLine = (teamMostDatas) => {
  const resObj = {
    TOP: null,
    JUG: null,
    MID: null,
    BOT: null,
    SUP: null,
  };

  const renameMember = {};

  for (const userId in teamMostDatas) {
    const curLine = teamMostDatas[userId].line;

    if (resObj[curLine] === null) {
      resObj[curLine] = userId;
    } else {
      const alpha = parseFloat(teamMostDatas[resObj[curLine]].winRatio);
      const beta = parseFloat(teamMostDatas[userId].winRatio);

      if (beta > alpha) {
        renameMember[resObj[curLine]] = teamMostDatas[resObj[curLine]];
        resObj[curLine] = userId;
      } else {
        renameMember[userId] = teamMostDatas[userId];
      }
    }
  }

  for (const userId in renameMember) {
    for (const line in resObj) {
      if (resObj[line] === null) {
        resObj[line] = userId;
        break;
      }
    }
  }

  for (const line in resObj) {
    if (resObj[line] === null) {
      resObj[line] = 'UNKNOWN';
    }
  }

  return resObj;
};

export const generateTeamData = (memberIDs, teamData) => {
  const teamChampData = {};
  const teamMostData = {};

  for (const member of memberIDs) {
    if (member === 'UNKNOWN') continue;

    const mostData = commonData.summaryMostData(teamData[member]);
    const champData = commonData.summaryChampion(teamData[member]);

    teamMostData[member] = mostData;

    for (const champ in champData) {
      if (!teamChampData[champ]) {
        teamChampData[champ] = champData[champ];
      } else {
        teamChampData[champ].kill += champData[champ].kill;
        teamChampData[champ].death += champData[champ].death;
        teamChampData[champ].asist += champData[champ].asist;
        teamChampData[champ].cs += champData[champ].cs;
        teamChampData[champ].win += champData[champ].win;
        teamChampData[champ].play += champData[champ].play;
      }
    }
  }

  const champKeysStWinRatio = Object.keys(teamChampData);
  champKeysStWinRatio.sort((a, b) => {
    if (teamChampData[b].play < 10) { return -1; }

    if (teamChampData[a].play < 10) { return 1; }

    const beta = teamChampData[b].win / teamChampData[b].play;
    const alpha = teamChampData[a].win / teamChampData[a].play;

    return beta - alpha;
  });

  return {
    teamChampData,
    teamMostData,
    champKeysStWinRatio,
  };
};
