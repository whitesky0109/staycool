/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export const setLineInfo = (lineData) => {
  let playTotal = 0;
  const ratio = {
    TOP: 0, JUG: 0, MID: 0, BOT: 0, SUP: 0,
  };

  for (const data in lineData) {
    if (lineData[data].games != 0) {
      ratio[data] = (lineData[data].win / lineData[data].games * 100).toFixed(2);
    }
    playTotal += lineData[data].games;
  }
  const winratioArr = [ratio.TOP, ratio.MID, ratio.JUG, ratio.BOT, ratio.SUP];
  const playrateArr = [
    lineData.TOP.games / playTotal * 100,
    lineData.MID.games / playTotal * 100,
    lineData.JUG.games / playTotal * 100,
    lineData.BOT.games / playTotal * 100,
    lineData.SUP.games / playTotal * 100,
  ];

  return {
    winratioArr,
    playrateArr,
  };
};

export const genTableData = (champData) => {
  const keys = Object.keys(champData);
  keys.sort((a, b) => champData[b].play - champData[a].play);

  const tableData = {};
  for (const index of keys) {
    if (champData[index].death === 0) {
      champData[index].death = 1;
    }

    tableData[index] = {
      play: champData[index].play,
      kda: ((champData[index].kill + champData[index].asist) / champData[index].death).toFixed(2),
      killAvr: (champData[index].kill / champData[index].play).toFixed(1),
      deathAvr: (champData[index].death / champData[index].play).toFixed(1),
      asistAvr: (champData[index].asist / champData[index].play).toFixed(1),
      winRatio: (champData[index].win / champData[index].play * 100).toFixed(2),
    };
  }

  return {
    keys,
    tableData,
  };
};
