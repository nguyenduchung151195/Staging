/*
 *
 * PropertiesPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  FETCH_PROPERTIES_SET,
  FETCH_PROPERTIES_SET_SUCCESS,
  FETCH_PROPERTIES_SET_FAILED,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  FETCH_PROPERTIES_GROUP_FAILED,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_FAILED,
  DELETE_PROPERTIE,
  DELETE_PROPERTIE_FAILED,
  DELETE_PROPERTIE_SUCCESS,
  DELETE_PROPERTIES_GROUP,
  DELETE_PROPERTIES_GROUP_SUCCESS,
  DELETE_PROPERTIES_GROUP_FAILED,
  DELETE_PROPERTIES_SET,
  DELETE_PROPERTIES_SET_SUCCESS,
  DELETE_PROPERTIES_SET_FAILED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetNoti() {
  return {
    type: RESET_NOTI,
  };
}

export function fetchPropertiesSetAct(body) {
  return {
    type: FETCH_PROPERTIES_SET,
    body,
  };
}

export function fetchPropertiesSetSuccess(data) {
  return {
    type: FETCH_PROPERTIES_SET_SUCCESS,
    data,
  };
}

export function fetchPropertiesSetFailed(err) {
  return {
    type: FETCH_PROPERTIES_SET_FAILED,
    err,
  };
}

export function fetchPropertiesGroupAct(body) {
  return {
    type: FETCH_PROPERTIES_GROUP,
    body,
  };
}

export function fetchPropertiesGroupSuccess(data) {
  return {
    type: FETCH_PROPERTIES_GROUP_SUCCESS,
    data,
  };
}

export function fetchPropertiesGroupFailed(err) {
  return {
    type: FETCH_PROPERTIES_GROUP_FAILED,
    err,
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

export function deletePropertieAct(body) {
  return {
    type: DELETE_PROPERTIE,
    body,
  };
}

export function deletePropertieSuccess(data) {
  return {
    type: DELETE_PROPERTIE_SUCCESS,
    data,
  };
}

export function deletePropertieFailed(err) {
  return {
    type: DELETE_PROPERTIE_FAILED,
    err,
  };
}

export function deletePropertiesGroupAct(body) {
  return {
    type: DELETE_PROPERTIES_GROUP,
    body,
  };
}

export function deletePropertiesGroupSuccess(data) {
  return {
    type: DELETE_PROPERTIES_GROUP_SUCCESS,
    data,
  };
}

export function deletePropertiesGroupFailed(err) {
  return {
    type: DELETE_PROPERTIES_GROUP_FAILED,
    err,
  };
}

export function deletePropertiesSetAct(body) {
  return {
    type: DELETE_PROPERTIES_SET,
    body,
  };
}

export function deletePropertiesSetSuccess(data) {
  return {
    type: DELETE_PROPERTIES_SET_SUCCESS,
    data,
  };
}

export function deletePropertiesSetFailed(err) {
  return {
    type: DELETE_PROPERTIES_SET_FAILED,
    err,
  };
}
