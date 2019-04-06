import * as model from './model';
import * as view from './view';
import Controller from './constroller';

import './style.css';

const home = new Controller();
home.init();

export default {
  model,
  view,
  controller: home,
};
