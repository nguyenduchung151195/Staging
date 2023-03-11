/*
 *
 * AddImportProduct actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CRM_SOURCE,
  GET_CRM_SOURCE_SUCCESS,
  GET_CRM_SOURCE_FAILED,
  CREATE_NEW_ORDER,
  CREATE_NEW_ORDER_SUCCESS,
  CREATE_NEW_ORDER_FAILED,
  GET_ORDER_UPDATE_SUCCESS,
  GET_ORDER_UPDATE_FAILED,
  GET_ORDER_UPDATE,
  GET_PRODUCT_BY_SUPPLIER,
  GET_PRODUCT_BY_SUPPLIER_SUCCESS,
  GET_PRODUCT_BY_SUPPLIER_FAILED,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_ID_SUCCESS,
  GET_PRODUCT_BY_ID_FAILED,
  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILED,
  RESET_NOTI,
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
export function getCRMSourceAct() {
  return {
    type: GET_CRM_SOURCE,
  };
}
export function getCRMSourceSuccessAct(data) {
  return {
    type: GET_CRM_SOURCE_SUCCESS,
    data,
  };
}
export function getCRMSourceFailedAct(err) {
  return {
    type: GET_CRM_SOURCE_FAILED,
    err,
  };
}
export function createOrderAct(body) {
  return {
    type: CREATE_NEW_ORDER,
    body,
  };
}
export function createOrderSuccessAct(data) {
  return {
    type: CREATE_NEW_ORDER_SUCCESS,
    data,
  };
}
export function createOrderFailedAct(err) {
  return {
    type: CREATE_NEW_ORDER_FAILED,
    err,
  };
}
export function getOrderUpdateAct(id) {
  return {
    type: GET_ORDER_UPDATE,
    id,
  };
}
export function getOrderUpdateSuccessAct(data) {
  return {
    type: GET_ORDER_UPDATE_SUCCESS,
    data,
  };
}
export function getOrderUpdateFailed(err) {
  return {
    type: GET_ORDER_UPDATE_FAILED,
    err,
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

export function updateOrderAct(body) {
  return {
    type: UPDATE_ORDER,
    body,
  };
}
export function updateOrderSuccess(data) {
  return {
    type: UPDATE_ORDER_SUCCESS,
    data,
  };
}
export function updateOrderFailed(err) {
  return {
    type: UPDATE_ORDER_FAILED,
    err,
  };
}
