/*
 *
 * FileManager actions
 *
 */

import { DEFAULT_ACTION, GET_DATA_USED, GET_DATA_USED_FAILURE, GET_DATA_USED_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRevenueChartData() {
  return {
    type: GET_DATA_USED,
  };
}

export function getRevenueChartDataSuccess(data) {
  return {
    type: GET_DATA_USED_SUCCESS,
    data,
  };
}

export function getRevenueChartDataFailure() {
  return {
    type: GET_DATA_USED_FAILURE,
  };
}
