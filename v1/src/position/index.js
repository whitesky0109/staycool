import * as model from './model';
import * as view from './view';
import Controller from './controller';

import './style.css';

const position = new Controller();

position.init();

window.position = position;

export default {
  model,
  view,
  controller: position,
};
