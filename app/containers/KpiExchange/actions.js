/*
 *
 * KpiExchange actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, PUT_EXCHANGE, PUT_EXCHANGE_SUCCESS, GET_CURRENT_EXCHANGE, GET_CURRENT_EXCHANGE_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function putExchange(data) {
  return {
    type: PUT_EXCHANGE,
    data,
  };
}

export function putExchangeSuccess(data) {
  return {
    type: PUT_EXCHANGE_SUCCESS,
    data,
  };
}

export function getCurrentExchange() {
  return {
    type: GET_CURRENT_EXCHANGE,
  };
}

export function getCurrentExchangeSuccess(data) {
  return {
    type: GET_CURRENT_EXCHANGE_SUCCESS,
    data,
  };
}
