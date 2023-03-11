/*
 *
 * AddReceivableManager actions
 *
 */

import { DEFAULT_ACTION, GET_REPORT_RECEIVABLE_MANAGER, GET_REPORT_RECEIVABLE_MANAGER_FAILURE, GET_REPORT_RECEIVABLE_MANAGER_SUCCESS, MERGE_DATA } from './constants';

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

export function getReportReceivableManager(path) {
  return {
    type: GET_REPORT_RECEIVABLE_MANAGER,
    path
  }
}
export function getReportReceivableManagerSuccess(data) {
  return {
    type: GET_REPORT_RECEIVABLE_MANAGER_SUCCESS,
    data
  }
}
export function getReportReceivableManagerFailure(error) {
  return {
    type: GET_REPORT_RECEIVABLE_MANAGER_FAILURE,
    error
  }
}
