/*
 *
 * AddPropertiesSet actions
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
  CREATE_PROPERTIES_SET,
  CREATE_PROPERTIES_SET_SUCCESS,
  CREATE_PROPERTIES_SET_FAILED,
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

export function createPropertiesSetAct(body) {
  return {
    type: CREATE_PROPERTIES_SET,
    body,
  };
}

export function createPropertiesSetSuccess(data) {
  return {
    type: CREATE_PROPERTIES_SET_SUCCESS,
    data,
  };
}

export function createPropertiesSetFailed(err) {
  return {
    type: CREATE_PROPERTIES_SET_FAILED,
    err,
  };
}
