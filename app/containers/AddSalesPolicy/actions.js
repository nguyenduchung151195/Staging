/*
 *
 * AddSalesPolicy actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_SALES_POLICY,
  GET_SALES_POLICY_SUCCESS,
  GET_DEFAULT,
  GET_SALES_POLICY_CURRENT,
  GET_SALES_POLICY_CURRENT_SUCCESS,
  POST_SALES_POLICY,
  POST_SALES_POLICY_SUCCESS,
  PUT_SALES_POLICY,
  PUT_SALES_POLICY_SUCCESS,
  HANDLE_CLOSE,
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
export function getSalesPolicy() {
  return {
    type: GET_SALES_POLICY,
  };
}
export function getSalesPolicySuccess(products, categorys, labels, sources) {
  return {
    type: GET_SALES_POLICY_SUCCESS,
    products,
    categorys,
    labels,
    sources,
  };
}
export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}
export function getSalesPolicyCurrent(id) {
  return {
    type: GET_SALES_POLICY_CURRENT,
    id,
  };
}
export function getSalesPolicyCurrentSuccess(data) {
  return {
    type: GET_SALES_POLICY_CURRENT_SUCCESS,
    data,
  };
}
export function postSalesPolicy(data) {
  return {
    data,
    type: POST_SALES_POLICY,
  };
}
export function postSalesPolicySuccess(data) {
  return {
    type: POST_SALES_POLICY_SUCCESS,
    data,
  };
}
export function putSalesPolicy(data, id) {
  return {
    type: PUT_SALES_POLICY,
    data,
    id,
  };
}
export function putSalesPolicySuccess(data) {
  return {
    type: PUT_SALES_POLICY_SUCCESS,
    data,
  };
}
export function handleClose() {
  return {
    type: HANDLE_CLOSE,
  };
}
