/* eslint-disable no-console */
import { backendSrv } from '../../utils';

import common from '../../common';

import * as view from './view';

export const getData = async (season, userId) => {
  try {
    const { data } = await backendSrv.getSeasonData(season);

    const summaryRelative = common.model.summaryRelative(data, userId);

    const keys = Object.keys(summaryRelative);
    keys.sort((a, b) => summaryRelative[b].play - summaryRelative[a].play);

    view.initTable();
    view.setTable(keys, summaryRelative);
  } catch (e) {
    console.error(e);
  }
};

export const onSearch = (season) => {
  const name = document.getElementById('relativeSearchInput').value;
  const elem = document.getElementById('statsRelativeTable');
  if (elem) {
    elem.remove();
  }

  getData(season, name);
};
