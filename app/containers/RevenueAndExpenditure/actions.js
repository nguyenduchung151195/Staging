/*
 *
 * RevenueAndExpenditure actions
 *
 */

import { UPDATE_RECORD_FAILED } from '../AddRevenueAndExpenditurePage/constants';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ALL_RECORD,
  GET_ALL_RECORD_SUCCESS,
  GET_ALL_RECORD_FAILED,
  DELETE_RECORD,
  DELETE_RECORD_SUCCESS,
  DELETE_RECORD_FAILED,
  GET_ADVENCE_RECORD,
  GET_ADVENCE_RECORD_SUCCESS,
  GET_ADVENCE_RECORD_FAILED,
  RESET_LIST,
  DELETE_ADVENCE_RECORD,
  DELETE_ADVENCE_RECORD_SUCCESS,
  DELETE_ADVENCE_RECORD_FAILED,
  GET_REIBURSEMENT_RECORD,
  GET_REIBURSEMENT_RECORD_SUCCESS,
  GET_REIBURSEMENT_RECORD_FAILED,
  DELETE_REIBURSEMENT_RECORD,
  DELETE_REIBURSEMENT_RECORD_SUCCESS,
  DELETE_REIBURSEMENT_RECORD_FAILED,
  GET_PAYMENT_RECORD,
  GET_PAYMENT_RECORD_SUCCESS,
  GET_PAYMENT_RECORD_FAILED,
  DELETE_PAYMENT_RECORD,
  DELETE_PAYMENT_RECORD_SUCCESS,
  DELETE_PAYMENT_RECORD_FAILED,
  GET_COUNT,
  GET_COUNT_SUCCESS,
  GET_COUNT_FAILED,
  UPDATE_RECORD,
  UPDATE_RECORD_SUCCESS,
  UPDATE_RECORD_ADVANCE,
  UPDATE_RECORD_ADVANCE_SUCCESS,
  UPDATE_RECORD_ADVANCE_FAILURE,
  UPDATE_RECORD_REIBURSEMENT,
  UPDATE_RECORD_REIBURSEMENT_SUCCESS,
  UPDATE_RECORD_REIBURSEMENT_FAILURE,
  UPDATE_RECORD_PAYMENT,
  UPDATE_RECORD_PAYMENT_SUCCESS,
  UPDATE_RECORD_PAYMENT_FAILURE,
  MERGE_DATA,
  CHANGE_TAB,
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

export function resetList() {
  return {
    type: RESET_LIST,
  };
}

export function getAllRecordAct(body) {
  return {
    type: GET_ALL_RECORD,
    body,
  };
}

export function getAllRecordSuccess(data) {
  return {
    type: GET_ALL_RECORD_SUCCESS,
    data,
  };
}

export function getAllRecordFailed(err) {
  return {
    type: GET_ALL_RECORD_FAILED,
    err,
  };
}
export function getAdvanceRecordAct(body) {
  return {
    type: GET_ADVENCE_RECORD,
    body,
  };
}

export function getAdvanceRecordSuccess(data) {
  return {
    type: GET_ADVENCE_RECORD_SUCCESS,
    data,
  };
}

export function getAdvanceRecordFailed(err) {
  return {
    type: GET_ADVENCE_RECORD_FAILED,
    err,
  };
}

export function deleteRecordAct(body) {
  return {
    type: DELETE_RECORD,
    body,
  };
}

export function deleteRecordSuccess(data) {
  return {
    type: DELETE_RECORD_SUCCESS,
    data,
  };
}

export function deleteRecordFailed(err) {
  return {
    type: DELETE_RECORD_FAILED,
    err,
  };
}

export function deleteAdvanceRecordAct(body) {
  return {
    type: DELETE_ADVENCE_RECORD,
    body,
  };
}

export function deleteAdvanceRecordSuccess(data) {
  return {
    type: DELETE_ADVENCE_RECORD_SUCCESS,
    data,
  };
}

export function deleteAdvanceRecordFailed(err) {
  return {
    type: DELETE_ADVENCE_RECORD_FAILED,
    err,
  };
}

export function getReibursementRecordAct(body) {
  return {
    type: GET_REIBURSEMENT_RECORD,
    body,
  };
}

export function getReibursementRecordSuccess(data) {
  return {
    type: GET_REIBURSEMENT_RECORD_SUCCESS,
    data,
  };
}

export function getReibursementRecordFailed(err) {
  return {
    type: GET_REIBURSEMENT_RECORD_FAILED,
    err,
  };
}

export function deleteReibursementRecordAct(body) {
  return {
    type: DELETE_REIBURSEMENT_RECORD,
    body,
  };
}

export function deleteReibursementRecordSuccess(data) {
  return {
    type: DELETE_REIBURSEMENT_RECORD_SUCCESS,
    data,
  };
}

export function deleteReibursementRecordFailed(err) {
  return {
    type: DELETE_REIBURSEMENT_RECORD_FAILED,
    err,
  };
}

export function getPaymentRecordAct(body) {
  return {
    type: GET_PAYMENT_RECORD,
    body,
  };
}

export function getPaymentRecordSuccess(data) {
  return {
    type: GET_PAYMENT_RECORD_SUCCESS,
    data,
  };
}

export function getPaymentRecordFailed(err) {
  return {
    type: GET_PAYMENT_RECORD_FAILED,
    err,
  };
}

export function deletePaymentRecordAct(body) {
  return {
    type: DELETE_PAYMENT_RECORD,
    body,
  };
}

export function deletePaymentRecordSuccess(data) {
  return {
    type: DELETE_PAYMENT_RECORD_SUCCESS,
    data,
  };
}

export function deletePaymentRecordFailed(err) {
  return {
    type: DELETE_PAYMENT_RECORD_FAILED,
    err,
  };
}

export function getCountAct(body) {
  return {
    type: GET_COUNT,
    body,
  };
}

export function getCountSuccess(data) {
  return {
    type: GET_COUNT_SUCCESS,
    data,
  };
}

export function getCountFailed(err) {
  return {
    type: GET_COUNT_FAILED,
    err,
  };
}

export function updateRecord(body) {
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

export function updateRecordFailure(error) {
  return {
    type: UPDATE_RECORD_FAILED,
    error,
  };
}

export function updateRecordAdvance(body) {
  return {
    type: UPDATE_RECORD_ADVANCE,
    body,
  };
}

export function updateRecordAdvanceSuccess(data) {
  return {
    type: UPDATE_RECORD_ADVANCE_SUCCESS,
    data,
  };
}

export function updateRecordAdvanceFailure(error) {
  return {
    type: UPDATE_RECORD_ADVANCE_FAILED,
    error,
  };
}

export function updateRecordReibursement(body) {
  return {
    type: UPDATE_RECORD_REIBURSEMENT,
    body,
  };
}

export function updateRecordReibursementSuccess(data) {
  return {
    type: UPDATE_RECORD_REIBURSEMENT_SUCCESS,
    data,
  };
}

export function updateRecordReibursementFailure(error) {
  return {
    type: UPDATE_RECORD_REIBURSEMENT_FAILED,
    error,
  };
}

export function updateRecordPayment(body) {
  return {
    type: UPDATE_RECORD_PAYMENT,
    body,
  };
}

export function updateRecordPaymentSuccess(data) {
  return {
    type: UPDATE_RECORD_PAYMENT_SUCCESS,
    data,
  };
}

export function updateRecordPaymentFailure(error) {
  return {
    type: UPDATE_RECORD_PAYMENT_FAILED,
    error,
  };
}

export function mergeDataRevenueAndExpenditure(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}
