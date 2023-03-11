/*
 *
 * AddWages actions
 *
 */

import { DEFAULT_ACTION,
  GET_ALL_SALARY_FORMULA,
  GET_ALL_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAllSalaryFormula() {
  return {
    type: GET_ALL_SALARY_FORMULA
  }
}
export function getAllSalaryFormulaSuccess(data) {
  return {
    type: GET_ALL_SALARY_FORMULA_SUCCESS,
    data
  }
}
export function getAllSalaryFormulaFailure(error) {
  return {
    type: GET_ALL_SALARY_FORMULA_FAILURE,
    error
  }
}
