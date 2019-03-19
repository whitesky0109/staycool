/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import $ from 'jquery';
import common from './common';
import stats from './stats';

class Home {
  constructor() {
    this.init = () => {
      const objHome = $('#alrHome');
      const objMenu = $('#alrMenu');
      const objSeasonMonitor = $('#seasonMonitor');
      const getParams = common.getRequest();
      const season = common.season.getSeason(getParams.season);

      common.createHomeBanner(objHome);
      common.createMenubar(objMenu);
      common.createSeasonMonitor(objSeasonMonitor);

      this.setSeasonTitle(season);
      this.getSeasonData(season);

      common.season.setUpdateFunc((s) => {
        this.clearPage();

        this.setSeasonTitle(s);
        this.getSeasonData(s);
      });

      common.version();
    };
    this.clearPage = () => {
      $('#bestTitle').empty();
      $('#bestUserName').empty();
      $('#bestChampion').empty();
      $('#bestUserLine').empty();
      $('#bestUserKDA').empty();
    };
    this.setSeasonTitle = (season) => {
      const objTitle = $('#bestTitle');

      objTitle.text(`${season} 시즌 MVP`);
    };
    this.getSeasonData = (season) => {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `/f/season/users/?season=${season}`,
        success: (userMonthData) => {
          const summaryUsers = common.season.summaryUsers(userMonthData);
          const carry = stats.title.findCarry(summaryUsers);
          this.setBestPlayer(carry.userId);
          this.setUserKDA(carry);
        },
        error: (e) => {
          console.log(e.responseText);
        },
      });
    };
    this.setBestPlayer = (userName) => {
      this.loadUserData(userName);
    };
    this.loadUserData = (userName) => {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `/f/profile/?userName=${userName}`,
        success: (userGameData) => {
          const objChamp = $('#bestChampion');
          const objUser = $('#bestUserName');
          const $userIdLink = $('<a>', {
            href: `/profile/?userName=${userName}`,
            class: 'home-user-name',
          }).text(userName);
          const { champion, line } = common.user.summaryMostData(userGameData);

          objUser.append($userIdLink);
          common.champion.getImg(objChamp, champion, null);
          this.setUserLine(line);
        },
        error(e) {
          console.log(e.responseText);
        },
      });
    };
    this.setUserLine = (line) => {
      const obj = $('#bestUserLine');

      if (line === undefined) {
        line = 'Unknown';
      }

      obj.append(`주 라인: ${line}`);
    };
    this.setUserKDA = (result) => {
      const obj = $('#bestUserKDA');
      const { kill, asist, death } = result;

      if (death === 0) {
        result.death = 1;
      }

      const kda = ((kill + asist) / death).toFixed(2);

      obj.append(`KDA: ${kda}`);
    };
  }
}

const home = new Home();

window.home = home;

export default home;
