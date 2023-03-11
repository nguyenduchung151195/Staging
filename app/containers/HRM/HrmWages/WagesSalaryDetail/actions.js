/*
 *
 * WageSalaryManagement actions
 *
 */

import {
  MERGE_DATA,
  DEFAULT_ACTION,
  GET_DETAIL_WAGE_SALARY,
  GET_DETAIL_WAGE_SALARY_SUCCESS,
  GET_DETAIL_WAGE_SALARY_FAILURE,
  SEND_MAIL_WAGE_SALARY,
  SEND_MAIL_WAGE_SALARY_SUCCESS,
  SEND_MAIL_WAGE_SALARY_FAILURE,
  GET_ALL_TEMPLATE,
  GET_ALL_TEMPLATE_SUCCESS,
  GET_ALL_TEMPLATE_FAILURE,
  PUT_DATA_WAGE,
  PUT_DATA_WAGE_FAILURE,
  PUT_DATA_WAGE_SUCCESS,
} from './constants';

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getDetailWageSalary(data) {
  return {
    type: GET_DETAIL_WAGE_SALARY,
    data,
  };
}

export function getDetailWageSalarySuccess(data) {
  return {
    type: GET_DETAIL_WAGE_SALARY_SUCCESS,
    data,
  };
}

export function getDetailWageSalaryFailure(error) {
  return {
    type: GET_DETAIL_WAGE_SALARY_FAILURE,
    error,
  };
}

export function sendMailWageSalary(data) {
  return {
    type: SEND_MAIL_WAGE_SALARY,
    data,
  };
}

export function sendMailWageSalarySuccess(data) {
  return {
    type: SEND_MAIL_WAGE_SALARY_SUCCESS,
    data,
  };
}

export function sendMailWageSalaryFailure(error) {
  return {
    type: SEND_MAIL_WAGE_SALARY_FAILURE,
    error,
  };
}

export function putDataWage(data, id) {
  return {
    type: PUT_DATA_WAGE,
    data,
    id,
  };
}

export function putDataWageSuccess(data) {
  return {
    type: PUT_DATA_WAGE_SUCCESS,
    data,
  };
}

export function putDataWageFailure(error) {
  return {
    type: PUT_DATA_WAGE_FAILURE,
    error,
  };
}

export function getAllTemplate() {
  return {
    type: GET_ALL_TEMPLATE,
  };
}
export function getAllTemplateSuccess(data) {
  return {
    type: GET_ALL_TEMPLATE_SUCCESS,
    data,
  };
}
export function getAllTemplateFailure(error) {
  return {
    type: GET_ALL_TEMPLATE_FAILURE,
    error,
  };
}
