/*
 *
 * BusinessOpportunities actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_TRADINGS,
  GET_ALL_TRADINGS_SUCCESS,
  GET_ALL_TRADINGS_FAIL,
  ADD_TRADING,
  ADD_TRADING_FAIL,
  ADD_TRADING_SUCCESS,
  DELETE_TRADINGS,
  DELETE_TRADINGS_FAIL,
  DELETE_TRADINGS_SUCCESS,
  UPDATE_TRADING,
  UPDATE_TRADING_FAIL,
  UPDATE_TRADING_SUCCESS,
  EDIT_VIEWCONFIG_ACTION,
  EDIT_VIEWCONFIG_SUCCESS,
  EDIT_VIEWCONFIG_FAIL,
  CHANGE_TAB_TRADING,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function changeTabTradingAction(tab) {
  return {
    type: CHANGE_TAB_TRADING,
    tab,
  };
}

export function fetchAllTradingsAction(query) {
  return {
    type: GET_ALL_TRADINGS,
    query,
  };
}
export function fetchAllTradingsSuccessAction(data, message) {
  return {
    type: GET_ALL_TRADINGS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllTradingsFailAction(err, message) {
  return {
    type: GET_ALL_TRADINGS_FAIL,
    err,
    message,
  };
}
export function addTradingAction(doc) {
  return {
    type: ADD_TRADING,
    doc,
  };
}
export function addTradingSuccessAction(data, message) {
  return {
    type: ADD_TRADING_SUCCESS,
    data,
    message,
  };
}
export function addTradingFailAction(err, message) {
  return {
    type: ADD_TRADING_FAIL,
    err,
    message,
  };
}
export function deleteTradingsAction(deleteIds) {
  return {
    type: DELETE_TRADINGS,
    deleteIds,
  };
}
export function deleteTradingsSuccessAction(data, message) {
  return {
    type: DELETE_TRADINGS_SUCCESS,
    data,
    message,
  };
}
export function deleteTradingsFailAction(err, message) {
  return {
    type: DELETE_TRADINGS_FAIL,
    err,
    message,
  };
}
export function updateTradingAction(doc) {
  return {
    type: UPDATE_TRADING,

    doc,
  };
}
export function updateTradingSuccessAction(data, message) {
  return {
    type: UPDATE_TRADING_SUCCESS,
    data,
    message,
  };
}
export function updateTradingFailAction(err, message) {
  return {
    type: UPDATE_TRADING_FAIL,
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
