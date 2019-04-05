/* eslint-disable import/prefer-default-export */

export const sortChampPickBan = (championPickBan) => {
  const keys = Object.keys(championPickBan);
  keys.sort((a, b) => {
    const beta = (championPickBan[b].pick + championPickBan[b].ban);
    const alpha = (championPickBan[a].pick + championPickBan[a].ban);

    return beta - alpha;
  });
  return keys;
};
