/*
 *
 * ContactCenterFormPage actions
 *
 */

import {
  DEFAULT_ACTION,
  ADD_CONTACT_CENTER,
  ADD_CONTACT_CENTER_ERROR,
  ADD_CONTACT_CENTER_SUCCESS,
  GET_CONTACT_CENTER_BY_ID_ERROR,
  GET_CONTACT_CENTER_BY_ID,
  GET_CONTACT_CENTER_BY_ID_SUCCESS,
  GET_EMPLOYEE_IDS_SUCCESS,
  GET_EMPLOYEE_IDS,
  GET_EMPLOYEE_IDS_ERROR,
  EDIT_CONTACT_CENTER,
  EDIT_CONTACT_CENTER_ERROR,
  EDIT_CONTACT_CENTER_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function addContactCenterAction(data) {
  return {
    type: ADD_CONTACT_CENTER,
    data,
  };
}
export function addContactCenterSuccessAction() {
  return {
    type: ADD_CONTACT_CENTER_SUCCESS,
  };
}
export function addContactCenterErrorAction() {
  return {
    type: ADD_CONTACT_CENTER_ERROR,
  };
}
export function editContactCenterAction(data) {
  return {
    type: EDIT_CONTACT_CENTER,
    data,
  };
}
export function editContactCenterSuccessAction() {
  return {
    type: EDIT_CONTACT_CENTER_SUCCESS,
  };
}
export function editContactCenterErrorAction() {
  return {
    type: EDIT_CONTACT_CENTER_ERROR,
  };
}
export function getContactCenterByIdAction(id) {
  return {
    type: GET_CONTACT_CENTER_BY_ID,
    id,
  };
}
export function getContactCenterByIdSuccessAction(data) {
  return {
    type: GET_CONTACT_CENTER_BY_ID_SUCCESS,
    data,
  };
}
export function getContactCenterByIdErrorAction() {
  return {
    type: GET_CONTACT_CENTER_BY_ID_ERROR,
  };
}
export function getEmployeeByIdAction(query) {
  return {
    type: GET_EMPLOYEE_IDS,
    query,
  };
}
export function getEmployeeByIdSuccessAction(data) {
  return {
    type: GET_EMPLOYEE_IDS_SUCCESS,
    data,
  };
}
export function getEmployeeByIdErrorAction() {
  return {
    type: GET_EMPLOYEE_IDS_ERROR,
  };
}
