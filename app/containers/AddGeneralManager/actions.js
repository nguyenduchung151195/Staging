/*
 *
 * AddGeneralManager actions
 *
 */

import { DEFAULT_ACTION, GET_REPORT_GENERAL, GET_REPORT_GENERAL_FAILURE, GET_REPORT_GENERAL_SUCCESS, MERGE_DATA } from './constants';

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

export function getReportGeneral(path) {
  return {
    type: GET_REPORT_GENERAL,
    path
  }
}
export function getReportGeneralSuccess(data) {
  return {
    type: GET_REPORT_GENERAL_SUCCESS,
    data
  }
}
export function getReportGeneralFailure(error) {
  return {
    type: GET_REPORT_GENERAL_FAILURE,
    error
  }
}
