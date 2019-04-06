import * as model from './model';
import * as view from './view';
import Controller from './controller';

import './style.css';

const ranking = new Controller();

ranking.init();

export default {
  model,
  view,
  controller: ranking,
};
