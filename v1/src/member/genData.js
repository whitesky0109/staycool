/* eslint-disable import/prefer-default-export */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

export const updatePosition = (obj, data) => {
  const updateObj = Object.assign(obj);
  for (const index in data) {
    const { preference_line: preferenceLine } = data[index].fields;
    updateObj[preferenceLine] += 1;
  }
  return updateObj;
};
