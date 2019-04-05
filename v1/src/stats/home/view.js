/* eslint-disable import/prefer-default-export */

import * as commonView from '../../common/view';
import { newElement } from '../../utils';
import * as controller from './controller';

export const initMostChamp = () => {
  const targetElem = document.getElementById('statsMainDiv');
  targetElem.insertAdjacentHTML('beforeend', `
    <H2>Clan Most Champ</H2>
    <div id='clanMostChamp' class='stats-main-most mb-4'></div>
  `.trim());
};

export const setMostDuo = ({
  BOT, SUP, play, win,
}) => {
  const elem = document.getElementById('statsMainDiv');
  elem.insertAdjacentHTML('beforeend', `
    <h2>Clan BEST DUO</h2>
    <div class="best-duo">
        <h6 style="padding-top:130px"> BOT: ${BOT}/ SUP: ${SUP}</h6>
        <h6> PLAY: ${play}/ WIN: ${win}</h6>
    </div>
  `.trim());
};

const toMostChampDOM = (champ, { win, pick, ban }) => {
  // model data
  let winRatio = 0;
  if (pick != 0) {
    winRatio = (win / pick * 100).toFixed(2);
  }
  // console.log(champ);

  const $divObj = newElement('div', { class: 'col' });

  const $pickBanObj = newElement('h6');
  $pickBanObj.innerHTML = `Pick: ${pick} Ban: ${ban}`;
  const $winRatioObj = newElement('h6');
  $winRatioObj.innerHTML = `승률: ${winRatio}%`;
  $divObj.appendChild($pickBanObj);
  $divObj.appendChild($winRatioObj);

  commonView.setChampionImg($divObj, champ, controller.imgOption);

  return $divObj;
};

export const setMostChamp = (keys, championPickBan) => {
  const rootElem = document.getElementById('clanMostChamp');
  const $rowDiv = newElement('div', { class: 'row' });

  for (let i = 0; i < 3; i += 1) {
    const champ = keys[i];
    const dom = toMostChampDOM(champ, championPickBan[champ]);

    $rowDiv.appendChild(dom);
  }
  rootElem.appendChild($rowDiv);
};
