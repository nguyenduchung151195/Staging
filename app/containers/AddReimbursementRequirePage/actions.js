/*
 *
 * AddReimbursementRequirePage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ADVANCE,
  GET_ADVANCE_SUCCESS,
  GET_ADVANCE_FAILED,
  CREATE_REIMBURSEMENT_RECORD,
  CREATE_REIMBURSEMENT_RECORD_SUCCESS,
  CREATE_REIMBURSEMENT_RECORD_FAILED,
  GET_REIMBURSEMENT_RECORD_BY_ID,
  GET_REIMBURSEMENT_RECORD_BY_ID_SUCCESS,
  GET_REIMBURSEMENT_RECORD_BY_ID_FAILED,
  UPDATE_REIMBURSEMENT_RECORD,
  UPDATE_REIMBURSEMENT_RECORD_SUCCESS,
  UPDATE_REIMBURSEMENT_RECORD_FAILED,
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

export function getAdvanceAct(body) {
  return {
    type: GET_ADVANCE,
    body,
  };
}
export function getAdvanceSuccess(data) {
  return {
    type: GET_ADVANCE_SUCCESS,
    data,
  };
}
export function getAdvanceFailed(err) {
  return {
    type: GET_ADVANCE_FAILED,
    err,
  };
}

export function createReiburementRecordAct(body) {
  return {
    type: CREATE_REIMBURSEMENT_RECORD,
    body,
  };
}
export function createReiburementRecordSuccess(data) {
  return {
    type: CREATE_REIMBURSEMENT_RECORD_SUCCESS,
    data,
  };
}
export function createReiburementRecordFailed(err) {
  return {
    type: CREATE_REIMBURSEMENT_RECORD_FAILED,
    err,
  };
}

export function getReibursementAct(body) {
  return {
    type: GET_REIMBURSEMENT_RECORD_BY_ID,
    body,
  };
}
export function getReibursementSuccess(data) {
  return {
    type: GET_REIMBURSEMENT_RECORD_BY_ID_SUCCESS,
    data,
  };
}
export function getReibursementFailed(err) {
  return {
    type: GET_REIMBURSEMENT_RECORD_BY_ID_FAILED,
    err,
  };
}

export function updateReiburementRecordAct(body) {
  return {
    type: UPDATE_REIMBURSEMENT_RECORD,
    body,
  };
}
export function updateReiburementRecordSuccess(data) {
  return {
    type: UPDATE_REIMBURSEMENT_RECORD_SUCCESS,
    data,
  };
}
export function updateReiburementRecordFailed(err) {
  return {
    type: UPDATE_REIMBURSEMENT_RECORD_FAILED,
    err,
  };
}
