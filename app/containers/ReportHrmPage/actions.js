/*
 *
 * ReportHrmPage actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_API,
  GET_API_SUCCESS,
  GET_INCREASES_OR_DECREASES,
  GET_INCREASES_OR_DECREASES_SUCCESS,
  GET_INCREASES_OR_DECREASES_FAILURE,
  GET_LATE,
  GET_LATE_SUCCESS,
  GET_LATE_FAILURE,
  GET_HRM_BY_MONTH,
  GET_HRM_BY_MONTH_FAILURE,
  GET_HRM_BY_MONTH_SUCCESS,
  GET_WAGE_BY_MONTH,
  GET_WAGE_BY_MONTH_FAILURE,
  GET_WAGE_BY_MONTH_SUCCESS,
} from './constants';

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
export function getApi() {
  return {
    type: GET_API,
  };
}
export function getApiSuccess(personnel, catagory) {
  return {
    type: GET_API_SUCCESS,
    personnel,
    catagory,
  };
}

export function getIncreasesOrDecreases() {
  return {
    type: GET_INCREASES_OR_DECREASES,
  };
}
export function getIncreasesOrDecreasesSuccess(data) {
  return {
    type: GET_INCREASES_OR_DECREASES_SUCCESS,
    data,
  };
}
export function getIncreasesOrDecreasesFailure(error) {
  return {
    type: GET_INCREASES_OR_DECREASES_FAILURE,
    error,
  };
}
export function getLate() {
  return {
    type: GET_LATE,
  };
}
export function getLateSuccess(data) {
  return {
    type: GET_LATE_SUCCESS,
    data,
  };
}
export function getLateFailure(error) {
  return {
    type: GET_LATE_FAILURE,
    error,
  };
}
export function getHrm() {
  return {
    type: GET_HRM_BY_MONTH,
  };
}
export function getHrmSuccess(data) {
  return {
    type: GET_HRM_BY_MONTH_SUCCESS,
    data,
  };
}
export function getHrmFailure(error) {
  return {
    type: GET_HRM_BY_MONTH_FAILURE,
    error,
  };
}
export function getWage() {
  return {
    type: GET_WAGE_BY_MONTH,
  };
}
export function getWageSuccess(data) {
  return {
    type: GET_WAGE_BY_MONTH_SUCCESS,
    data,
  };
}
export function getWageFailure(error) {
  return {
    type: GET_WAGE_BY_MONTH_FAILURE,
    error,
  };
}
