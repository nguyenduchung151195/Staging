/*
 *
 * TradingReport actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ITEM_BY_RANGE,
  GET_ITEM_BY_RANGE_SUCCESS,
  GET_ITEM_BY_RANGE_FAILED,
  GET_LOGS_BY_RANGE,
  GET_LOGS_BY_RANGE_SUCCESS,
  GET_LOGS_BY_RANGE_FAILED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getItemByRangeAct(body) {
  return {
    type: GET_ITEM_BY_RANGE,
    body,
  };
}
export function getItemByRangeSuccess(data) {
  return {
    type: GET_ITEM_BY_RANGE_SUCCESS,
    data,
  };
}
export function getItemByRangeFailed() {
  return {
    type: GET_ITEM_BY_RANGE_FAILED,
  };
}

export function getLogsByRangeAct(body) {
  return {
    type: GET_LOGS_BY_RANGE,
    body,
  };
}
export function getLogsByRangeSuccess(data) {
  return {
    type: GET_LOGS_BY_RANGE_SUCCESS,
    data,
  };
}
export function getLogsByRangeFailed() {
  return {
    type: GET_LOGS_BY_RANGE_FAILED,
  };
}
