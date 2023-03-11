/*
 *
 * Gantt actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_GANTT, POST_PROGRESS, GET_DATA, GET_DATA_SUCCESS } from './constants';

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

export function getGantt(data) {
  return {
    type: GET_GANTT,
    data,
  };
}

export function postProgress(data, loadGantt) {
  return {
    type: POST_PROGRESS,
    data,
    loadGantt,
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
