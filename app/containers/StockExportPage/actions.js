/*
 *
 * StockExportPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_ITEMS,
  GET_ALL_ITEMS_SUCCESS,
  GET_ALL_ITEMS_FAILED,
  UPDATE_ITEMS,
  UPDATE_ITEMS_SUCCESS,
  UPDATE_ITEMS_FAILED,
  GET_PRODUCT,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILED,
  RESET_NOTIC,
  MERGE_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetNoti() {
  return {
    type: RESET_NOTIC,
  };
}

export function getAllItemsAct(body) {
  return {
    type: GET_ALL_ITEMS,
    body,
  };
}
export function getAllItemsSuccess(data) {
  return {
    type: GET_ALL_ITEMS_SUCCESS,
    data,
  };
}
export function getAllItemsFailed(err) {
  return {
    type: GET_ALL_ITEMS_FAILED,
    err,
  };
}

export function updateItemsAct(body) {
  return {
    type: UPDATE_ITEMS,
    body,
  };
}
export function updateItemsSuccess(data) {
  return {
    type: UPDATE_ITEMS_SUCCESS,
    data,
  };
}
export function updateItemsFailed(err) {
  return {
    type: UPDATE_ITEMS_FAILED,
    err,
  };
}

export function getProductsAct(id) {
  return {
    type: GET_PRODUCT,
    id,
  };
}
export function getProductsSuccess(data) {
  return {
    type: GET_PRODUCT_SUCCESS,
    data,
  };
}
export function getProductsFailed(err) {
  return {
    type: GET_PRODUCT_FAILED,
    err,
  };
}
export function mergeStockExportPage(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
