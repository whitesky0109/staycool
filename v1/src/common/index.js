/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import * as commonView from './view';
import { backendSrv } from '../utils';

class CommonCtrl {
  constructor() {
    this.update = () => {};
  }

  async updateVersion() {
    try {
      const { data } = await backendSrv.getVersion();
      commonView.updateVersion(data);
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

const common = new CommonCtrl();

window.common = common;

export default common;
