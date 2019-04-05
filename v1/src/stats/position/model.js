/* eslint-disable import/prefer-default-export */

export const findMostLiner = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);

  keys.sort((a, b) => summaryUsers[b].play - summaryUsers[a].play);

  const {
    kill, death, asist, win, play, winRatio,
  } = summaryUsers[keys[0]];

  return {
    userId: keys[0],
    kill,
    death,
    asist,
    win,
    play,
    winRatio,
  };
};
