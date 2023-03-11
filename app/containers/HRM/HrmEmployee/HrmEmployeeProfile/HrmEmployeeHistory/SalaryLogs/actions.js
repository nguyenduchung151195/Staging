/*
 *
 * SalaryPage actions
 *
 */

import {
  CREATE_SALARY,
  CREATE_SALARY_SUCCESS,
  CREATE_SALARY_FAILURE,
  DEFAULT_ACTION,
  UPDATE_SALARY,
  UPDATE_SALARY_SUCCESS,
  UPDATE_SALARY_FAILURE,
  DELETE_SALARY,
  DELETE_SALARY_SUCCESS,
  DELETE_SALARY_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function createSalary(data) {
  return {
    type: CREATE_SALARY,
    data,
  };
}

export function createSalarySuccess(data) {
  return {
    type: CREATE_SALARY_SUCCESS,
    data,
  };
}

export function createSalaryFailure(error) {
  return {
    type: CREATE_SALARY_FAILURE,
    error,
  };
}

export function updateSalary(hrmEmployeeId, data) {
  return {
    type: UPDATE_SALARY,
    hrmEmployeeId,
    data,
  };
}

export function updateSalarySuccess(data) {
  return {
    type: UPDATE_SALARY_SUCCESS,
    data,
  };
}

export function updateSalaryFailure(error) {
  return {
    type: UPDATE_SALARY_FAILURE,
    error,
  };
}

export function deleteSalary(hrmEmployeeId, ids) {
  return {
    type: DELETE_SALARY,
    hrmEmployeeId,
    ids,
  };
}

export function deleteSalarySuccess(data) {
  return {
    type: DELETE_SALARY_SUCCESS,
    data,
  };
}

export function deleteSalaryFailure(error) {
  return {
    type: DELETE_SALARY_FAILURE,
    error,
  };
}
