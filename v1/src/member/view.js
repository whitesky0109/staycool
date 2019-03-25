/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import Chart from 'chart.js';

import * as commonView from '../common/view';
import { newElement } from '../utils';

let chart = null;

export const init = () => {
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.responsive = false;

  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');

  commonView.setHomeBanner(objHome);
  commonView.createMenubar(objMenu);
};


export const initPieChart = () => {
  const ctx = document.getElementById('mostLinePie');
  const mostLineArr = {
    datasets: [{
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
    }],
  };

  chart = new Chart(ctx, {
    type: 'pie',
    data: mostLineArr,
    options: {
      title: {
        display: true,
      },
      animation: {
        animateScale: true,
      },
    },
  });
};

export const updateChart = () => {
  chart.update();
};

const updateTitlePieChart = (text) => {
  chart.options.title.text = text;
};

const addDataPieChart = (label, data) => {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
};

export const updateMemberTable = (data) => {
  const tableBody = document.getElementById('memberTableBody');

  for (const index in data) {
    const {
      pk, fields,
    } = data[index];


    const memberTableRow = newElement('tr', { class: 'member-table_row' });
    const memberUserId = newElement('td');
    const memberUserIdLink = newElement('a', {
      href: `/profile/?userName=${pk}`,
      class: 'member-table_link',
    });
    memberUserIdLink.text = pk;
    const memberPreferLine = newElement('td');
    memberPreferLine.innerHTML = fields.preference_line;
    const memberTitle = newElement('td');
    const memberTitleBadge = newElement('span');

    switch (fields.position) {
      case 'master':
        memberTitleBadge.setAttribute('class', 'badge badge-success');
        break;
      case 'manager':
        memberTitleBadge.setAttribute('class', 'badge badge-warning');
        break;
      default:
        memberTitleBadge.setAttribute('class', 'badge badge-primary');
        break;
    }

    memberTitleBadge.innerHTML = fields.position;

    memberUserId.appendChild(memberUserIdLink);
    memberTitle.appendChild(memberTitleBadge);

    memberTableRow.append(memberUserId);
    memberTableRow.append(memberTitle);
    memberTableRow.append(memberPreferLine);
    tableBody.appendChild(memberTableRow);
  }
};

export const updateMemberChart = (data, {
  TOP, JUG, MID, BOT, SUP,
}) => {
  updateTitlePieChart(`Total member: ${data.length}`);
  addDataPieChart('TOP', TOP);
  addDataPieChart('JUG', JUG);
  addDataPieChart('MID', MID);
  addDataPieChart('BOT', BOT);
  addDataPieChart('SUP', SUP);

  updateChart();
};
