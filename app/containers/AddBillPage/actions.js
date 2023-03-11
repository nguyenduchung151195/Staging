/*
 *
 * AddBillPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_CONTRACT,
  GET_ALL_CONTRACT_SUCCESS,
  GET_ALL_CONTRACT_FAILED,
  GET_ALL_SALE_QUO,
  GET_ALL_SALE_QUO_SUCCESS,
  GET_ALL_SALE_QUO_FAILED,
  CREATE_BILL,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAILED,
  RESET_NOTI,
  GET_BILL_BY_ID,
  GET_BILL_BY_ID_SUCCESS,
  GET_BILL_BY_ID_FAILED,
  UPDATE_BILL,
  UPDATE_BILL_SUCCESS,
  UPDATE_BILL_FAILED,
  GET_ALL_PO,
  GET_ALL_PO_SUCCESS,
  GET_ALL_PO_FAILED,
  PUT_DATA_BILL,
  PUT_DATA_BILL_FAILURE,
  PUT_DATA_BILL_SUCCESS
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

// get contract
export function getAllContractAct(body) {
  return {
    type: GET_ALL_CONTRACT,
    body,
  };
}
export function getAllContractSuccess(data) {
  return {
    type: GET_ALL_CONTRACT_SUCCESS,
    data,
  };
}
export function getAllContractFailed(err) {
  return {
    type: GET_ALL_CONTRACT_FAILED,
    err,
  };
}

// get sale quotations
export function getAllSaleQuoAct(body) {
  return {
    type: GET_ALL_SALE_QUO,
    body,
  };
}
export function getAllSaleQuoSuccess(data) {
  return {
    type: GET_ALL_SALE_QUO_SUCCESS,
    data,
  };
}
export function getAllSaleQuoFailed(err) {
  return {
    type: GET_ALL_SALE_QUO_FAILED,
    err,
  };
}

// get all PO
export function getAllPOAct(body) {
  return {
    type: GET_ALL_PO,
    body,
  };
}
export function getAllPOSuccess(data) {
  return {
    type: GET_ALL_PO_SUCCESS,
    data,
  };
}
export function getAllPOFailed(err) {
  return {
    type: GET_ALL_PO_FAILED,
    err,
  };
}

// create a bill
export function createBillAct(body) {
  return {
    type: CREATE_BILL,
    body,
  };
}
export function createBillSuccess(data) {
  return {
    type: CREATE_BILL_SUCCESS,
    data,
  };
}
export function createBillFailed(err) {
  return {
    type: CREATE_BILL_FAILED,
    err,
  };
}

// create a bill by id
export function getBillByIdAct(body) {
  return {
    type: GET_BILL_BY_ID,
    body,
  };
}
export function getBillByIdSuccess(data) {
  return {
    type: GET_BILL_BY_ID_SUCCESS,
    data,
  };
}
export function getBillByIdFailed(err) {
  return {
    type: GET_BILL_BY_ID_FAILED,
    err,
  };
}

// update a bill
export function updateBillAct(body) {
  return {
    type: UPDATE_BILL,
    body,
  };
}
export function updateBillSuccess(data) {
  return {
    type: UPDATE_BILL_SUCCESS,
    data,
  };
}
export function updateBillFailed(err) {
  return {
    type: UPDATE_BILL_FAILED,
    err,
  };
}

export function putDataBill(data, id, datas, editMode) {
  return {
    type: PUT_DATA_BILL,
    data,
    id,
    datas, 
    editMode
  };
}

export function putDataBillSuccess(data) {
  return {
    type: PUT_DATA_BILL_SUCCESS,
    data,
  };
}

export function putDataBillFailure(error) {
  return {
    type: PUT_DATA_BILL_FAILURE,
    error,
  };
}

