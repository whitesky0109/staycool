/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import * as view from './view';
import { backendSrv } from '../utils';

export default class CommonCtrl {
  constructor() {
    this.update = () => {};
  }

  async updateVersion() {
    try {
      const { data } = await backendSrv.getVersion();
      view.updateVersion(data);
    } catch (e) {
      console.error(e);
    }
  }

  setUpdateFunc(func) {
    this.update = func;
  }

  changeSeason() {
    const season = document.getElementById('airSeason');

    this.update(season.value);
  }
}
