/* eslint-disable import/prefer-default-export */
export const getKda = ({ kill, asist, death = 1 }) => ((kill + asist) / death).toFixed(2);
