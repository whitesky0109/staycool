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
    this.baseImgPath = '/static/airgg/img';
    this.tier = {
      unranked: `${this.baseImgPath}/tier/Iron_Emblem.png`,
      bronze: `${this.baseImgPath}/tier/Bronze_Emblem.png`,
      silver: `${this.baseImgPath}tier/Silver_Emblem.png`,
      gold: `${this.baseImgPath}/tier/Gold_Emblem.png`,
      platinum: `${this.baseImgPath}/tier/Platinum_Emblem.png`,
      diamond: `${this.baseImgPath}/tier/Diamond_Emblem.png`,
      master: `${this.baseImgPath}/tier/Master_Emblem.png`,
      challenger: `${this.baseImgPath}/tier/Challenger_Emblem.png`,
    };
    this.lineImg = {
      TOP: `${this.baseImgPath}/Top_icon.png`,
      JUG: `${this.baseImgPath}/Jungle_icon.png`,
      MID: `${this.baseImgPath}/Mid_icon.png`,
      BOT: `${this.baseImgPath}/Bot_icon.png`,
      SUP: `${this.baseImgPath}/Support_icon.png`,
    };
    this.homeBanner = `${this.baseImgPath}/alr_spring.jpg`;
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
        for (const r of ret) {
          const rs = r.split('=');
          get[rs[0]] = decodeURIComponent(rs[1]);
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

        if ((option === undefined) || (option === null)) {
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
          success: ({ data }) => {
            const championInfo = data[champion];
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
          const { champion, line, win } = userGameData[data].fields;

          if (!championList[champion]) {
            championList[champion] = 1;
          } else {
            championList[champion] += 1;
          }

          if (!lineList[line]) {
            lineList[line] = 1;
          } else {
            lineList[line] += 1;
          }

          if (win === 1) {
            winCnt += 1;
          }

          if (maxChamp < championList[champion]) {
            summaryMostData.champion = champion;
            maxChamp = championList[champion];
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
          const {
            kill, death, asist, cs, win, champion,
          } = userGameData[data].fields;

          if (!summaryChampion[champion]) {
            summaryChampion[champion] = {
              kill, death, asist, cs, win: win === 1 ? 1 : 0, play: 1,
            };
          } else {
            summaryChampion[champion].kill += kill;
            summaryChampion[champion].death += death;
            summaryChampion[champion].asist += asist;
            summaryChampion[champion].cs += cs;
            if (win === 1) {
              summaryChampion[champion].win += 1;
            }
            summaryChampion[champion].play += 1;
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
          const { line, win } = userGameData[data].fields;

          if (!summaryLine[line]) { continue; }

          if (win === 1) {
            summaryLine[line].win += 1;
          }
          summaryLine[line].games += 1;
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
          const {
            kill, death, asist, win, user_id,
          } = userSeasonData[data].fields;
          if (!summaryUsers[user_id]) {
            summaryUsers[user_id] = {
              kill,
              death,
              asist,
              win,
              play: 1,
            };
          } else {
            summaryUsers[user_id].kill += kill;
            summaryUsers[user_id].death += death;
            summaryUsers[user_id].asist += asist;
            if (win === 1) {
              summaryUsers[user_id].win += 1;
            }
            summaryUsers[user_id].play += 1;
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
          const {
            kill, win, asist, death, user_id, line,
          } = userSeasonData[data].fields;

          if (!summaryUsers[line]) {
            summaryUsers[line] = {};
          }

          if (!summaryUsers[line][user_id]) {
            summaryUsers[line][user_id] = {
              kill,
              death,
              asist,
              win,
              play: 1,
            };
          } else {
            summaryUsers[line][user_id].kill += kill;
            summaryUsers[line][user_id].death += death;
            summaryUsers[line][user_id].asist += asist;
            if (userSeasonData[data].fields.win === 1) {
              summaryUsers[line][user_id].win += 1;
            }
            summaryUsers[line][user_id].play += 1;
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
          const game = gameData[num];
          for (const userId in game) {
            if (game[player].win === true && game[userId].win === false) {
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
              } else {
                relativeObj[userId].win += 1;
                relativeObj[userId].play += 1;
              }
              relativeObj[userId][game[userId].line] += 1;
            }

            if (game[player].win === false && game[userId].win === true) {
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
              } else {
                relativeObj[userId].play += 1;
              }
              relativeObj[userId][game[userId].line] += 1;
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
