/*
 *
 * AddRevenueAndExpenditurePage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  CREATE_RECORD,
  CREATE_RECORD_SUCCESS,
  CREATE_RECORD_FAILED,
  RESET_NOTI,
  GET_RECORD_BY_ID,
  GET_RECORD_BY_ID_SUCCESS,
  GET_RECORD_BY_ID_FAILED,
  UPDATE_RECORD,
  UPDATE_RECORD_SUCCESS,
  UPDATE_RECORD_FAILED,
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

export function getCatalogAct(body) {
  return {
    type: GET_CATEGORY,
    body,
  };
}

export function getCatalogSuccess(data) {
  return {
    type: GET_CATEGORY_SUCCESS,
    data,
  };
}

export function getCatalogFailed(err) {
  return {
    type: GET_CATEGORY_FAILED,
    err,
  };
}

export function createRecordAct(body) {
  return {
    type: CREATE_RECORD,
    body,
  };
}

export function createRecordSuccess(data) {
  return {
    type: CREATE_RECORD_SUCCESS,
    data,
  };
}

export function createRecordFailed(err) {
  return {
    type: CREATE_RECORD_FAILED,
    err,
  };
}

export function getRecordAct(body) {
  return {
    type: GET_RECORD_BY_ID,
    body,
  };
}

export function getRecordSuccess(data) {
  return {
    type: GET_RECORD_BY_ID_SUCCESS,
    data,
  };
}

export function getRecordFailed(err) {
  return {
    type: GET_RECORD_BY_ID_FAILED,
    err,
  };
}

export function updateRecordAct(body) {
  return {
    type: UPDATE_RECORD,
    body,
  };
}

export function updateRecordSuccess(data) {
  return {
    type: UPDATE_RECORD_SUCCESS,
    data,
  };
}

export function updateRecordFailed(err) {
  return {
    type: UPDATE_RECORD_FAILED,
    err,
  };
}
