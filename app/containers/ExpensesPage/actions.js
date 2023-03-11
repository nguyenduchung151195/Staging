/*
 *
 * ExpensesPage actions
 *
 */

import { 
  DEFAULT_ACTION, 
  MERGE_DATA, 
  GET_COST, 
  GET_COST_SUCCESS, 
  GET_DATA, 
  GET_DATA_SUCCESS,
  UPDATE_EXPENSE,
  UPDATE_EXPENSE_SUCCESS,
  UPDATE_EXPENSE_FAILURE,
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

export function getCost() {
  return {
    type: GET_COST,
  };
}
export function getCostSuccess(forms) {
  return {
    type: GET_COST_SUCCESS,
    forms,
  };
}

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

export function updateExpense(data) {
  return {
    type: UPDATE_EXPENSE,
    data,
  }
}

export function updateExpenseSuccess(data) {
  return {
    type: UPDATE_EXPENSE_SUCCESS,
    data,
  }
}

export function updateExpenseFailure(error) {
  return {
    type: UPDATE_EXPENSE_FAILURE,
    error,
  }
}