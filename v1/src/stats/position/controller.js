/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { backendSrv, settings } from '../../utils';

import * as commonModel from '../../common/model';

import * as model from './model';
import * as view from './view';

export const getUserData = async (season) => {
  try {
    const { data } = await backendSrv.getSeasonData(season);

    const summaryPUsers = commonModel.summaryPositionUsers(data);
    const mostTopUser = model.findMostLiner(summaryPUsers.TOP);
    const mostMidUser = model.findMostLiner(summaryPUsers.MID);
    const mostJugUser = model.findMostLiner(summaryPUsers.JUG);
    const mostBotUser = model.findMostLiner(summaryPUsers.BOT);
    const mostSupUser = model.findMostLiner(summaryPUsers.SUP);

    view.setTitle(mostTopUser, 'TOP', settings.lineImg.TOP, settings.lineComment.TOP);
    view.setTitle(mostJugUser, 'JUG', settings.lineImg.JUG, settings.lineComment.JUG);
    view.setTitle(mostMidUser, 'MID', settings.lineImg.MID, settings.lineComment.MID);
    view.setTitle(mostBotUser, 'BOT', settings.lineImg.BOT, settings.lineComment.BOT);
    view.setTitle(mostSupUser, 'SUP', settings.lineImg.TOP, settings.lineComment.SUP);
  } catch (e) {
    console.error(e);
  }
};
