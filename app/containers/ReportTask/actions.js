/*
 *
 * ReportTask actions
 *
 */

import { DEFAULT_ACTION, GET_DATA, GET_DATA_SUCCESS, MERGE_DATA } from './constants';

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

export function getDataSuccess(data) {
  return {
    type: GET_DATA_SUCCESS,
    data,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
