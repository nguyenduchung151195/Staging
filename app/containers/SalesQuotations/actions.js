/*
 *
 * SalesQuotations actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_SALES,
  GET_SALES_SUCCESS,
  SET_STATE,
  GET_TEMPLATE,
  GET_DATA,
  GET_DATA_SUCCESS,
  // GET_APPROVE,
  // GET_APPROVE_SUCCESS,
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

export function getSales() {
  return {
    type: GET_SALES,
  };
}
export function getSalesSuccess(sales) {
  return {
    type: GET_SALES_SUCCESS,

    sales,
  };
}

export const handleChange = (name, value) => ({ type: SET_STATE, name, value });
export const printTemplate = data => ({ type: GET_TEMPLATE, data });
export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(businessData, exchangingData) {
  return {
    type: GET_DATA_SUCCESS,
    businessData,
    exchangingData,
  };
}
