/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { settings, locationSrv, newElement, backendSrv } from '../utils';
import commonCtrl from './index';

export const setHomeBanner = (elem) => {
  const imgElem = newElement('img', {
    src: settings.homeBanner,
    width: '1060px',
  }, {
    click: locationSrv.moveHome.bind(this),
  });

  elem.appendChild(imgElem);
};

export const createMenubar = (elem) => {
  const menubarElem = newElement('ul', { class: 'alr-menubar' });

  for (const { href, title } of settings.menuList) {
    const aElem = newElement('a', {
      href,
    });
    aElem.innerHTML = title;
    const liElem = newElement('li', {
      class: 'alr-menubar li-category',
    });
    liElem.appendChild(aElem);
    menubarElem.appendChild(liElem);
  }

  const searchLiElem = newElement('li', { class: 'alr-menubar li-search' });
  const inputElem = newElement('input', { id: 'airSearchInput', type: 'text', placeholder: 'Search..' });
  const searchBtn = newElement('button', { id: 'airSearchBtn' }, { click: locationSrv.search.bind(this) });
  const searchBtnImg = newElement('img', { src: '/static/airgg/img/search.png' });

  searchBtn.appendChild(searchBtnImg);

  searchLiElem.appendChild(inputElem);
  searchLiElem.appendChild(searchBtn);

  menubarElem.appendChild(searchLiElem);

  elem.appendChild(menubarElem);
};

export const createSeasonMonitor = (elem) => {
  const objSeasonMonitor = newElement('div', { class: 'row input-group ml-2 mt-1 mb-2 mr-1 input-group-sm' });
  const objInputDiv = newElement('div', { class: 'input-group-append' });
  const objSpan = newElement('span', { class: 'input-group-text' });
  objSpan.innerHTML = 'Season';
  const objSelect = newElement('select', { id: 'airSeason', class: 'form-control input-sm-7' }, {
    change: commonCtrl.changeSeason.bind(commonCtrl),
  });
  const objDummy = newElement('div', { class: 'sub-nav-div-dummy' });

  for (let i = settings.nowSeason; i > 0; i -= 1) {
    const item = newElement('option');
    item.text = i;
    objSelect.append(item);
  }

  const op = newElement('option');
  op.text = 'ALL';
  objSelect.appendChild(op);

  objInputDiv.appendChild(objSpan);
  objSeasonMonitor.appendChild(objInputDiv);
  objSeasonMonitor.appendChild(objSelect);
  objSeasonMonitor.appendChild(objDummy);

  elem.appendChild(objSeasonMonitor);
};

export const updateVersion = (data) => {
  const versionDivElem = document.getElementById('airVersion');

  const stampElem = newElement('p');
  stampElem.innerHTML = "Produced by 'AlR 펌프'";

  versionDivElem.appendChild(stampElem);

  const versionElem = newElement('p');
  versionElem.innerHTML = `Updated by ${data.date}`;

  versionDivElem.appendChild(versionElem);
};

export const setImg = (elem, championInfo, option) => {
  const imgOption = option || {
    src: 'full',
    version: '9.2.1',
    wrap: 2,
    skin: 1,
    gray: false,
    size: 'normal',
  };
  elem.insertAdjacentHTML('beforeend', window.Riot.DDragon.fn.getImg(championInfo, imgOption));
};

export const setChampionImg = async (elem, champ, option) => {
  try {
    // invalid mvc pattern
    const { data } = await backendSrv.getChampionImg(champ);
    const championInfo = data.data[champ];
    setImg(elem, championInfo, option);
  } catch (e) {
    console.error(e);
  }
};
