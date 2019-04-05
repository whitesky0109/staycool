/* eslint-disable no-restricted-syntax */
import { newElement } from '../../utils';

import * as controller from './controller';

export const initSearchButton = (season) => {
  const rootElem = document.getElementById('statsMainDiv');

  rootElem.insertAdjacentHTML('beforeend', `
  <div class="input-group mb-3 input-group-lg col-lg-6 col-sm-7">
    <div class="input-group-prepend">
      <span class="input-group-text">USER_ID</span>
    </div>
    <input id='relativeSearchInput' class='form-control' type='text' placeholder='Search..'>
    <div class="input-group-append">
        
    </div>
  </div>
  `.trim());

  const btnElem = newElement('button', {
    id: 'relativeSearchBtn',
    class: 'stats-relative-searchBtn',
  }, {
    click: controller.onSearch.bind(this, season),
  });

  btnElem.insertAdjacentHTML('beforeend', `
    <img id='relativeSearchBtnImg' src="/static/airgg/img/search.png" />
  `);
  rootElem.getElementsByClassName('input-group-append')[0].appendChild(btnElem);
};

export const initTable = () => {
  const rootElem = document.getElementById('statsMainDiv');

  rootElem.insertAdjacentHTML('beforeend', `
  <table id='statsRelativeTable' class='table table-hover stats-table'>
    <colgroup><col width='100'><col width='40'><col width='40'><col width='50'><col width='30'><col width='30'><col width='30'><col width='30'><col width='30'></colgroup>
    <thead class='thead'>
      <tr>
        <th class='stats-table_header'>USER</th>
        <th class='stats-table_header'>WINRATIO</th>
        <th class='stats-table_header'>WIN</th>
        <th class='stats-table_header'>PLAY</th>
        <th class='stats-table_header'>TOP</th>
        <th class='stats-table_header'>JUG</th>
        <th class='stats-table_header'>MID</th>
        <th class='stats-table_header'>BOT</th>
        <th class='stats-table_header'>SUP</th>
      </tr>
    </thead>
    <tbody id='statsRelativeTableBody'></tbody>
  </table>
  `.trim());
};

export const setTable = (keys, relativeObj) => {
  const rootElem = document.getElementById('statsRelativeTableBody');

  for (const id of keys) {
    const {
      win, play, TOP, JUG, MID, BOT, SUP,
    } = relativeObj[id];
    const winRatio = (win / play * 100).toFixed(2);
    rootElem.insertAdjacentHTML('beforeend', `
    <tr>
        <td><a href="/profile/?userName=${id}">${id}</a></td>
        <td>${winRatio}%</td>
        <td>${win}</td>
        <td>${play}</td>
        <td>${TOP}</td>
        <td>${JUG}</td>
        <td>${MID}</td>
        <td>${BOT}</td>
        <td>${SUP}</td>
    </tr>
    `);
  }
};
