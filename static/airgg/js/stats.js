/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */

import $ from 'jquery';
import common from './common';

class Stats {
  constructor() {
    this.home = {
      getMostChampData: (ss) => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/f/season/pickban/?season=${ss}`,
          success: (championPickBan) => {
            const keys = Object.keys(championPickBan);
            keys.sort((a, b) => {
              const beta = (championPickBan[b].pick + championPickBan[b].ban);
              const alpha = (championPickBan[a].pick + championPickBan[a].ban);

              return beta - alpha;
            });

            this.home.setMostChamp(keys, championPickBan);
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      getMostDuoData: () => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: '/f/season/duo/?season=0',
          success: (duoDatas) => {
            const obj = $('#statsMainDiv');
            const keys = Object.keys(duoDatas);
            keys.sort((a, b) => {
              if (duoDatas[b].play < 5) { return -1; }

              if (duoDatas[a].play < 5) { return 1; }

              const beta = duoDatas[b].win / duoDatas[b].play;
              const alpha = duoDatas[a].win / duoDatas[a].play;

              return beta - alpha;
            });

            this.home.setMostDuo(obj, duoDatas[keys[0]]);
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      initMostChamp: () => {
        const obj = $('#statsMainDiv');
        const $mostChampObj = $("<div id='clanMostChamp' class='stats-main-most mb-4'></div>");

        obj.append('<H2>Clan Most Champ</H2>');
        obj.append($mostChampObj);
      },
      setMostChamp: (keys, championPickBan) => {
        const obj = $('#clanMostChamp');
        const $rowDiv = $('<div>', { class: 'row' });
        const imgOption = {
          src: 'full', version: '9.2.1', wrap: 2, skin: 1, gray: false, size: 'normal',
        };

        let winRatio = 0;
        for (let i = 0; i < 3; i += 1) {
          const $divObj = $('<div class="col">');
          const $pickBanObj = $('<H6>');
          const $winRatioObj = $('<H6>');
          const index = keys[i];
          const { win, pick, ban } = championPickBan[index];

          if (pick !== 0) {
            winRatio = (win / pick * 100).toFixed(2);
          }
          common.champion.getImg($divObj, index, imgOption);
          $pickBanObj.text(`Pick: ${pick} Ban: ${ban}`);
          $winRatioObj.text(`승률: ${winRatio}%`);

          $divObj.append($pickBanObj);
          $divObj.append($winRatioObj);

          $rowDiv.append($divObj);
        }
        obj.append($rowDiv);
      },
      setMostDuo: (obj, {
        play, win, BOT, SUP,
      }) => {
        const $div = $('<div class="best-duo">');
        const $bestDuoTitle = $('<h2>Clan BEST DUO</h2>');
        const $duoNameInfo = $(`<h6 style="padding-top:130px"> BOT: ${BOT}/ SUP: ${SUP}</h6>`);
        const $duoGameInfo = $(`<h6> PLAY: ${play}/ WIN: ${win}</h6>`);

        $div.append($duoNameInfo);
        $div.append($duoGameInfo);

        obj.append($bestDuoTitle);
        obj.append($div);
      },
    };
    this.pickBan = {
      getData: (season) => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/f/season/pickban/?season=${season}`,
          success: (championPickBan) => {
            const keys = Object.keys(championPickBan);
            keys.sort((a, b) => {
              const beta = (championPickBan[b].pick + championPickBan[b].ban);
              const alpha = (championPickBan[a].pick + championPickBan[a].ban);

              return beta - alpha;
            });

            this.pickBan.setTable(keys, championPickBan);
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      initTable: () => {
        const obj = $('#statsMainDiv');

        const $tableContainer = $("<table class='table table-hover stats-table'> </table>");
        const $tableColgroup = $("<colgroup><col width='50'><col width='50'><col width='50'><col width='50'></colgroup>");
        const $tableThead = $("<thead class='thead'></thead>");
        const $tableTheadTr = $('<tr></tr>');
        const $tableTheadTitleChamp = $("<th class='stats-table_header'>챔피언</th>");
        const $tableTheadTitleWinRatio = $("<th class='stats-table_header'>승률</th>");
        const $tableTheadTitlePick = $("<th class='stats-table_header'>Pick</th>");
        const $tableTheadTitleBan = $("<th class='stats-table_header'>Ban</th>");
        const $tableBody = $("<tbody id='statsPickBanTableBody'></tbody>");

        $tableTheadTr.append($tableTheadTitleChamp);
        $tableTheadTr.append($tableTheadTitleWinRatio);
        $tableTheadTr.append($tableTheadTitlePick);
        $tableTheadTr.append($tableTheadTitleBan);
        $tableThead.append($tableTheadTr);

        $tableContainer.append($tableColgroup);
        $tableContainer.append($tableThead);
        $tableContainer.append($tableBody);

        obj.append($tableContainer);
      },
      setTable: (keys, championPickBan) => {
        const obj = $('#statsPickBanTableBody');
        const imgOption = {
          src: 'sprite', version: '9.2.1', wrap: 2, skin: 1, gray: false, size: 'normal',
        };

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          const { pick, ban, win } = championPickBan[key];
          const $tableRowObj = $('<tr>', { class: 'pickban-list-table_row' });
          const $championObj = $('<td>');
          const $winRatioObj = $('<td>');
          const $pickObj = $('<td>').text(pick);
          const $banObj = $('<td>').text(ban);

          let winRatio = 0;
          if (pick !== 0) {
            winRatio = (win / pick * 100).toFixed(2);
          }

          common.champion.getImg($championObj, key, imgOption);
          $winRatioObj.text(`${winRatio}%`);

          $tableRowObj.append($championObj);
          $tableRowObj.append($winRatioObj);
          $tableRowObj.append($pickObj);
          $tableRowObj.append($banObj);
          obj.append($tableRowObj);
        }
      },
    };
    this.title = {
      comments: {
        CARRY: '가장 높은 KDA 수치를 보유',
        MURDER: '내전에서 가장 높은 킬 수치를 보유',
        TERESA: '내전에서 가장 높은 어시스트 수치를 보유',
        JOINER: '내전  참가를 가장 많이한 사람',
        MOLA: '내전에서 가장 높은 데스 수치를 보유',
        THE_JUNGLE: '협곡 그 자체...',
      },
      getSeasonUserData: (season) => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/f/season/users/?season=${season}`,
          success: (userSeasonData) => {
            const summaryUsers = common.season.summaryUsers(userSeasonData);
            const { title } = this;

            const carry = title.findCarry(summaryUsers);
            const murder = title.findMurder(summaryUsers);
            const teresa = title.findTeresa(summaryUsers);
            const mola = title.findMola(summaryUsers);
            const joiner = title.findJoiner(summaryUsers);
            const theJungle = title.findUser('AlR 쩨이', summaryUsers);

            title.setTitle(carry, '케리', common.tier.challenger, title.comments.CARRY);
            title.setTitle(murder, '학살자', common.tier.challenger, title.comments.MURDER);
            title.setTitle(teresa, '테레사', common.tier.challenger, title.comments.TERESA);
            title.setTitle(mola, '개복치', common.tier.challenger, title.comments.MOLA);
            title.setTitle(joiner, '개근', common.tier.challenger, title.comments.JOINER);
            title.setTitle(theJungle, '더 정글', common.tier.challenger, title.comments.THE_JUNGLE);
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      findCarry: (summaryUsers) => {
        const keys = Object.keys(summaryUsers);
        keys.sort((a, b) => {
          if (summaryUsers[b].play < 10) { return -1; }

          if (summaryUsers[a].play < 10) { return 1; }

          const kdab = (summaryUsers[b].kill + summaryUsers[b].asist) / summaryUsers[b].death;
          const kdaa = (summaryUsers[a].kill + summaryUsers[a].asist) / summaryUsers[a].death;

          return kdab - kdaa;
        });

        const key = keys[0];
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[key];

        return {
          userId: key, kill, death, asist, win, play, winRatio,
        };
      },
      findMurder: (summaryUsers) => {
        const keys = Object.keys(summaryUsers);
        keys.sort((a, b) => {
          if (summaryUsers[b].play < 10) { return -1; }

          if (summaryUsers[a].play < 10) { return 1; }

          const kb = summaryUsers[b].kill / summaryUsers[b].play;
          const ka = summaryUsers[a].kill / summaryUsers[a].play;

          return kb - ka;
        });

        const key = keys[0];
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[key];

        return {
          userId: key, kill, death, asist, win, play, winRatio,
        };
      },
      findTeresa: (summaryUsers) => {
        const keys = Object.keys(summaryUsers);
        keys.sort((a, b) => {
          if (summaryUsers[b].play < 10) { return -1; }

          if (summaryUsers[a].play < 10) { return 1; }

          const kb = summaryUsers[b].asist / summaryUsers[b].play;
          const ka = summaryUsers[a].asist / summaryUsers[a].play;

          return kb - ka;
        });

        const key = keys[0];
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[key];

        return {
          userId: key, kill, death, asist, win, play, winRatio,
        };
      },
      // 개복치
      findMola: (summaryUsers) => {
        const keys = Object.keys(summaryUsers);
        keys.sort((a, b) => {
          if (summaryUsers[b].play < 10) { return -1; }

          if (summaryUsers[a].play < 10) { return 1; }

          const kb = summaryUsers[b].death / summaryUsers[b].play;
          const ka = summaryUsers[a].death / summaryUsers[a].play;

          return kb - ka;
        });

        const key = keys[0];
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[key];

        return {
          userId: key, kill, death, asist, win, play, winRatio,
        };
      },
      findJoiner: (summaryUsers) => {
        const keys = Object.keys(summaryUsers);
        keys.sort((a, b) => summaryUsers[b].play - summaryUsers[a].play);

        const key = keys[0];
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[key];

        return {
          userId: key, kill, death, asist, win, play, winRatio,
        };
      },
      findUser: (userId, summaryUsers) => {
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[userId];

        return {
          userId, kill, death, asist, win, play, winRatio,
        };
      },
      setTitle: (user, title, img, desc) => {
        const obj = $('#statsMainDiv');
        const $titleDiv = $('<div>', { class: 'row stats-title-div border border-info' });
        const $titleImgDiv = $('<div>', { class: 'col-sm-4' });
        const $titleInfoDiv = $('<div>', { class: 'col-sm-4' });
        const $titleDocDiv = $('<div>', { class: 'col-sm-4' });

        const $imgObj = $('<img>', { src: img, class: 'stats-title-img' });
        const $titleNameObj = $(`<H4><span class="badge badge-primary">${title}</H4>`);
        const $infoIdObj = $('<p>');
        const $infoKdaObj = $('<p>');
        const $infoPlayObj = $('<p>');
        const $docObj = $('<p>');

        const k = (user.kill / user.play).toFixed(1);
        const d = (user.death / user.play).toFixed(1);
        const a = (user.asist / user.play).toFixed(1);

        $infoIdObj.text(user.userId);
        $infoKdaObj.text(`KDA: ${k}/${d}/ ${a}`);
        $infoPlayObj.text(`Play: ${user.play}`);
        $docObj.text(desc);

        $titleImgDiv.append($imgObj);
        $titleInfoDiv.append($titleNameObj);
        $titleInfoDiv.append($infoIdObj);
        $titleInfoDiv.append($infoKdaObj);
        $titleInfoDiv.append($infoPlayObj);
        $titleDocDiv.append($docObj);

        $titleDiv.append($titleImgDiv);
        $titleDiv.append($titleInfoDiv);
        $titleDiv.append($titleDocDiv);
        obj.append($titleDiv);
      },
    };
    this.position = {
      lineComment: {
        TOP: 'The Top liner',
        JUG: 'The Jungle liner',
        MID: 'The Mid liner',
        BOT: 'The Bot liner',
        SUP: 'The Support Liner',
      },
      getUserData: (season) => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/f/season/users/?season=${season}`,
          success: (userSeasonData) => {
            const summaryPUsers = common.season.summaryPositionUsers(userSeasonData);
            const { position } = this;

            const mostTopUser = position.findMostLiner(summaryPUsers.TOP);
            const mostMidUser = position.findMostLiner(summaryPUsers.MID);
            const mostJugUser = position.findMostLiner(summaryPUsers.JUG);
            const mostBotUser = position.findMostLiner(summaryPUsers.BOT);
            const mostSupUser = position.findMostLiner(summaryPUsers.SUP);

            position.setTitle(mostTopUser, 'TOP', common.lineImg.TOP, position.lineComment.TOP);
            position.setTitle(mostJugUser, 'JUG', common.lineImg.JUG, position.lineComment.JUG);
            position.setTitle(mostMidUser, 'MID', common.lineImg.MID, position.lineComment.MID);
            position.setTitle(mostBotUser, 'BOT', common.lineImg.BOT, position.lineComment.BOT);
            position.setTitle(mostSupUser, 'SUP', common.lineImg.TOP, position.lineComment.SUP);
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      findMostLiner: (summaryUsers) => {
        const keys = Object.keys(summaryUsers);

        keys.sort((a, b) => summaryUsers[b].play - summaryUsers[a].play);

        const key = keys[0];
        const {
          kill, death, asist, win, play, winRatio,
        } = summaryUsers[key];

        return {
          userId: key, kill, death, asist, win, play, winRatio,
        };
      },
      setTitle: ({
        kill, play, death, asist, userId,
      }, title, img, desc) => {
        const obj = $('#statsMainDiv');
        const $titleDiv = $('<div>', { class: 'row stats-title-div border border-info' });
        const $titleImgDiv = $('<div>', { class: 'col-sm-4' });
        const $titleInfoDiv = $('<div>', { class: 'col-sm-4' });
        const $titleDocDiv = $('<div>', { class: 'col-sm-4' });

        const $imgObj = $('<img>', { src: img });
        const $titleNameObj = $(`<H4><span class="badge badge-primary">${title}</H4>`);
        const $infoIdObj = $('<p>');
        const $infoKdaObj = $('<p>');
        const $infoPlayObj = $('<p>');
        const $docObj = $('<p>');

        const k = (kill / play).toFixed(1);
        const d = (death / play).toFixed(1);
        const a = (asist / play).toFixed(1);

        $infoIdObj.text(userId);
        $infoKdaObj.text(`KDA: ${k}/${d}/ ${a}`);
        $infoPlayObj.text(`Play: ${play}`);
        $docObj.text(desc);

        $titleImgDiv.append($imgObj);
        $titleInfoDiv.append($titleNameObj);
        $titleInfoDiv.append($infoIdObj);
        $titleInfoDiv.append($infoKdaObj);
        $titleInfoDiv.append($infoPlayObj);
        $titleDocDiv.append($docObj);

        $titleDiv.append($titleImgDiv);
        $titleDiv.append($titleInfoDiv);
        $titleDiv.append($titleDocDiv);
        obj.append($titleDiv);
      },
    };
    this.relative = {
      initSearchButton: (season) => {
        const obj = $('#statsMainDiv');

        const $div = $('<div>', { class: 'input-group mb-3 input-group-lg col-lg-6 col-sm-7' });
        const $divAppendObj = $('<div>', { class: 'input-group-append' });
        const $divPrependObj = $('<div>', { class: 'input-group-prepend' });
        const $divPrependValObj = $('<span>', { class: 'input-group-text' }).text('USER_ID');
        const $searchInputObj = $("<input id='relativeSearchInput' class='form-control' type='text' placeholder='Search..'>'");
        const $searchButtonObj = $('<button>', {
          id: 'relativeSearchBtn',
          onclick: `stats.relative.onSearch(${season})`,
          class: 'stats-relative-searchBtn',
        });

        const $searchButtonImg = $('<img>', {
          id: 'relativeSearchBtnImg',
          src: '/static/airgg/img/search.png',
        });

        $div.append($divPrependObj);

        $searchButtonObj.append($searchButtonImg);
        $divPrependObj.append($divPrependValObj);
        $div.append($searchInputObj);
        $divAppendObj.append($searchButtonObj);

        $div.append($divAppendObj);
        obj.append($div);
      },
      onSearch: (season) => {
        const name = $('#relativeSearchInput').val();

        $('#statsRelativeTable').remove();

        this.relative.getData(season, name);
      },
      getData: (season, userId) => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/f/season/users/?season=${season}`,
          success: (userSeasonData) => {
            let summaryRelative = {};
            summaryRelative = common.season.summaryRelative(userSeasonData, userId);

            const keys = Object.keys(summaryRelative);
            keys.sort((a, b) => summaryRelative[b].play - summaryRelative[a].play);

            this.relative.initTable();
            this.relative.setTable(keys, summaryRelative);
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      initTable: () => {
        const obj = $('#statsMainDiv');

        const $tableContainer = $("<table id='statsRelativeTable' class='table table-hover stats-table'> </table>");
        const $tableColgroup = $("<colgroup><col width='100'><col width='40'><col width='40'><col width='50'><col width='30'><col width='30'><col width='30'><col width='30'><col width='30'></colgroup>");
        const $tableThead = $("<thead class='thead'></thead>");
        const $tableTheadTr = $('<tr></tr>');
        const $tableTheadTitleUser = $("<th class='stats-table_header'>USER</th>");
        const $tableTheadTitleWinratio = $("<th class='stats-table_header'>WINRATIO</th>");
        const $tableTheadTitleWin = $("<th class='stats-table_header'>WIN</th>");
        const $tableTheadTitlePlay = $("<th class='stats-table_header'>PLAY</th>");
        const $tableTheadTitleTop = $("<th class='stats-table_header'>TOP</th>");
        const $tableTheadTitleJug = $("<th class='stats-table_header'>JUG</th>");
        const $tableTheadTitleMid = $("<th class='stats-table_header'>MID</th>");
        const $tableTheadTitleBot = $("<th class='stats-table_header'>BOT</th>");
        const $tableTheadTitleSup = $("<th class='stats-table_header'>SUP</th>");
        const $tableBody = $("<tbody id='statsRelativeTableBody'></tbody>");

        $tableTheadTr.append($tableTheadTitleUser);
        $tableTheadTr.append($tableTheadTitleWinratio);
        $tableTheadTr.append($tableTheadTitleWin);
        $tableTheadTr.append($tableTheadTitlePlay);
        $tableTheadTr.append($tableTheadTitleTop);
        $tableTheadTr.append($tableTheadTitleJug);
        $tableTheadTr.append($tableTheadTitleMid);
        $tableTheadTr.append($tableTheadTitleBot);
        $tableTheadTr.append($tableTheadTitleSup);
        $tableThead.append($tableTheadTr);

        $tableContainer.append($tableColgroup);
        $tableContainer.append($tableThead);
        $tableContainer.append($tableBody);

        obj.append($tableContainer);
      },
      setTable: (keys, relativeObj) => {
        const obj = $('#statsRelativeTableBody');

        for (const id of keys) {
          const $tableRowObj = $('<tr>');
          const $userObj = $('<td>');
          const $userLink = $('<a>',
            { href: `/profile/?userName=${id}` }).text(id);
          const $winObj = $('<td>').text(relativeObj[id].win);
          const $playObj = $('<td>').text(relativeObj[id].play);
          const $winRatioObj = $('<td>');
          const $topObj = $('<td>').text(relativeObj[id].TOP);
          const $jugObj = $('<td>').text(relativeObj[id].JUG);
          const $midObj = $('<td>').text(relativeObj[id].MID);
          const $botObj = $('<td>').text(relativeObj[id].BOT);
          const $supObj = $('<td>').text(relativeObj[id].SUP);

          const winRatio = (relativeObj[id].win / relativeObj[id].play * 100).toFixed(2);

          $winRatioObj.text(`${winRatio}%`);

          $userObj.append($userLink);

          $tableRowObj.append($userObj);
          $tableRowObj.append($winRatioObj);
          $tableRowObj.append($winObj);
          $tableRowObj.append($playObj);
          $tableRowObj.append($topObj);
          $tableRowObj.append($jugObj);
          $tableRowObj.append($midObj);
          $tableRowObj.append($botObj);
          $tableRowObj.append($supObj);
          obj.append($tableRowObj);
        }
      },
    };
    this.member = {
      memberHashKeys: [],
      initTable: () => {
        const obj = $('#statsMainDiv');

        const $tableContainer = $("<table class='table table-hover stats-table'> </table>");
        const $tableColgroup = $("<colgroup><col width='50'><col width='50'></colgroup>");
        const $tableThead = $("<thead class='thead'></thead>");
        const $tableTheadTr = $('<tr></tr>');
        const $tableTheadTitleUserId = $("<th class='stats-table_header'>USER_ID</th>");
        const $tableTheadTitlePlays = $("<th class='stats-table_header'>PLAYS</th>");
        const $tableBody = $("<tbody id='statsMemberTableBody'></tbody>");

        $tableTheadTr.append($tableTheadTitleUserId);
        $tableTheadTr.append($tableTheadTitlePlays);
        $tableThead.append($tableTheadTr);

        $tableContainer.append($tableColgroup);
        $tableContainer.append($tableThead);
        $tableContainer.append($tableBody);

        obj.append($tableContainer);
      },
      setMemberNames: () => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: '/f/members/',
          success: (members) => {
            const obj = $('#statsMemberTableBody');

            let i = 0;
            for (const index in members) {
              const userId = members[index].pk;
              const $tableRowObj = $('<tr>', { class: 'member-list-table_row' });
              const $userIdObj = $('<td>').text(userId);
              const $playsObj = $('<td>', { id: `userId${i}` }).text('0');

              this.member.memberHashKeys[userId] = i;
              i += 1;

              $tableRowObj.append($userIdObj);
              $tableRowObj.append($playsObj);
              obj.append($tableRowObj);
            }
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
      getData: (season) => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/f/season/users/?season=${season}`,
          success: (userSeasonData) => {
            const playObj = {};

            for (const index in userSeasonData) {
              const { user_id } = userSeasonData[index].fields;

              if (playObj[user_id] === undefined) {
                playObj[user_id] = 1;
              } else {
                playObj[user_id] += 1;
              }
            }

            for (const index in playObj) {
              const obj = $(`#userId${this.member.memberHashKeys[index]}`);

              obj.text(playObj[index]);
            }
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
    };
    this.season = {};

    this.init = () => {
      const {
        pickBan, position, member, home, relative,
      } = this;
      const objHome = $('#alrHome');
      const objMenu = $('#alrMenu');
      const objSeasonMonitor = $('#seasonMonitor');
      const getParams = common.getRequest();
      const season = common.season.getSeason(getParams.season);

      common.createHomeBanner(objHome);
      common.createMenubar(objMenu);
      common.createSeasonMonitor(objSeasonMonitor);

      if (getParams.type === 'unique_title') {
        this.title.getSeasonUserData(season);
        common.season.setUpdateFunc((ss) => {
          $('#statsMainDiv').empty();
          this.title.getSeasonUserData(ss);
        });
      } else if (getParams.type === 'pick_ban') {
        pickBan.initTable();
        pickBan.getData(season);
        common.season.setUpdateFunc((ss) => {
          $('#statsMainDiv').empty();
          pickBan.initTable();
          pickBan.getData(ss);
        });
      } else if (getParams.type === 'position_rank') {
        position.getUserData(season);
        common.season.setUpdateFunc((ss) => {
          $('#statsMainDiv').empty();
          position.getUserData(ss);
        });
      } else if (getParams.type === 'relative_total') {
        relative.initSearchButton(season);
        common.season.setUpdateFunc((ss) => {
          relative.onSearch(ss);
        });
      } else if (getParams.type === 'for_manager') {
        member.initTable();
        member.setMemberNames();
        member.getData(season);
        common.season.setUpdateFunc((ss) => {
          $('#statsMainDiv').empty();
          member.initTable();
          member.setMemberNames();
          member.getData(ss);
        });
      } else {
        home.initMostChamp();
        home.getMostChampData(season);
        home.getMostDuoData(season);
        common.season.setUpdateFunc((ss) => {
          $('#statsMainDiv').empty();
          home.initMostChamp();
          home.getMostChampData(ss);
          home.getMostDuoData(ss);
        });
      }

      common.version();
    };
  }
}
const stats = new Stats();

window.stats = stats;

export default stats;
