/*
 *
 * EditPropertiesSet actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  FETCH_PROPERTIES_GROUP_FAILED,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_FAILED,
  FETCH_PROPERTIES_SUCCESS,
  EDIT_PROPERTIES_SET,
  EDIT_PROPERTIES_SET_SUCCESS,
  EDIT_PROPERTIES_SET_FAILED,
  GET_PROPERTIES_SET,
  GET_PROPERTIES_SET_FAILED,
  GET_PROPERTIES_SET_SUCCESS,
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

export function editPropertiesSetAct(body) {
  return {
    type: EDIT_PROPERTIES_SET,
    body,
  };
}

export function editPropertiesSetSuccess(data) {
  return {
    type: EDIT_PROPERTIES_SET_SUCCESS,
    data,
  };
}

export function editPropertiesSetFailed(err) {
  return {
    type: EDIT_PROPERTIES_SET_FAILED,
    err,
  };
}

export function getPropertiesSetAct(body) {
  return {
    type: GET_PROPERTIES_SET,
    body,
  };
}

export function getPropertiesSetSuccess(data) {
  return {
    type: GET_PROPERTIES_SET_SUCCESS,
    data,
  };
}

export function getPropertiesSetFailed(err) {
  return {
    type: GET_PROPERTIES_SET_FAILED,
    err,
  };
}
