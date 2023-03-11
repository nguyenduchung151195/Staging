/*
 *
 * KpiProject actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, POST_DATA, POST_DATA_SUCCESS, GET_DATA_SUCCESS, GET_DATA } from './constants';

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

export function postData(data) {
  return {
    type: POST_DATA,
    data,
  };
}

export function postDataSuccess(data) {
  return {
    type: POST_DATA_SUCCESS,
    data,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(projects) {
  return {
    type: GET_DATA_SUCCESS,
    projects,
  };
}
