import * as model from './model';
import * as view from './view';
import Controller from './controller';

import './style.css';

const profile = new Controller();

profile.init();

export default {
  model,
  view,
  controller: profile,
};
