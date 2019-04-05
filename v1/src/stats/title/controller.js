/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { backendSrv, settings } from '../../utils';

import * as commonModel from '../../common/genData';

import * as model from './model';
import * as view from './view';

export const getSeasonUserData = async (season) => {
  try {
    const { data } = await backendSrv.getSeasonData(season);
    const summaryUsers = commonModel.summaryUsers(data);

    const carry = model.findCarry(summaryUsers);
    const murder = model.findMurder(summaryUsers);
    const teresa = model.findTeresa(summaryUsers);
    const mola = model.findMola(summaryUsers);
    const joiner = model.findJoiner(summaryUsers);
    const theJungle = model.findUser('AlR 쩨이', summaryUsers);

    view.setTitle(carry, '케리', settings.tier.challenger, settings.comments.CARRY);
    view.setTitle(murder, '학살자', settings.tier.challenger, settings.comments.MURDER);
    view.setTitle(teresa, '테레사', settings.tier.challenger, settings.comments.TERESA);
    view.setTitle(mola, '개복치', settings.tier.challenger, settings.comments.MOLA);
    view.setTitle(joiner, '개근', settings.tier.challenger, settings.comments.JOINER);
    view.setTitle(theJungle, '더 정글', settings.tier.challenger, settings.comments.THE_JUNGLE);
  } catch (e) {
    console.error(e);
  }
};
