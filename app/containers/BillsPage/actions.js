/*
 *
 * BillsPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_BILLS,
  GET_ALL_BILLS_SUCCESS,
  GET_ALL_BILLS_FAILED,
  UPDATE_BILL_STATUS,
  UPDATE_BILL_STATUS_SUCCESS,
  UPDATE_BILL_STATUS_FAILED,
  DELETE_BILLS,
  DELETE_BILLS_SUCCESS,
  DELETE_BILLS_FAILED,
  RESET_NOTI,
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
export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}

// get all bills
export function getAllBillsAct(query) {
  return {
    type: GET_ALL_BILLS,
    query,
  };
}
export function getAllBillsSuccess(data) {
  return {
    type: GET_ALL_BILLS_SUCCESS,
    data,
  };
}
export function getAllBillsFailed(err) {
  return {
    type: GET_ALL_BILLS_FAILED,
    err,
  };
}

// update bill
export function updateBillStatusAct(body) {
  return {
    type: UPDATE_BILL_STATUS,
    body,
  };
}
export function updateBillStatusSuccess(data) {
  return {
    type: UPDATE_BILL_STATUS_SUCCESS,
    data,
  };
}
export function updateBillStatusFailed(err) {
  return {
    type: UPDATE_BILL_STATUS_FAILED,
    err,
  };
}

// delete bills
export function deleteBillsAct(body) {
  return {
    type: DELETE_BILLS,
    body,
  };
}
export function deleteBillsSuccess(data) {
  return {
    type: DELETE_BILLS_SUCCESS,
    data,
  };
}
export function deleteBillsFailed(err) {
  return {
    type: DELETE_BILLS_FAILED,
    err,
  };
}
