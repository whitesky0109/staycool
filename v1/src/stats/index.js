import * as view from './view';
import Controller from './controller';

import './style.css';

const stats = new Controller();

stats.init();

export default {
  view,
  controller: stats,
};
