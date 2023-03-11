/*
 *
 * AddSalesManager actions
 *
 */

import {
  DEFAULT_ACTION, MERGE_DATA, GET_DATA, GET_SALE_MANAGER,
  GET_SALE_MANAGER_SUCCESS,
  GET_SALE_MANAGER_FAILURE
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

export function getData(filterDetail) {
  return {
    type: GET_DATA,
    filterDetail,
  };
}

export function getSaleManager(path) {
  return {
    type: GET_SALE_MANAGER,
    path
  }
}
export function getSaleManagerSuccess(data) {
  return {
    type: GET_SALE_MANAGER_SUCCESS,
    data
  }
}
export function getSaleManagerFailure(error) {
  return {
    type: GET_SALE_MANAGER_FAILURE,
    error
  }
}