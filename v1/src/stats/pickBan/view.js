import { newElement } from '../../utils';
import common from '../../common';

import * as ctrl from './controller';

export const initTable = () => {
  const rootElem = document.getElementById('statsMainDiv');
  rootElem.insertAdjacentHTML('beforeend', `
    <table class='table table-hover stats-table'>
      <colgroup><col width='50'><col width='50'><col width='50'><col width='50'></colgroup>
        <thead class='thead'>
          <tr>
            <th class='stats-table_header'>챔피언</th>
            <th class='stats-table_header'>승률</th>
            <th class='stats-table_header'>Pick</th>
            <th class='stats-table_header'>Ban</th>
          </tr>
      </thead>
      <tbody id='statsPickBanTableBody'></tbody>
    </table>
  `.trim());
};

const getTableBody = (elem, champ, { pick, ban, win }) => {
  let winRatio = 0;
  if (pick != 0) {
    winRatio = (win / pick * 100).toFixed(2);
  }
  const trElem = newElement('tr', { class: 'pickban-list-table_row' });
  const $championObj = newElement('td');
  common.view.setChampionImg($championObj, champ, ctrl.imgOption);

  trElem.appendChild($championObj);
  trElem.insertAdjacentHTML('beforeend', `
    <td>${winRatio}%</td>
    <td>${pick}</td>
    <td>${ban}</td>
  `);
  elem.appendChild(trElem);
};

export const setTable = (keys, championPickBan) => {
  const rootElem = document.getElementById('statsPickBanTableBody');

  for (let i = 0; i < keys.length; i += 1) {
    getTableBody(rootElem, keys[i], championPickBan[keys[i]]);
  }
};
