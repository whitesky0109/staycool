/* eslint-disable import/prefer-default-export */
import { newElement, settings } from '../utils';

import common from '../common';

export const init = () => {
  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');
  const objSeasonMonitor = document.getElementById('seasonMonitor');

  common.view.setHomeBanner(objHome);
  common.view.createMenubar(objMenu);
  common.view.createSeasonMonitor(objSeasonMonitor);
};

export const setSeasonTitle = (season) => {
  const elem = document.getElementById('seasonTitle');
  elem.innerHTML = `The Season: ${season}`;
};

export const setFirstMember = (userName, userData) => {
  const elem = document.getElementById('rankingFirst');

  const div = newElement('div');
  const tierImage = newElement('img', {
    class: 'ranking-highest-tier-img',
    src: settings.tier.challenger,
  });
  const infoDiv = newElement('div');
  const userIdLink = newElement('a', {
    href: `/profile/?userName=${userName}`,
    class: 'ranking-highest_name',
  });
  userIdLink.innerHTML = (userName);
  const userInfo = newElement('p');
  userInfo.innerHTML = `승률: ${userData.winRatio} %<br>게임 수: ${userData.play}`;

  div.appendChild(tierImage);
  infoDiv.appendChild(userIdLink);
  infoDiv.appendChild(userInfo);
  div.appendChild(infoDiv);

  elem.appendChild(div);
};

export const setHighRanker = (userName, userData) => {
  const obj = document.getElementById('rankingHighRankers');

  const $div = newElement('div', { class: 'col-sm-3' });
  const $tierImage = newElement('img', {
    class: 'ranking-highest-tier-img',
    src: settings.tier.master,
  });
  const $infoDiv = newElement('div');
  const $userIdLink = newElement('a', {
    href: `/profile/?userName=${userName}`,
    class: 'ranking-highest_name',
  });
  $userIdLink.innerHTML = userName;
  const $userInfo = newElement('p');
  $userInfo.innerHTML = `승률: ${userData.winRatio} %<br>게임 수: ${userData.play}`;

  $div.appendChild($tierImage);
  $infoDiv.appendChild($userIdLink);
  $infoDiv.appendChild($userInfo);
  $div.appendChild($infoDiv);

  obj.appendChild($div);
};

export const setRankingTable = (userKeys, userDatas) => {
  const table = document.getElementById('rankingList');

  for (let i = 5; i < userKeys.length; i += 1) {
    const $tableRowObj = newElement('tr', { class: 'ranking-list-table_row' });
    const $userIdObj = newElement('td');
    const $userIdLink = newElement('a', {
      href: `/profile/?userName=${userKeys[i]}`,
      class: 'ranking-highest_name',
    });
    $userIdLink.innerHTML = userKeys[i];
    const $tierObj = newElement('td');
    const $tierImage = newElement('img', { class: 'ranking-tier-img' });
    const $playObj = newElement('td');
    const $winRatioObj = newElement('td');

    $playObj.innerHTML = userDatas[userKeys[i]].play;
    $winRatioObj.innerHTML = `${userDatas[userKeys[i]].winRatio} %`;

    if (userDatas[userKeys[i]].play < 4) {
      $tableRowObj.classList.add('table-danger');
    }

    if (userDatas[userKeys[i]].play < 10) {
      $tierImage.setAttribute('src', settings.tier.unranked);
    } else if (Number(userDatas[userKeys[i]].winRatio) > 50) {
      $tierImage.setAttribute('src', settings.tier.diamond);
    } else if (Number(userDatas[userKeys[i]].winRatio) > 40) {
      $tierImage.setAttribute('src', settings.tier.platinum);
    } else {
      $tierImage.setAttribute('src', settings.tier.gold);
    }
    $tierObj.appendChild($tierImage);

    $userIdObj.appendChild($userIdLink);

    $tableRowObj.appendChild($userIdObj);
    $tableRowObj.appendChild($tierObj);
    $tableRowObj.appendChild($playObj);
    $tableRowObj.appendChild($winRatioObj);
    table.appendChild($tableRowObj);
  }
};
