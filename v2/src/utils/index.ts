/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */

import backendSrv from './backendSrv';
import locationSrv from './locationSrv';
import settings from './defaults';
import store from './store';

export const newElement = (tagName: string, options = {}, evts = {}) => {
  const elem = document.createElement(tagName);

  for (const attr in options) {
    elem.setAttribute(attr, options[attr]);
  }

  for (const evtName in evts) {
    elem.addEventListener(evtName, evts[evtName]);
  }

  return elem;
};

export const emptyElement = (elemId: string) => {
  const elem = document.getElementById(elemId);
  while (elem && elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

export {
  backendSrv,
  locationSrv,
  settings,
  store,
};
