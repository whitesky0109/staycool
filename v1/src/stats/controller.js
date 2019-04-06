/* eslint-disable class-methods-use-this */
import '@babel/polyfill';
import { locationSrv, emptyElement } from '../utils';

import * as commonModel from '../common/model';
import commonCtrl from '../common';

import title from './title';
import pickBan from './pickBan';
import position from './position';
import relative from './relative';
import member from './member';
import home from './home';

import * as view from './view';

export default class StatsCtrl {
  constructor() {
    this.getParams = locationSrv.getRequest(); // ???
    const season = commonModel.getSeason(this.getParams.season);
    this.season = season;
  }

  async init() {
    view.init();

    switch (this.getParams.type) {
      case 'unique_title':
        title.controller.getSeasonUserData(this.season);
        commonCtrl.setUpdateFunc((ss) => {
          emptyElement('statsMainDiv');
          title.getSeasonUserData(ss);
        });
        break;
      case 'pick_ban':
        pickBan.view.initTable();
        pickBan.controller.getData(this.season);
        commonCtrl.setUpdateFunc((ss) => {
          emptyElement('statsMainDiv');
          pickBan.view.initTable();
          pickBan.controller.getData(ss);
        });
        break;
      case 'position_rank':
        position.controller.getUserData(this.season);
        commonCtrl.setUpdateFunc((ss) => {
          emptyElement('statsMainDiv');
          position.controller.getUserData(ss);
        });
        break;
      case 'relative_total':
        relative.view.initSearchButton(this.season);
        commonCtrl.setUpdateFunc((ss) => {
          relative.controller.onSearch(ss);
        });
        break;
      case 'for_manager':
        member.view.initTable();
        member.controller.setMemberNames();
        member.controller.getData(this.season);
        commonCtrl.setUpdateFunc((ss) => {
          emptyElement('statsMainDiv');
          member.view.initTable();
          member.controller.setMemberNames();
          member.controller.getData(ss);
        });
        break;
      default:
        home.view.initMostChamp();
        home.controller.getMostChampData(this.season);
        home.controller.getMostDuoData(this.season);
        commonCtrl.setUpdateFunc((ss) => {
          emptyElement('statsMainDiv');
          home.view.initMostChamp();
          home.controller.getMostChampData(ss);
          home.controller.getMostDuoData(ss);
        });
    }
    commonCtrl.updateVersion();
  }
}
