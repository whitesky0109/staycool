/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import $ from 'jquery';
import 'bootstrap';

class Common {
  constructor() {
    this.tier = {
      unranked: '/static/airgg/img/tier/Iron_Emblem.png',
      bronze: '/static/airgg/img/tier/Bronze_Emblem.png',
      silver: '/static/airgg/img/tier/Silver_Emblem.png',
      gold: '/static/airgg/img/tier/Gold_Emblem.png',
      platinum: '/static/airgg/img/tier/Platinum_Emblem.png',
      diamond: '/static/airgg/img/tier/Diamond_Emblem.png',
      master: '/static/airgg/img/tier/Master_Emblem.png',
      challenger: '/static/airgg/img/tier/Challenger_Emblem.png',
    };
    this.lineImg = {
      TOP: '/static/airgg/img/Top_icon.png',
      JUG: '/static/airgg/img/Jungle_icon.png',
      MID: '/static/airgg/img/Mid_icon.png',
      BOT: '/static/airgg/img/Bot_icon.png',
      SUP: '/static/airgg/img/Support_icon.png',
    };
    this.homeBanner = '/static/airgg/img/alr_spring.jpg';
    this.menuList = [
      { title: '멤버', href: '/member' },
      { title: '랭킹', href: '/ranking' },
      { title: '통계', href: '/stats' },
      { title: '포지션 예측', href: '/position' },
      { title: '커뮤니티', href: 'https://cafe.naver.com/alightrest' },
      { title: '하나튜브', href: 'https://www.youtube.com/channel/UCGNbhTiN8xMGOKtiQbMxmkQ' },
    ];
    this.nowSeason = 4;
    this.onSearch = () => {
      const name = $('#airSearchInput').val();
      window.location.href = `/profile?userName=${name}`;
    };
    this.moveHome = () => {
      window.location.href = '/';
    };
    this.changeSeason = () => {
      const season = $('#airSeason').val();

      this.season.update(season);
    };
    this.getRequest = () => {
      if (window.location.search.length > 1) {
        const get = {};
        const ret = window.location.search.substr(1).split('&');
        for (let i = 0; i < ret.length; i += 1) {
          const r = ret[i].split('=');
          get[r[0]] = decodeURIComponent(r[1]);
        }
        return get;
      }

      return false;
    };
    this.createHomeBanner = (obj) => {
      const $objHomeBanner = $('<img>', { src: this.homeBanner, width: '1060px', onclick: 'common.moveHome()' });

      obj.append($objHomeBanner);
    };
    this.createMenubar = (obj) => {
      const $objMenuBar = $('<ul>', { class: 'alr-menubar' });

      for (const { title, href } of this.menuList) {
        const $aItem = $('<a>', { href }).text(title);
        const $liItem = $('<li>', { class: 'alr-menubar li-category' });

        $liItem.append($aItem);
        $objMenuBar.append($liItem);
      }

      {
        const $liItem = $('<li>', { class: 'alr-menubar li-search' });
        const $input = $('<input>', { id: 'airSearchInput', type: 'text', placeholder: 'Search..' });
        const $searchBtn = $('<button>', { id: 'airSearchBtn', onclick: 'common.onSearch()' });
        const $searchBtnImg = $('<img>', { src: '/static/airgg/img/search.png' });

        $searchBtn.append($searchBtnImg);

        $liItem.append($input);
        $liItem.append($searchBtn);

        $objMenuBar.append($liItem);
      }

      obj.append($objMenuBar);
    };

    this.createSeasonMonitor = (obj) => {
      const $objSeasonMonitor = $('<div>', { class: 'row input-group ml-2 mt-1 mb-2 mr-1 input-group-sm' });
      const $objInputDiv = $('<div>', { class: 'input-group-append' });
      const $objSpan = $('<span>', { class: 'input-group-text' }).text('Season');
      const $objSelect = $('<select>', { id: 'airSeason', class: 'form-control input-sm-7', onchange: 'common.changeSeason()' });
      const $objDummy = $('<div>', { class: 'sub-nav-div-dummy' });

      for (let i = this.nowSeason; i > 0; i -= 1) {
        const $item = $('<option>').text(i);
        $objSelect.append($item);
      }

      $objSelect.append($('<option>').text('ALL'));

      $objInputDiv.append($objSpan);
      $objSeasonMonitor.append($objInputDiv);
      $objSeasonMonitor.append($objSelect);
      $objSeasonMonitor.append($objDummy);

      obj.append($objSeasonMonitor);
    };
    this.version = () => {
      const $versionDivObj = $('#airVersion');
      const $stampObj = $('<p>').text("Produced by 'AlR 펌프'");

      $versionDivObj.append($stampObj);

      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/f/updatedate/',
        success: (data) => {
          const $versionObj = $('<p>').text(`Updated by ${data.date}`);

          $versionDivObj.append($versionObj);
        },
        error(e) {
          console.log(e.responseText);
        },
      });
    };
    this.champion = {
      getImg: (obj, champion, option) => {
        let imgOption = {};

        if ((option === undefined) || (option == null)) {
          imgOption = Object.assign(imgOption, {
            src: 'full',
            version: '9.2.1',
            wrap: 2,
            skin: 1,
            gray: false,
            size: 'normal',
          });
        } else {
          imgOption = option;
        }

        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: `/static/airgg/riot_api/9.2.1/data/ko_KR/champion/${champion}.json`,
          success: (data) => {
            const championInfo = data.data[champion];
            obj.append(Riot.DDragon.fn.getImg(championInfo, imgOption));
          },
          error(e) {
            console.log(e.responseText);
          },
        });
      },
    };
    this.user = {
      summaryMostData: (userGameData) => {
        const summaryMostData = { champion: '', line: '', winRatio: '' };

        const championList = {};
        const lineList = {};
        let winCnt = 0;

        let maxChamp = 0;
        let maxLine = 0;

        for (const data in userGameData) {
          const { fields } = userGameData[data];
          const champ = fields.champion;
          const { line } = fields;

          if (!championList[champ]) {
            championList[champ] = 1;
          } else {
            championList[champ] += 1;
          }

          if (!lineList[line]) {
            lineList[line] = 1;
          } else {
            lineList[line] += 1;
          }

          if (fields.win === 1) {
            winCnt += 1;
          }

          if (maxChamp < championList[champ]) {
            summaryMostData.champion = champ;
            maxChamp = championList[champ];
          }

          if (maxLine < lineList[line]) {
            summaryMostData.line = line;
            maxLine = lineList[line];
          }
        }

        summaryMostData.winRatio = ((winCnt / userGameData.length) * 100).toFixed(2);

        return summaryMostData;
      },
      summaryChampion: (userGameData) => {
        const summaryChampion = {};

        for (const data in userGameData) {
          const { fields } = userGameData[data];
          const champ = fields;
          const {
            kill, death, asist, cs, win,
          } = fields;

          if (summaryChampion[champ] === undefined) {
            const obj = {
              kill, death, asist, cs, win: win === 1 ? 1 : 0, play: 1,
            };

            summaryChampion[champ] = obj;
          } else {
            summaryChampion[champ].kill += kill;
            summaryChampion[champ].death += death;
            summaryChampion[champ].asist += asist;
            summaryChampion[champ].cs += cs;
            if (win === 1) {
              summaryChampion[champ].win += 1;
            }
            summaryChampion[champ].play += 1;
          }
        }

        return summaryChampion;
      },
      summaryLine: (userGameData) => {
        const summaryLine = {
          TOP: { win: 0, games: 0 },
          JUG: { win: 0, games: 0 },
          MID: { win: 0, games: 0 },
          BOT: { win: 0, games: 0 },
          SUP: { win: 0, games: 0 },
        };

        for (const data in userGameData) {
          const { line } = userGameData[data].fields;
          const { win } = userGameData[data].fields;

          if (summaryLine[line] === undefined) {
            continue;
          } else {
            if (win === 1) {
              summaryLine[line].win += 1;
            }
            summaryLine[line].games += 1;
          }
        }

        return summaryLine;
      },
    };
    this.season = {
      update: {},
      setUpdateFunc: (func) => {
        this.season.update = func;
      },
      getSeason: (season) => {
        if (season === undefined || season === null) {
          return 4;
        }

        return season;
      },
      summaryUsers: (userSeasonData) => {
        const summaryUsers = {};

        for (const data in userSeasonData) {
          const userId = userSeasonData[data].fields.user_id;
          const {
            kill, death, asist, win,
          } = userSeasonData[data].fields;
          if (summaryUsers[userId] === undefined) {
            summaryUsers[userId] = {
              kill,
              death,
              asist,
              win,
              play: 1,
            };
          } else {
            summaryUsers[userId].kill += kill;
            summaryUsers[userId].death += death;
            summaryUsers[userId].asist += asist;
            if (win === 1) {
              summaryUsers[userId].win += 1;
            }
            summaryUsers[userId].play += 1;
          }
        }

        for (const data in summaryUsers) {
          const { win, play } = summaryUsers[data];
          summaryUsers[data].winRatio = ((win / play) * 100).toFixed(2);
        }

        return summaryUsers;
      },
      summaryPositionUsers: (userSeasonData) => {
        const summaryUsers = {};

        for (const data in userSeasonData) {
          const position = userSeasonData[data].fields.line;
          const userId = userSeasonData[data].fields.user_id;

          if (!summaryUsers[position]) {
            summaryUsers[position] = {};
          }

          const {
            kill, win, asist, death,
          } = userSeasonData[data].fields;
          if (!summaryUsers[position][userId]) {
            summaryUsers[position][userId] = {
              kill,
              death,
              asist,
              win,
              play: 1,
            };
          } else {
            summaryUsers[position][userId].kill += kill;
            summaryUsers[position][userId].death += death;
            summaryUsers[position][userId].asist += asist;
            if (userSeasonData[data].fields.win === 1) {
              summaryUsers[position][userId].win += 1;
            }
            summaryUsers[position][userId].play += 1;
          }
        }

        return summaryUsers;
      },
      summaryRelative: (userSeasonData, player) => {
        const gameData = {};
        const gameNumArr = [];
        const relativeObj = {};

        for (const data in userSeasonData) {
          const {
            user_id, game_num, win, line,
          } = userSeasonData[data].fields;

          if (user_id === player) {
            gameNumArr.push(game_num);
          }

          if (!gameData[game_num]) {
            gameData[game_num] = {};
          }

          if (!gameData[game_num][user_id]) {
            gameData[game_num][user_id] = {
              win,
              line,
            };
          }
        }

        for (const num of gameNumArr) {
          for (const userId in gameData[num]) {
            if (gameData[num][player].win === true && gameData[num][userId].win === false) {
              if (!relativeObj[userId]) {
                relativeObj[userId] = {
                  win: 1,
                  play: 1,
                  TOP: 0,
                  JUG: 0,
                  MID: 0,
                  BOT: 0,
                  SUP: 0,
                };
                relativeObj[userId][gameData[num][userId].line] += 1;
              } else {
                relativeObj[userId].win += 1;
                relativeObj[userId].play += 1;
                relativeObj[userId][gameData[num][userId].line] += 1;
              }
            }
            if (gameData[num][player].win === false && gameData[num][userId].win === true) {
              if (!relativeObj[userId]) {
                relativeObj[userId] = {
                  win: 0,
                  play: 1,
                  TOP: 0,
                  JUG: 0,
                  MID: 0,
                  BOT: 0,
                  SUP: 0,
                };
                relativeObj[userId][gameData[num][userId].line] += 1;
              } else {
                relativeObj[userId].play += 1;
                relativeObj[userId][gameData[num][userId].line] += 1;
              }
            }
          }
        }

        return relativeObj;
      },
    };
  }
}

const common = new Common();

window.common = common;

export default common;
