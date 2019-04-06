/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
import { newElement, emptyElement } from '../utils';
import common from '../common';

export const init = () => {
  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');

  common.view.setHomeBanner(objHome);
  common.view.createMenubar(objMenu);
};

export const creatSelectUser = (elem, members, id) => {
  const divTop = newElement('div', { class: 'row input-group ml-2 mt-2 mb-2 pr-4 input-group-lg' });
  const divAppend = newElement('div', { class: 'input-group-append' });
  const span = newElement('span', { class: 'input-group-text' });
  span.innerHTML = 'USER_ID';
  const selectObj = newElement('select', { class: 'form-control', id });
  const op = newElement('option');
  op.innerHTML = 'UNKNOWN';

  selectObj.appendChild(op);

  for (const index in members) {
    const optionObj = newElement('option');
    optionObj.text = members[index].pk;
    selectObj.appendChild(optionObj);
  }

  divAppend.appendChild(span);
  divTop.appendChild(divAppend);
  divTop.appendChild(selectObj);
  elem.appendChild(divTop);
};

export const createSelectUsers = (members) => {
  const team1Prefix = 'team1UserId';
  const team1Grp = document.getElementById('team1Group');
  const team2Prefix = 'team2UserId';
  const team2Grp = document.getElementById('team2Group');

  for (let i = 0; i < 5; i += 1) {
    creatSelectUser(team1Grp, members, team1Prefix + i);
  }

  for (let i = 0; i < 5; i += 1) {
    creatSelectUser(team2Grp, members, team2Prefix + i);
  }
};

export const getTeamMemberIDs = (teamNum) => {
  const teamMemberIDs = [];
  for (let i = 0; i < 5; i += 1) {
    const elem = document.getElementById(`team${teamNum}UserId${i}`);
    teamMemberIDs.push(elem.value);
  }

  emptyElement(`team${teamNum}MostChampDiv`);
  return teamMemberIDs;
};

export const predictLine = (teamNum, lines) => {
  for (const line in lines) {
    const elem = document.getElementById(`team${teamNum}Predict${line}`);
    elem.innerHTML = lines[line];
  }
};

export const setTeamChampImg = (teamNum, champion) => {
  const imgOption = {
    src: 'sprite',
    version: '9.2.1',
    wrap: 2,
    skin: 1,
    gray: false,
    size: 'normal',
    classes: 'ml-3',
  };
  const champElem = document.getElementById(`team${teamNum}MostChampDiv`);
  common.view.setImg(champElem, champion, imgOption);
};
