/*
 *
 * KanbanPlugin actions
 *
 */

import { DEFAULT_ACTION, GET_ITEMS, GET_ITEMS_SUCCESS, GET_ITEMS_FAILED, GET_MORE_ITEMS, GET_MORE_ITEMS_SUCCESS, GET_MORE_ITEMS_FAILED } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getItemsAct(body) {
  return {
    type: GET_ITEMS,
    body,
  };
}

export function getItemsSuccess(data, count) {
  return {
    type: GET_ITEMS_SUCCESS,
    data,
    count
  };
}

export function getItemsFailed(err) {
  return {
    type: GET_ITEMS_FAILED,
    err,
  };
}

export function getMoreItemsAct(body) {
  return {
    type: GET_MORE_ITEMS,
    body,
  };
}

export function getMoreItemsSuccess(data) {
  return {
    type: GET_MORE_ITEMS_SUCCESS,
    data,
  };
}

export function getMoreItemsFailed(err) {
  return {
    type: GET_MORE_ITEMS_FAILED,
    err,
  };
}
