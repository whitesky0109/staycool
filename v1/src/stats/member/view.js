/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import * as ctrl from './controller';

export const initTable = () => {
  const rootElem = document.getElementById('statsMainDiv');

  rootElem.insertAdjacentHTML('beforeend', `
    <table class='table table-hover stats-table'>
        <colgroup><col width='50'><col width='50'></colgroup>
        <thead class='thead'>
            <tr>
                <th class='stats-table_header'>USER_ID</th>
                <th class='stats-table_header'>PLAYS</th>
            </tr>
        </thead>
        <tbody id='statsMemberTableBody'></tbody>
    </table>
  `.trim());
};

export const setTableBody = (members) => {
  const rootElem = document.getElementById('statsMemberTableBody');
  let i = 0;

  for (const index in members) {
    const userId = members[index].pk;

    rootElem.insertAdjacentHTML('beforeend', `
      <tr class='member-list-table_row'>
        <td>${userId}</td>
        <td id='userId${i}'>0</td>
      </tr>
    `.trim());

    ctrl.memberHashKeys[userId] = i;
    i += 1;
  }
};

export const setUserId = (playObj) => {
  for (const index in playObj) {
    const obj = document.getElementById(`userId${ctrl.memberHashKeys[index]}`);

    obj.innerText = playObj[index];
  }
};
