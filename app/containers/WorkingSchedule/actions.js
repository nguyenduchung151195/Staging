/*
 *
 * WorkingSchedule actions
 *
 */

import { DEFAULT_ACTION, GET_DATA, GET_DATA_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(mettings) {
  return {
    type: GET_DATA_SUCCESS,
    mettings,
  };
}
