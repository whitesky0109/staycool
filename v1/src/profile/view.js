/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import Chart from 'chart.js';
import * as commonView from '../common/view';
import { newElement, settings, backendSrv } from '../utils';

let chart = null;

export const updateChart = () => {
  chart.update();
};

export const initRadarChart = () => {
  const ctx = document.getElementById('profileRadar');
  const profileRadarArr = {
    labels: ['TOP', 'MID', 'JUG', 'BOT', 'SUP'],
    datasets: [
      {
        label: 'winrate',
        backgroundColor: 'rgba(255,0,0,0.2)',
        hoverBackgroundColor: 'rgb(255,0,0)',
        borderColor: 'rgba(255,0,0,1.0)',
      },
      {
        label: 'playrate',
        backgroundColor: 'rgba(0,255,0,0.2)',
        hoverBackgroundColor: 'rgb(0,255,0)',
        borderColor: 'rgba(0,255,0,1.0)',
      },
    ],
  };


  chart = new Chart(ctx, {
    type: 'radar',
    data: profileRadarArr,
    options: {
      title: {
        display: false,
      },
      animation: {
        animateScale: true,
      },
      scale: {
        pointLabels: {
          fontColor: 'white',
        },
        ticks: {
          max: 100,
          min: 0,
          display: false,
        },
        angleLines: {
          color: 'white',
        },
      },
      legend: {
        labels: {
          fontColor: 'white',
        },
      },
    },
  });
};

export const init = () => {
  const objHome = document.getElementById('alrHome');
  const objMenu = document.getElementById('alrMenu');
  const objSeasonMonitor = document.getElementById('seasonMonitor');

  commonView.setHomeBanner(objHome);
  commonView.createMenubar(objMenu);
  commonView.createSeasonMonitor(objSeasonMonitor);

  initRadarChart();
};

export const setUserName = (name) => {
  const profileNameObj = document.getElementById('profileName');

  profileNameObj.insertAdjacentHTML('beforeend', `<H3>${name}</H3>`);
  profileNameObj.setAttribute('href', `/profile/?userName=${name}`);
};

export const setRadarChartBackgroundImg = (champName) => {
  const elem = document.getElementById('profileStatus');
  elem.style.backgroundImage = `url(/static/airgg/riot_api/img/champion/splash/${champName}_0.jpg)`;
  elem.style.backgroundSize = '100%';
};

export const addWinrateRadarChart = (data) => {
  chart.data.datasets[0].data = data;
};

export const addPlayrateRadarChart = (data) => {
  chart.data.datasets[1].data = data;
};

export const setMainInfo = (line, winRatio = 0) => {
  const elem = document.getElementById('profileMainInfo');

  if (line === undefined) {
    line = 'Unknown';
  } else {
    const imgObj = newElement('img', { src: settings.lineImg[line] });
    elem.appendChild(imgObj);
  }

  elem.insertAdjacentHTML('beforeend', `<br>주 라인: ${line}<br>승률: ${winRatio}%`);
};

export const setChampImg = (elem, champion) => {
  const imgOption = {
    src: 'sprite',
    version: '9.2.1',
    wrap: 2,
    skin: 1,
    gray: false,
    size: 'normal',
    classes: 'profile-champTable_img',
  };
  commonView.setImg(elem, champion, imgOption);
};


export const setChampTable = ({ keys, tableData }) => {
  const tableBody = document.getElementById('profileChampTableBody');

  for (const index of keys) {
    const tableRowObj = newElement('tr', { class: 'profile-champTable_row' });
    const championObj = newElement('td');
    const playObj = newElement('td');
    const kdaObj = newElement('td');
    const avrObj = newElement('td');
    const winRatioObj = newElement('td');

    const {
      play, kda, killAvr, deathAvr, asistAvr, winRatio,
    } = tableData[index];

    playObj.innerHTML = play;
    kdaObj.innerHTML = kda;
    avrObj.innerHTML = `${killAvr}/${deathAvr}/${asistAvr}`;
    winRatioObj.innerHTML = `${winRatio}%`;

    backendSrv.getChampionImg(index).then(({ data: championInfo }) => {
      setChampImg(championObj, championInfo.data[index]);
    });

    tableRowObj.appendChild(championObj);
    tableRowObj.appendChild(playObj);
    tableRowObj.appendChild(kdaObj);
    tableRowObj.appendChild(avrObj);
    tableRowObj.appendChild(winRatioObj);
    tableBody.appendChild(tableRowObj);
  }
};
