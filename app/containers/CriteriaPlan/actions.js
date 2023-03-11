/*
 *
 * CriteriaPlan actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_DATA, GET_DATA_SUCCESS, PUT_CRITERIA } from './constants';

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
export function getData(data) {
  return {
    type: GET_DATA,
    data,
  };
}
export function getDataSuccess(departments, setCriteria, criterias) {
  return {
    type: GET_DATA_SUCCESS,
    departments,
    setCriteria,
    criterias,
  };
}

export function putCriteria(data) {
  return {
    type: PUT_CRITERIA,
    data,
  };
}
