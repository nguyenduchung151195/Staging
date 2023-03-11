/*
 *
 * AddPropertiesGroup actions
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  FETCH_PROPERTIES_GROUP_FAILED,
  RESET_NOTI,
  CRETAE_PROPERTIES_GROUP,
  CRETAE_PROPERTIES_GROUP_FAILED,
  CRETAE_PROPERTIES_GROUP_SUCCESS,
  EDIT_PROPERTIES_GROUP,
  EDIT_PROPERTIES_GROUP_SUCCESS,
  EDIT_PROPERTIES_GROUP_FAILED,
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

export function createPropertiesGroupAct(body) {
  return {
    type: CRETAE_PROPERTIES_GROUP,
    body,
  };
}

export function createPropertiesGroupSuccess(data) {
  return {
    type: CRETAE_PROPERTIES_GROUP_SUCCESS,
    data,
  };
}

export function createPropertiesGroupFailed(err) {
  return {
    type: CRETAE_PROPERTIES_GROUP_FAILED,
    err,
  };
}

export function editPropertiesGroupAct(body) {
  return {
    type: EDIT_PROPERTIES_GROUP,
    body,
  };
}

export function editPropertiesGroupSuccess(data) {
  return {
    type: EDIT_PROPERTIES_GROUP_SUCCESS,
    data,
  };
}

export function editPropertiesGroupFailed(err) {
  return {
    type: EDIT_PROPERTIES_GROUP_FAILED,
    err,
  };
}
