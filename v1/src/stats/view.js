/* eslint-disable import/prefer-default-export */
import common from '../common';

export const init = () => {
  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');
  const objSeasonMonitor = document.getElementById('seasonMonitor');

  common.view.setHomeBanner(objHome);
  common.view.createMenubar(objMenu);
  common.view.createSeasonMonitor(objSeasonMonitor);
};
