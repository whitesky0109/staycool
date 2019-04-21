import * as model from './model';
import * as view from './view';
import Controller from './controller';

const common = new Controller();

window.common = common;

export default {
  model,
  view,
  controller: common,
};
