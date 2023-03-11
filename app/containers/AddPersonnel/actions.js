/*
 *
 * AddPersonnel actions
 *
 */
/*
 *
 * AddUserPage actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_DEPARTMENT,
  GET_DEPARTMENT_SUCCESS,
  GET_DEFAULT,
  GET_DATA,
  GET_DATA_SUCCESS,
  POST_PERSONNEL,
  POST_PERSONNEL_SUCCESS,
  GET_PERSONNEL_CURRENT,
  GET_PERSONNEL_CURRENT_SUCCESS,
  PUT_PERSONNEL,
  PUT_PERSONNEL_SUCCESS,
  CHANGE_IMAGE,
  POST_EQUIPMENT_SUCCESS,
  GET_ALL_EQUIPMENT_OF_EMPLOYEE,
  GET_ALL_EQUIPMENT_OF_EMPLOYEE_SUCCESS,
  GET_ALL_EQUIPMENT_OF_EMPLOYEE_FAILURE,
  CHANGE_TAB,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function getDepartment() {
  return {
    type: GET_DEPARTMENT,
  };
}
export function getDepartmentSuccess(departments) {
  return {
    type: GET_DEPARTMENT_SUCCESS,
    departments,
  };
}
export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}
export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(data) {
  return {
    type: GET_DATA_SUCCESS,
    data,
  };
}
export function getPersonnelCurent(id, data) {
  return {
    type: GET_PERSONNEL_CURRENT,
    id,
    data,
  };
}
export function getPersonnelCurentSuccess(data) {
  return {
    type: GET_PERSONNEL_CURRENT_SUCCESS,
    data,
  };
}
export function postPersonnel(data) {
  return {
    type: POST_PERSONNEL,
    data,
  };
}
export function postPersonnelSuccess(data) {
  return {
    type: POST_PERSONNEL_SUCCESS,
    data,
  };
}
export function postEquipmentSuccess(data) {
  return {
    type: POST_EQUIPMENT_SUCCESS,
    data,
  };
}
export function putPersonnel(data, id) {
  return {
    type: PUT_PERSONNEL,
    data,
    id,
  };
}
export function putPersonnelSuccess(data) {
  return {
    type: PUT_PERSONNEL_SUCCESS,
    data,
  };
}
export function changeImage(data) {
  return {
    type: CHANGE_IMAGE,
    data,
  };
}

// lay tat ca may cham cong cua nhan vien
export function getAllEquipmentOfEmployee(_id) {
  return {
    type: GET_ALL_EQUIPMENT_OF_EMPLOYEE,
    _id,
  };
}
export function getAllEquipmentOfEmployeeSuccess(data) {
  return {
    type: GET_ALL_EQUIPMENT_OF_EMPLOYEE_SUCCESS,
    data,
  };
}
export function getAllEquipmentOfEmployeeFailure(error) {
  return {
    type: GET_ALL_EQUIPMENT_OF_EMPLOYEE_FAILURE,
    error,
  };
}
