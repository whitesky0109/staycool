export const sortMostChamp = (championPickBan) => {
  const keys = Object.keys(championPickBan);
  keys.sort((a, b) => {
    const beta = (championPickBan[b].pick + championPickBan[b].ban);
    const alpha = (championPickBan[a].pick + championPickBan[a].ban);

    return beta - alpha;
  });

  return keys;
};


export const sortMostDuo = (duoDatas) => {
  const keys = Object.keys(duoDatas);
  keys.sort((a, b) => {
    if (duoDatas[b].play < 5) { return -1; }
    if (duoDatas[a].play < 5) { return 1; }

    const beta = duoDatas[b].win / duoDatas[b].play;
    const alpha = duoDatas[a].win / duoDatas[a].play;

    return beta - alpha;
  });

  return keys;
};
