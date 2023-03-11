/*
 *
 * BusinessOpportunities actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_BOS,
  GET_ALL_BOS_SUCCESS,
  GET_ALL_BOS_FAIL,
  ADD_BO,
  ADD_BO_FAIL,
  ADD_BO_SUCCESS,
  DELETE_BOS,
  DELETE_BOS_FAIL,
  DELETE_BOS_SUCCESS,
  UPDATE_BO,
  UPDATE_BO_FAIL,
  UPDATE_BO_SUCCESS,
  EDIT_VIEWCONFIG_ACTION,
  EDIT_VIEWCONFIG_SUCCESS,
  EDIT_VIEWCONFIG_FAIL,
  CREATE_REMINDER,
  CHANGE_TAB_BUS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function changeTabBusAction(tab) {
  return {
    type: CHANGE_TAB_BUS,
    tab,
  };
}

export function fetchAllBosAction(query) {
  return {
    type: GET_ALL_BOS,
    query,
  };
}
export function fetchAllBosSuccessAction(data, message) {
  return {
    type: GET_ALL_BOS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllBosFailAction(err, message) {
  return {
    type: GET_ALL_BOS_FAIL,
    err,
    message,
  };
}
export function addBoAction(doc) {
  return {
    type: ADD_BO,
    doc,
  };
}
export function addBoSuccessAction(data, message) {
  return {
    type: ADD_BO_SUCCESS,
    data,
    message,
  };
}
export function addBoFailAction(err, message) {
  return {
    type: ADD_BO_FAIL,
    err,
    message,
  };
}
export function deleteBosAction(deleteIds) {
  return {
    type: DELETE_BOS,
    deleteIds,
  };
}
export function deleteBosSuccessAction(data, message) {
  return {
    type: DELETE_BOS_SUCCESS,
    data,
    message,
  };
}
export function deleteBosFailAction(err, message) {
  return {
    type: DELETE_BOS_FAIL,
    err,
    message,
  };
}
export function updateBoAction(doc) {
  return {
    type: UPDATE_BO,

    doc,
  };
}
export function updateBoSuccessAction(data, message) {
  return {
    type: UPDATE_BO_SUCCESS,
    data,
    message,
  };
}
export function updateBoFailAction(err, message) {
  return {
    type: UPDATE_BO_FAIL,
    err,
    message,
  };
}

export function editViewConfigAction(newViewConfig) {
  return {
    type: EDIT_VIEWCONFIG_ACTION,
    newViewConfig,
  };
}
export function editViewConfigSuccessAction(data) {
  return {
    type: EDIT_VIEWCONFIG_SUCCESS,
    data,
  };
}
export function editViewConfigFailAction() {
  return {
    type: EDIT_VIEWCONFIG_FAIL,
  };
}

export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function createReminderAction(reminder, id) {
  return {
    type: CREATE_REMINDER,
    reminder,
    id,
  };
}
