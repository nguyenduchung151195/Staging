/*
 *
 * AddPaymentPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_COMMAND,
  GET_COMMAND_SUCCESS,
  GET_COMMAND_FAILED,
  CREATE_PAYMENT_RECORD,
  CREATE_PAYMENT_RECORD_SUCCESS,
  CREATE_PAYMENT_RECORD_FAILED,
  GET_PAYMENT_RECORD_BY_ID,
  GET_PAYMENT_RECORD_BY_ID_SUCCESS,
  GET_PAYMENT_RECORD_BY_ID_FAILED,
  UPDATE_PAYMENT_RECORD,
  UPDATE_PAYMENT_RECORD_SUCCESS,
  UPDATE_PAYMENT_RECORD_FAILED,
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

export function createPaymentRecordAct(body) {
  return {
    type: CREATE_PAYMENT_RECORD,
    body,
  };
}
export function createPaymentRecordSuccess(data) {
  return {
    type: CREATE_PAYMENT_RECORD_SUCCESS,
    data,
  };
}
export function createPaymentRecordFailed(err) {
  return {
    type: CREATE_PAYMENT_RECORD_FAILED,
    err,
  };
}

export function getPaymentRecordByIdAct(body) {
  return {
    type: GET_PAYMENT_RECORD_BY_ID,
    body,
  };
}
export function getPaymentRecordByIdSuccess(data) {
  return {
    type: GET_PAYMENT_RECORD_BY_ID_SUCCESS,
    data,
  };
}
export function getPaymentRecordByIdFailed(err) {
  return {
    type: GET_PAYMENT_RECORD_BY_ID_FAILED,
    err,
  };
}

export function updatePaymentRecordAct(body) {
  return {
    type: UPDATE_PAYMENT_RECORD,
    body,
  };
}
export function updatePaymentRecordSuccess(data) {
  return {
    type: UPDATE_PAYMENT_RECORD_SUCCESS,
    data,
  };
}
export function updatePaymentRecordFailed(err) {
  return {
    type: UPDATE_PAYMENT_RECORD_FAILED,
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
