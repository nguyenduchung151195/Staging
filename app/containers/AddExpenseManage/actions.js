/*
 *
 * AddExpenseManage actions
 *
 */

import { DEFAULT_ACTION, GET_REPORT_EXPENSE, GET_REPORT_EXPENSE_FAILURE, GET_REPORT_EXPENSE_SUCCESS, MERGE_DATA } from './constants';

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

export function getReportExpense(path) {
  return {
    type: GET_REPORT_EXPENSE,
    path
  }
}
export function getReportExpenseSuccess(data) {
  return {
    type: GET_REPORT_EXPENSE_SUCCESS,
    data
  }
}
export function getReportExpenseFailure(error) {
  return {
    type: GET_REPORT_EXPENSE_FAILURE,
    error
  }
}
