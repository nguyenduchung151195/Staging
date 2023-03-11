/*
 *
 * AddContractPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_CONTRACT_BY_TYPE,
  GET_ALL_CONTRACT_BY_TYPE_SUCCESS,
  GET_ALL_CONTRACT_BY_TYPE_FAILED,
  RESET_NOTI,
  GET_CRM_STATUS,
  GET_CRM_STATUS_SUCCESS,
  GET_CRM_STATUS_FAILED,
  GET_ORDER,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILED,
  GET_PRODUCT,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILED,
  SET_EMPTY,
  CREATE_CONTRACT,
  CREATE_CONTRACT_SUCCESS,
  CREATE_CONTRACT_FAILED,
  GET_CONTRACT_BY_ID,
  GET_CONTRACT_BY_ID_SUCCESS,
  GET_CONTRACT_BY_ID_FAILED,
  UPDATE_CONTRACT,
  UPDATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT_FAILED,
  GET_SALE_QUO_BYID,
  GET_SALE_QUO_BYID_SUCCESS,
  GET_SALE_QUO_BYID_FAILED,
  GET_CUSTOMER,
  GET_CUSTOMER_SUCCESS,
  GET_CUSTOMER_FAILED,
  GET_ALL_PRODUCT,
  GET_ALL_PRODUCT_SUCCESS,
  GET_ALL_PRODUCT_FAILED,
  PUT_TASK,
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

export function getAllContractAct(body) {
  return {
    type: GET_ALL_CONTRACT_BY_TYPE,
    body,
  };
}
export function getAllContractSuccess(data) {
  return {
    type: GET_ALL_CONTRACT_BY_TYPE_SUCCESS,
    data,
  };
}
export function getAllContractFailed(err) {
  return {
    type: GET_ALL_CONTRACT_BY_TYPE_FAILED,
    err,
  };
}

export function getCrmStatusAct(body) {
  return {
    type: GET_CRM_STATUS,
    body,
  };
}
export function getCrmStatusSuccess(data) {
  return {
    type: GET_CRM_STATUS_SUCCESS,
    data,
  };
}
export function getCrmStatusFailed(err) {
  return {
    type: GET_CRM_STATUS_FAILED,
    err,
  };
}

export function getOrderAct(body) {
  return {
    type: GET_ORDER,
    body,
  };
}
export function getOrderSuccess(data) {
  return {
    type: GET_ORDER_SUCCESS,
    data,
  };
}
export function getOrderFailed(err) {
  return {
    type: GET_ORDER_FAILED,
    err,
  };
}

export function setEmptyAct(body) {
  return {
    type: SET_EMPTY,
    body,
  };
}
export function getProductAct(body) {
  return {
    type: GET_PRODUCT,
    body,
  };
}
export function getProductSuccess(data) {
  return {
    type: GET_PRODUCT_SUCCESS,
    data,
  };
}
export function getProductFailed(err) {
  return {
    type: GET_PRODUCT_FAILED,
    err,
  };
}

export function createContractAct(body) {
  return {
    type: CREATE_CONTRACT,
    body,
  };
}
export function createContractSuccess(data) {
  return {
    type: CREATE_CONTRACT_SUCCESS,
    data,
  };
}
export function createContractFailed(err) {
  return {
    type: CREATE_CONTRACT_FAILED,
    err,
  };
}

export function putTaskAct(action) {
  return {
    type: PUT_TASK,
    action,
  };
}

export function getContractById(id) {
  return {
    type: GET_CONTRACT_BY_ID,
    id,
  };
}
export function getContractByIdSuccess(data) {
  return {
    type: GET_CONTRACT_BY_ID_SUCCESS,
    data,
  };
}
export function getContractByIdFailed(err) {
  return {
    type: GET_CONTRACT_BY_ID_FAILED,
    err,
  };
}
export function getSaleQuoByIdAct(id) {
  return {
    type: GET_SALE_QUO_BYID,
    id,
  };
}
export function getSaleQuoByIdSuccessAct(data) {
  return {
    type: GET_SALE_QUO_BYID_SUCCESS,
    data,
  };
}
export function getSaleQuoByIdFailedAct(err) {
  return {
    type: GET_SALE_QUO_BYID_FAILED,
    err,
  };
}

export function updateContractAct(body) {
  return {
    type: UPDATE_CONTRACT,
    body,
  };
}
export function updateContractSuccessAct(data) {
  return {
    type: UPDATE_CONTRACT_SUCCESS,
    data,
  };
}
export function updateContractFailedAct(err) {
  return {
    type: UPDATE_CONTRACT_FAILED,
    err,
  };
}

export function getCustomerAct(body) {
  return {
    type: GET_CUSTOMER,
    body,
  };
}

export function getCustomerInfo(body) {
  return {
    type: GET_CUSTOMER,
    body,
  };
}

export function getCustomerSuccess(data) {
  return {
    type: GET_CUSTOMER_SUCCESS,
    data,
  };
}
export function getCustomerFailed(err) {
  return {
    type: GET_CUSTOMER_FAILED,
    err,
  };
}

export function getAllProductAct(body) {
  return {
    type: GET_ALL_PRODUCT,
    body,
  };
}

export function getAllProductSuccess(data) {
  return {
    type: GET_ALL_PRODUCT_SUCCESS,
    data,
  };
}
export function getAllProductFailed(err) {
  return {
    type: GET_ALL_PRODUCT_FAILED,
    err,
  };
}
