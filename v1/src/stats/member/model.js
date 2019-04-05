/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

const playObj = (userSeasonData) => {
  const obj = {};

  for (const index in userSeasonData) {
    const { user_id: userId } = userSeasonData[index].fields;

    if (obj[userId] === undefined) {
      obj[userId] = 1;
    } else {
      obj[userId] += 1;
    }
  }
  return obj;
};

export default playObj;
