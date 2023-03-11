/*
 *
 * KpiPage actions
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

export function getData(id) {
  return {
    type: GET_DATA,
    userId: id,
  };
}
export function getDataSuccess(employees, departments, profile) {
  return {
    type: GET_DATA_SUCCESS,
    employees,
    departments,
    profile,
  };
}
