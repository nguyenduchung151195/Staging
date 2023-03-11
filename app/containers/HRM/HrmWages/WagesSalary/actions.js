/*
 *
 * WageSalaryManagement actions
 *
 */

import {
  MERGE_DATA,
  CREATE_WAGE_SALARY,
  CREATE_WAGE_SALARY_SUCCESS,
  CREATE_WAGE_SALARY_FAILURE,
  DEFAULT_ACTION,
  UPDATE_WAGE_SALARY,
  UPDATE_WAGE_SALARY_SUCCESS,
  UPDATE_WAGE_SALARY_FAILURE,
  DELETE_WAGE_SALARY,
  DELETE_WAGE_SALARY_SUCCESS,
  DELETE_WAGE_SALARY_FAILURE,
  GET_ALL_SALARY_FORMULA,
  GET_ALL_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_FAILURE,
  GET_SALARY_FORMULA_ATTRIBUTES,
  GET_SALARY_FORMULA_ATTRIBUTES_SUCCESS,
  GET_SALARY_FORMULA_ATTRIBUTES_FAILURE,
} from './constants';

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data
  }
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

export function createWageSalary(data) {
  return {
    type: CREATE_WAGE_SALARY,
    data,
  };
}

export function createWageSalarySuccess(data) {
  return {
    type: CREATE_WAGE_SALARY_SUCCESS,
    data,
  };
}

export function createWageSalaryFailure(error) {
  return {
    type: CREATE_WAGE_SALARY_FAILURE,
    error,
  };
}

export function updateWageSalary(hrmEmployeeId, data) {
  return {
    type: UPDATE_WAGE_SALARY,
    hrmEmployeeId,
    data,
  };
}

export function updateWageSalarySuccess(data) {
  return {
    type: UPDATE_WAGE_SALARY_SUCCESS,
    data,
  };
}

export function updateWageSalaryFailure(error) {
  return {
    type: UPDATE_WAGE_SALARY_FAILURE,
    error,
  };
}

export function deleteWageSalary(hrmEmployeeId, ids) {
  return {
    type: DELETE_WAGE_SALARY,
    hrmEmployeeId,
    ids
  };
}

export function deleteWageSalarySuccess(data) {
  return {
    type: DELETE_WAGE_SALARY_SUCCESS,
    data,
  };
}

export function deleteWageSalaryFailure(error) {
  return {
    type: DELETE_WAGE_SALARY_FAILURE,
    error,
  };
}

export function getSalaryFormulaAttributes(formulaId) {
  return {
    type: GET_SALARY_FORMULA_ATTRIBUTES,
    formulaId,
  }
}
export function getSalaryFormulaAttributesSuccess(data) {
  return {
    type: GET_SALARY_FORMULA_ATTRIBUTES_SUCCESS,
    data
  }
}
export function getSalaryFormulaAttributesFailure(error) {
  return {
    type: GET_SALARY_FORMULA_ATTRIBUTES_FAILURE,
    error
  }
}
