
export const findUser = (userId, summaryUsers) => {
  const {
    kill, death, asist, win, play, winRatio,
  } = summaryUsers[userId];

  return {
    userId,
    kill,
    death,
    asist,
    win,
    play,
    winRatio,
  };
};

export const findCarry = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);
  keys.sort((a, b) => {
    if (summaryUsers[b].play < 10) { return -1; }

    if (summaryUsers[a].play < 10) { return 1; }

    const kdab = (summaryUsers[b].kill + summaryUsers[b].asist) / summaryUsers[b].death;
    const kdaa = (summaryUsers[a].kill + summaryUsers[a].asist) / summaryUsers[a].death;

    return kdab - kdaa;
  });

  return findUser(keys[0], summaryUsers);
};


export const findMurder = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);
  keys.sort((a, b) => {
    if (summaryUsers[b].play < 10) { return -1; }

    if (summaryUsers[a].play < 10) { return 1; }

    const kb = summaryUsers[b].kill / summaryUsers[b].play;
    const ka = summaryUsers[a].kill / summaryUsers[a].play;

    return kb - ka;
  });

  return findUser(keys[0], summaryUsers);
};

export const findTeresa = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);
  keys.sort((a, b) => {
    if (summaryUsers[b].play < 10) { return -1; }

    if (summaryUsers[a].play < 10) { return 1; }

    const kb = summaryUsers[b].asist / summaryUsers[b].play;
    const ka = summaryUsers[a].asist / summaryUsers[a].play;

    return kb - ka;
  });

  return findUser(keys[0], summaryUsers);
};

// 개복치
export const findMola = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);
  keys.sort((a, b) => {
    if (summaryUsers[b].play < 10) { return -1; }

    if (summaryUsers[a].play < 10) { return 1; }

    const kb = summaryUsers[b].death / summaryUsers[b].play;
    const ka = summaryUsers[a].death / summaryUsers[a].play;

    return kb - ka;
  });

  return findUser(keys[0], summaryUsers);
};

export const findJoiner = (summaryUsers) => {
  const keys = Object.keys(summaryUsers);

  keys.sort((a, b) => summaryUsers[b].play - summaryUsers[a].play);

  return findUser(keys[0], summaryUsers);
};
