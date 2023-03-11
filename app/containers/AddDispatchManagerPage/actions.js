/*
 *
 * AddDispatchManagerPage actions
 *
 */

import * as types from './constants';

// import { MEGER_DATA } from './constants';

export function defaultAction() {
  return {
    type: types.DEFAULT_ACTION,
  };
}
export function createDocumentAction(data) {
  return {
    type: types.CREATE_DOCUMENT,
    data,
  };
}
export function createDocumentSuccessAction() {
  return {
    type: types.CREATE_DOCUMENT_SUCCESS,
  };
}
export function createDocumentFaileAction() {
  return {
    type: types.CREATE_DOCUMENT_FAILED,
  };
}

export function updateDocumentAct(id, data) {
  return {
    type: types.UPDATE_DOCUMENT,
    id,
    data,
  };
}
export function updateDocumentSuccess(data) {
  return {
    type: types.UPDATE_DOCUMENT_SUCCESS,
    data,
  };
}
export function updateDocumentFailed() {
  return {
    type: types.UPDATE_DOCUMENT_FAILED,
  };
}

export function mergeData(data) {
  return {
    type: types.MEGER_DATA,
    data,
  };
}

export function getCurrent(id) {
  return {
    type: types.GET_CURRENT,
    id,
  };
}

export function getCurrentSuccess(data) {
  return {
    type: types.GET_CURRENT_SUCCSESS,
    data,
  };
}

export function getDefault() {
  return {
    type: types.GET_DEFAULT,
  };
}

export function getLogAct(query) {
  return {
    type: types.GET_LOG_ACTION,
    query,
  };
}

export function getLogSuccessAct(data) {
  return {
    type: types.GET_LOG_SUCCESS_ACTION,
    data,
  };
}
