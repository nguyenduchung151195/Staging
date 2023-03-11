/*
 *
 * AddPayManager actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_DATA, GET_DATA_SUCCESS, GET_REPORT_PAY_MANAGER, GET_REPORT_PAY_MANAGER_SUCCESS, GET_REPORT_PAY_MANAGER_FAILURE } from './constants';

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

export function getReportPayManager(path) {
  return {
    type: GET_REPORT_PAY_MANAGER,
    path
  }
}
export function getReportPayManagerSuccess(data) {
  return {
    type: GET_REPORT_PAY_MANAGER_SUCCESS,
    data
  }
}
export function getReportPayManagerFailure(error) {
  return {
    type: GET_REPORT_PAY_MANAGER_FAILURE,
    error
  }
}