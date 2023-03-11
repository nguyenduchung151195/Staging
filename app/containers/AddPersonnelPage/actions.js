/*
 *
 * AddPersonnelPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_USER,
  GET_ALL_USER_SUCCESS,
  GET_ALL_USER_FALSE,
  GET_CONFIG,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_FALSE,
  UPDATE_GET_CONFIG,
  UPDATE_GET_CONFIG_SUCCESS,
  UPDATE_GET_CONFIG_FALSE,
  GET_LIST_DEPARTMENT,
  GET_LIST_DEPARTMENT_SUCCESS,
  GET_LIST_DEPARTMENT_FALSE,
  RESET_NOTI,
  MERGE_DATA,
  UPDATE_EMPLOYEES,
  UPDATE_EMPLOYEES_SUCCESS,
  UPDATE_EMPLOYEES_FAILED,
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
export function resetNoti() {
  return {
    type: RESET_NOTI,
  };
}
export function fetchAllUserAction(body) {
  return {
    type: GET_ALL_USER,
    body,
  };
}
export function fetchAllUserSuccessAction(data) {
  return {
    type: GET_ALL_USER_SUCCESS,
    data,
  };
}
export function fetchAllUserfalseAction() {
  return {
    type: GET_ALL_USER_FALSE,
  };
}
export function fetchConfigAction(id) {
  return {
    type: GET_CONFIG,
    id,
  };
}
export function fetchConfigSuccessAction(config) {
  return {
    type: GET_CONFIG_SUCCESS,
    config,
  };
}
export function fetchConfigfalseAction() {
  return {
    type: GET_CONFIG_FALSE,
  };
}
export function fetchUpdateConfigAction(body) {
  return {
    type: UPDATE_GET_CONFIG,
    body,
  };
}
export function fetchUpdateConfigSuccessAction(data) {
  return {
    type: UPDATE_GET_CONFIG_SUCCESS,
    data,
  };
}
export function fetchUpdateConfigfalseAction() {
  return {
    type: UPDATE_GET_CONFIG_FALSE,
  };
}

export function fetchListDepartment() {
  return {
    type: GET_LIST_DEPARTMENT,
  };
}
export function fetchListDepartmentSuccess(data) {
  return {
    type: GET_LIST_DEPARTMENT_SUCCESS,
    data,
  };
}
export function fetchListDepartmentFalse(err) {
  return {
    type: GET_LIST_DEPARTMENT_FALSE,
    err,
  };
}

export function updateEmployees(body) {
  return {
    type: UPDATE_EMPLOYEES,
    body,
  };
}

export function updateEmployeesSuccess(data) {
  return {
    type: UPDATE_EMPLOYEES_SUCCESS,
    data,
  };
}
export function updateEmployeesFailed(err) {
  return {
    type: UPDATE_EMPLOYEES_FAILED,
    err,
  };
}

