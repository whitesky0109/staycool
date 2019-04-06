import * as model from './model';
import * as view from './view';
import Controller from './controller';

import './style.css';

const member = new Controller();

export default {
  model,
  view,
  controller: member,
};
