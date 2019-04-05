/* eslint-disable no-console */
import { backendSrv } from '../../utils';

import * as model from './model';
import * as view from './view';

export const imgOption = {
  src: 'sprite',
  version: '9.2.1',
  wrap: 2,
  skin: 1,
  gray: false,
  size: 'normal',
};

export const getData = async (season) => {
  try {
    const { data } = await backendSrv.getMostChampData(season);

    const keys = model.sortChampPickBan(data);
    view.setTable(keys, data);
  } catch (e) {
    console.error(e);
  }
};
