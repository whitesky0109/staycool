/* eslint-disable no-console */
import { backendSrv } from '../../utils';

import * as model from './model';
import * as view from './view';

export const imgOption = {
  src: 'full',
  version: '9.2.1',
  wrap: 2,
  skin: 1,
  gray: false,
  size: 'normal',
};

export const getMostChampData = async (season) => {
  try {
    const { data } = await backendSrv.getMostChampData(season);
    const keys = model.sortMostChamp(data);

    view.setMostChamp(keys, data);
  } catch (e) {
    console.error(e);
  }
};

export const getMostDuoData = async () => {
  try {
    const { data } = await backendSrv.getMostDuoData(0);
    const keys = model.sortMostDuo(data);
    view.setMostDuo(data[keys[0]]);
  } catch (e) {
    console.error(e);
  }
};
