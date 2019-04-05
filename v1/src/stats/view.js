/* eslint-disable import/prefer-default-export */
import * as commonView from '../common/view';

export const init = () => {
  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');
  const objSeasonMonitor = document.getElementById('seasonMonitor');

  commonView.setHomeBanner(objHome);
  commonView.createMenubar(objMenu);
  commonView.createSeasonMonitor(objSeasonMonitor);
};
