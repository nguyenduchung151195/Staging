/*
 *
 * DeliveryPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_TASK,
  GET_TASK_SUCCESS,
  GET_TASK_FAILED,
  GET_CONTRACT_AC,
  GET_CONTRACT_SUCCESS,
  GET_CONTRACT_FAILED,
  CHANGE_TAB,
  GET_ITEM_DELIVERY,
  GET_ITEM_DELIVERY_SUCCESS,
  GET_ITEM_DELIVERY_FAILED,
  UPDATE_DELIVERY,
  UPDATE_DELIVERY_SUCCESS,
  UPDATE_DELIVERY_FAILED,
  RESET,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function changeTabAct(val) {
  return {
    type: CHANGE_TAB,
    val,
  };
}
export function reset() {
  return {
    type: RESET,
  };
}

export function getTaskAct(body) {
  return {
    type: GET_TASK,
    body,
  };
}
export function getTaskSuccess(data) {
  return {
    type: GET_TASK_SUCCESS,
    data,
  };
}
export function getTaskFailed(err) {
  return {
    type: GET_TASK_FAILED,
    err,
  };
}

export function getContractAct(body) {
  return {
    type: GET_CONTRACT_AC,
    body,
  };
}
export function getContractSuccess(data) {
  return {
    type: GET_CONTRACT_SUCCESS,
    data,
  };
}
export function getContractFailed(err) {
  return {
    type: GET_CONTRACT_FAILED,
    err,
  };
}

export function getItemDeliveryAct(body) {
  return {
    type: GET_ITEM_DELIVERY,
    body,
  };
}
export function getItemDeliverySuccess(data) {
  return {
    type: GET_ITEM_DELIVERY_SUCCESS,
    data,
  };
}
export function getItemDeliveryFailed(err) {
  return {
    type: GET_ITEM_DELIVERY_FAILED,
    err,
  };
}

export function updateItemDeliveryAct(body) {
  return {
    type: UPDATE_DELIVERY,
    body,
  };
}
export function updateItemDeliverySuccess(data) {
  return {
    type: UPDATE_DELIVERY_SUCCESS,
    data,
  };
}
export function updateItemDeliveryFailed(err) {
  return {
    type: UPDATE_DELIVERY_FAILED,
    err,
  };
}
