/*
 *
 * AddExportStockPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_PRODUCT_BY_SUPPLIER,
  GET_PRODUCT_BY_SUPPLIER_FAILED,
  GET_PRODUCT_BY_SUPPLIER_SUCCESS,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_ID_FAILED,
  GET_PRODUCT_BY_ID_SUCCESS,
  CREATE_NEW_ORDER,
  CREATE_NEW_ORDER_SUCCESS,
  CREATE_NEW_ORDER_FAILED,
  GET_ORDER_BY_ID,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILED,
  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILED,
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
export function getProductBySupplierAct(body, params) {
  return {
    type: GET_PRODUCT_BY_SUPPLIER,
    body,
    params,
  };
}
export function getProductBySupplierSuccessAct(data) {
  return {
    type: GET_PRODUCT_BY_SUPPLIER_SUCCESS,
    data,
  };
}
export function getProductBySupplierFailed(err) {
  return {
    type: GET_PRODUCT_BY_SUPPLIER_FAILED,
    err,
  };
}

export function getProductByIdAct(id) {
  return {
    type: GET_PRODUCT_BY_ID,
    id,
  };
}
export function getProductByIdSuccessAct(data) {
  return {
    type: GET_PRODUCT_BY_ID_SUCCESS,
    data,
  };
}
export function getProductByIdFailed(err) {
  return {
    type: GET_PRODUCT_BY_ID_FAILED,
    err,
  };
}

export function createExportRecordAct(body) {
  return {
    type: CREATE_NEW_ORDER,
    body,
  };
}
export function createExportRecordSuccess(data) {
  return {
    type: CREATE_NEW_ORDER_SUCCESS,
    data,
  };
}
export function createExportRecordFailed(err) {
  return {
    type: CREATE_NEW_ORDER_FAILED,
    err,
  };
}

export function getOrderByIdAct(body) {
  return {
    type: GET_ORDER_BY_ID,
    body,
  };
}
export function getOrderByIdSuccess(data) {
  return {
    type: GET_ORDER_BY_ID_SUCCESS,
    data,
  };
}
export function getOrderByIdFailed(err) {
  return {
    type: GET_ORDER_BY_ID_FAILED,
    err,
  };
}

export function updateOrderExportAct(body) {
  return {
    type: UPDATE_ORDER,
    body,
  };
}
export function updateOrderExportSuccess(data) {
  return {
    type: UPDATE_ORDER_SUCCESS,
    data,
  };
}
export function updateOrderExportFailed(err) {
  return {
    type: UPDATE_ORDER_FAILED,
    err,
  };
}
