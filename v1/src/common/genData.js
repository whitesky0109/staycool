/* eslint-disable no-continue */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
export const getSeason = (season = 4) => season;

export const createSummaryUsers = (userSeasonData) => {
  const summaryUsers = {};

  for (const data in userSeasonData) {
    const {
      user_id: userId, kill, death, asist, win,
    } = userSeasonData[data].fields;
    if (!summaryUsers[userId]) {
      summaryUsers[userId] = {
        kill,
        death,
        asist,
        win,
        play: 1,
      };
    } else {
      summaryUsers[userId].kill += kill;
      summaryUsers[userId].death += death;
      summaryUsers[userId].asist += asist;
      if (win == 1) {
        summaryUsers[userId].win += 1;
      }
      summaryUsers[userId].play += 1;
    }
  }

  for (const data in summaryUsers) {
    summaryUsers[data].winRatio = (
      (summaryUsers[data].win / summaryUsers[data].play) * 100
    ).toFixed(2);
  }

  return summaryUsers;
};

export const findCarry = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);
  keys.sort((a, b) => {
    if (summaryUsers[b].play < 10) { return -1; }

    if (summaryUsers[a].play < 10) { return 1; }

    const kdaB = (summaryUsers[b].kill + summaryUsers[b].asist) / summaryUsers[b].death;
    const kdaA = (summaryUsers[a].kill + summaryUsers[a].asist) / summaryUsers[a].death;

    return kdaB - kdaA;
  });

  const mostUserId = keys[0];
  const {
    kill, death, asist, win, play, winRatio,
  } = summaryUsers[mostUserId];
  return {
    userId: mostUserId,
    kill,
    death,
    asist,
    win,
    play,
    winRatio,
  };
};

export const summaryMostData = (userGameData) => {
  const mostData = { champion: '', line: '', winRatio: '' };

  const championList = {};
  const lineList = {};
  let winCnt = 0;

  let maxChamp = 0;
  let maxLine = 0;

  for (const data in userGameData) {
    const champ = userGameData[data].fields.champion;
    const { line } = userGameData[data].fields;

    if (championList[champ] === undefined) {
      championList[champ] = 1;
    } else {
      championList[champ] += 1;
    }

    if (lineList[line] === undefined) {
      lineList[line] = 1;
    } else {
      lineList[line] += 1;
    }

    if (userGameData[data].fields.win == 1) {
      winCnt += 1;
    }

    if (maxChamp < championList[champ]) {
      mostData.champion = champ;
      maxChamp = championList[champ];
    }

    if (maxLine < lineList[line]) {
      mostData.line = line;
      maxLine = lineList[line];
    }
  }

  mostData.winRatio = ((winCnt / userGameData.length) * 100).toFixed(2);

  return mostData;
};

export const summaryChampion = (userGameData) => {
  const resObj = {};

  for (const data in userGameData) {
    const {
      kill, death, asist, cs, win, champion: champ,
    } = userGameData[data].fields;

    if (resObj[champ] === undefined) {
      resObj[champ] = {
        kill,
        death,
        asist,
        cs,
        win: win == 1 ? 1 : 0,
        play: 1,
      };
    } else {
      resObj[champ].kill += kill;
      resObj[champ].death += death;
      resObj[champ].asist += asist;
      resObj[champ].cs += cs;
      if (win == 1) {
        resObj[champ].win += 1;
      }
      resObj[champ].play += 1;
    }
  }

  return resObj;
};

export const summaryLine = (userGameData) => {
  const resObj = {
    TOP: { win: 0, games: 0 },
    JUG: { win: 0, games: 0 },
    MID: { win: 0, games: 0 },
    BOT: { win: 0, games: 0 },
    SUP: { win: 0, games: 0 },
  };

  for (const data in userGameData) {
    const { line, win } = userGameData[data].fields;

    if (resObj[line] === undefined) { continue; }

    if (win == 1) {
      resObj[line].win += 1;
    }
    resObj[line].games += 1;
  }

  return resObj;
};

export const summaryUsers = (userSeasonData) => {
  const obj = {};
  for (const data in userSeasonData) {
    const {
      user_id: userId, kill, death, asist, win,
    } = userSeasonData[data].fields;
    if (obj[userId] === undefined) {
      obj[userId] = {
        kill,
        death,
        asist,
        win,
        play: 1,
      };
    } else {
      obj[userId].kill += kill;
      obj[userId].death += death;
      obj[userId].asist += asist;
      if (win == 1) {
        obj[userId].win += 1;
      }
      obj[userId].play += 1;
    }
  }

  for (const data in obj) {
    obj[data].winRatio = ((obj[data].win / obj[data].play) * 100).toFixed(2);
  }

  return obj;
};
