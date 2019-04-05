/* eslint-disable no-console */
import { backendSrv } from '../../utils';

import * as view from './view';
import model from './model';

export const memberHashKeys = [];

export const setMemberNames = async () => {
  try {
    const { data } = await backendSrv.getMembers();

    view.setTableBody(data);
  } catch (e) {
    console.error(e);
  }
};

export const getData = async (season) => {
  try {
    const { data } = await backendSrv.getSeasonData(season);
    const playObj = model(data);

    view.setUserId(playObj);
  } catch (e) {
    console.error(e);
  }
};
