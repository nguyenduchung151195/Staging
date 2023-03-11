/*
 *
 * AddAdvancePage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_COMMAND,
  GET_COMMAND_SUCCESS,
  GET_COMMAND_FAILED,
  CREATE_ADVANCE_RECORD,
  CREATE_ADVANCE_RECORD_SUCCESS,
  CREATE_ADVANCE_RECORD_FAILED,
  GET_ADVANCE_RECORD_BY_ID,
  GET_ADVANCE_RECORD_BY_ID_SUCCESS,
  GET_ADVANCE_RECORD_BY_ID_FAILED,
  UPDATE_ADVANCE_RECORD,
  UPDATE_ADVANCE_RECORD_SUCCESS,
  UPDATE_ADVANCE_RECORD_FAILED,
  GET_ADVANCE_RECORD,
  GET_ADVANCE_RECORD_SUCCESS,
  GET_ADVANCE_RECORD_FAILED,
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

export function getCommandAct(body) {
  return {
    type: GET_COMMAND,
    body,
  };
}
export function getCommandSuccess(data) {
  return {
    type: GET_COMMAND_SUCCESS,
    data,
  };
}
export function getCommandFailed(err) {
  return {
    type: GET_COMMAND_FAILED,
    err,
  };
}

export function createAdvanceRecordAct(body) {
  return {
    type: CREATE_ADVANCE_RECORD,
    body,
  };
}
export function createAdvanceRecordSuccess(data) {
  return {
    type: CREATE_ADVANCE_RECORD_SUCCESS,
    data,
  };
}
export function createAdvanceRecordFailed(err) {
  return {
    type: CREATE_ADVANCE_RECORD_FAILED,
    err,
  };
}

export function getAdvanceRecordByIdAct(body) {
  return {
    type: GET_ADVANCE_RECORD_BY_ID,
    body,
  };
}
export function getAdvanceRecordByIdSuccess(data) {
  return {
    type: GET_ADVANCE_RECORD_BY_ID_SUCCESS,
    data,
  };
}
export function getAdvanceRecordByIdFailed(err) {
  return {
    type: GET_ADVANCE_RECORD_BY_ID_FAILED,
    err,
  };
}

export function updateAdvanceRecordAct(body) {
  return {
    type: UPDATE_ADVANCE_RECORD,
    body,
  };
}
export function updateAdvanceRecordSuccess(data) {
  return {
    type: UPDATE_ADVANCE_RECORD_SUCCESS,
    data,
  };
}
export function updateAdvanceRecordFailed(err) {
  return {
    type: UPDATE_ADVANCE_RECORD_FAILED,
    err,
  };
}

export function getAdvanceRecordAct(body) {
  return {
    type: GET_ADVANCE_RECORD,
    body,
  };
}
export function getAdvanceRecordSuccess(data) {
  return {
    type: GET_ADVANCE_RECORD_SUCCESS,
    data,
  };
}
export function getAdvanceRecordFailed(err) {
  return {
    type: GET_ADVANCE_RECORD_FAILED,
    err,
  };
}
