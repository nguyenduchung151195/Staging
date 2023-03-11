/*
 *
 * AddPropertie actions
 *
 */

import {
  DEFAULT_ACTION,
  CREATE_PROPERTIE,
  CREATE_PROPERTIE_FAILED,
  CREATE_PROPERTIE_SUCCESS,
  EDIT_PROPERTIE,
  EDIT_PROPERTIE_FAILED,
  EDIT_PROPERTIE_SUCCESS,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_FAILED,
  FETCH_PROPERTIES_SUCCESS,
  RESET_NOTI,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetNotiAct() {
  return {
    type: RESET_NOTI,
  };
}

export function fetchPropertiesAct(body) {
  return {
    type: FETCH_PROPERTIES,
    body,
  };
}

export function fetchPropertiesSuccess(data) {
  return {
    type: FETCH_PROPERTIES_SUCCESS,
    data,
  };
}

export function fetchPropertiesFailed(err) {
  return {
    type: FETCH_PROPERTIES_FAILED,
    err,
  };
}

export function createPropertieAct(body) {
  return {
    type: CREATE_PROPERTIE,
    body,
  };
}

export function createPropertieSuccess(data) {
  return {
    type: CREATE_PROPERTIE_SUCCESS,
    data,
  };
}

export function createPropertieFailed(err) {
  return {
    type: CREATE_PROPERTIE_FAILED,
    err,
  };
}

export function editPropertieAct(body) {
  return {
    type: EDIT_PROPERTIE,
    body,
  };
}

export function editPropertieSuccess(data) {
  return {
    type: EDIT_PROPERTIE_SUCCESS,
    data,
  };
}

export function editPropertieFailed(err) {
  return {
    type: EDIT_PROPERTIE_FAILED,
    err,
  };
}
