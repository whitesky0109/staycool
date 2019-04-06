/* eslint-disable import/prefer-default-export */
export const sortedSummaryUsers = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);
  keys.sort((a, b) => {
    if (summaryUsers[b].play < 10) { return -1; }

    if (summaryUsers[a].play < 10) { return 1; }

    return summaryUsers[b].winRatio - summaryUsers[a].winRatio;
  });

  return keys;
};
