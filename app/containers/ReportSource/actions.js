/*
 *
 * ReportSource actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_DATA, GET_DATA_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getData(filter) {
  return {
    type: GET_DATA,
    filter,
  };
}

export function getDataSuccess(data) {
  return {
    type: GET_DATA_SUCCESS,
    data,
  };
}
