/*
 *
 * ImportProduct actions
 *
 */

import { DEFAULT_ACTION, GET_ORDER, GET_ORDER_FAILED, GET_ORDER_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getOrderAct() {
  return {
    type: GET_ORDER,
  };
}
export function getOrderSuccessAct(data) {
  return {
    type: GET_ORDER_SUCCESS,
    data,
  };
}
export function getOrderFailedAct() {
  return {
    type: GET_ORDER_FAILED,
  };
}
