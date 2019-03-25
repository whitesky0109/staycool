/* eslint-disable no-restricted-syntax */
import { emptyElement, newElement } from '../utils';

import * as commonView from '../common/view';

export const setSeasonTitle = (season) => {
  const objTitle = document.getElementById('bestTitle');

  objTitle.innerHTML = `${season} 시즌 MVP`;
};

export const clearPage = () => {
  const ids = ['bestTitle', 'bestUserName', 'bestChampion', 'bestUserLine', 'bestUserKDA'];
  for (const id of ids) {
    emptyElement(id);
  }
};

export const setBestPlayer = (userName) => {
  const objUser = document.getElementById('bestUserName');

  const userIdLink = newElement('a', {
    href: `/profile/?userName=${userName}`,
    class: 'home-user-name',
  });
  userIdLink.innerHTML = userName;

  objUser.appendChild(userIdLink);
};

export const setUserLine = (line = 'Unknown') => {
  const elem = document.getElementById('bestUserLine');
  elem.innerHTML = `주 라인: ${line}`;
};

export const setUserKDA = (kda) => {
  const kdaElem = document.getElementById('bestUserKDA');
  kdaElem.innerHTML = `KDA: ${kda}`;
};

export const init = () => {
  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');
  const objSeasonMonitor = document.getElementById('seasonMonitor');

  commonView.setHomeBanner(objHome);
  commonView.createMenubar(objMenu);
  commonView.createSeasonMonitor(objSeasonMonitor);
};
