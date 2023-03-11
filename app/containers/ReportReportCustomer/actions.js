/*
 *
 * ReportReportCustomer actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_REPORT_CUSTOMER,
  GET_REPORT_CUSTOMER_SUCCESS,
  GET_ALL_BOS,
  GET_ALL_BOS_SUCCESS,
  GET_ALL_BOS_FAIL,
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
export function getReportCustomer() {
  return {
    type: GET_REPORT_CUSTOMER,
  };
}
export function getReportCustomerSuccess(customers) {
  return {
    type: GET_REPORT_CUSTOMER_SUCCESS,

    customers,
  };
}
export function fetchAllBosAction(query, limit, skip) {
  return {
    type: GET_ALL_BOS,
    query,
    limit, skip,
  };
}
export function fetchAllBosSuccessAction(data, message) {
  return {
    type: GET_ALL_BOS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllBosFailAction(err, message) {
  return {
    type: GET_ALL_BOS_FAIL,
    err,
    message,
  };
}
export function defaultData() {
  return {
    type: DEFAULT_ACTION,
  };
}
