/*
 *
 * CriteriaPage actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_DATA,
  GET_DATA_SUCCESS,
  ADD_SET_CRITERIA_SUCCESS,
  ADD_SET_CRITERIA,
  GET_DEFAULT,
  ADD_CRITERIA,
  ADD_CRITERIA_SUCCESS,
  PUT_CRITERIA,
  PUT_CRITERIA_SUCCESS,
  GET_ITEM,
  GET_ITEM_SUCCESS,
  DELETE_CRITERIA,
  DELETE_CRITERIA_SUCCESS,
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

export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(departments, employeess, criterias, customers, suppliers, categoryStock, products) {
  return {
    type: GET_DATA_SUCCESS,
    departments,
    employeess,
    criterias,
    customers,
    suppliers,
    categoryStock,
    products,
  };
}
export function addSetCriteria(data) {
  return {
    type: ADD_SET_CRITERIA,
    data,
  };
}
export function addSetCriteriaSuccess(data) {
  return {
    type: ADD_SET_CRITERIA_SUCCESS,
    data,
  };
}
export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}
export function addCriteria(data) {
  return {
    type: ADD_CRITERIA,
    data,
  };
}
export function addCriteriaSuccess(data) {
  return {
    type: ADD_CRITERIA_SUCCESS,
    data,
  };
}

export function putCriteria(data, id) {
  return {
    type: PUT_CRITERIA,
    data,
    id,
  };
}
export function putCriteriaSuccess(data) {
  return {
    type: PUT_CRITERIA_SUCCESS,
    data,
  };
}

export function getItem(id) {
  return {
    type: GET_ITEM,
    id,
  };
}
export function getItemSuccess(data) {
  return {
    type: GET_ITEM_SUCCESS,
    data,
  };
}
export function deleteCriteria(ids) {
  return {
    type: DELETE_CRITERIA,
    ids,
  };
}
export function deleteCriteriaSuccess(data) {
  return {
    type: DELETE_CRITERIA_SUCCESS,
    data,
  };
}
