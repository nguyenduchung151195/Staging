/*
 *
 * AddStockManager actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_STOCK,
  GET_ALL_STOCK_SUCCESS,
  GET_ALL_STOCK_FAILED,
  GET_ALL_CATEGORY,
  GET_ALL_CATEGORY_SUCCESS,
  GET_ALL_CATEGORY_FAILED,
  GET_ALL_INVENTORY,
  GET_ALL_INVENTORY_SUCCESS,
  GET_ALL_INVENTORY_FAILED,
  GET_ALL_TAGS,
  GET_ALL_TAGS_SUCCESS,
  GET_ALL_TAGS_FAILED,
  MERGE_DATA,
} from './constants';

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

export function getAllStockAct() {
  return {
    type: GET_ALL_STOCK,
  };
}
export function getAllStockSuccess(data) {
  return {
    type: GET_ALL_STOCK_SUCCESS,
    data,
  };
}
export function getAllStockFailed(err) {
  return {
    type: GET_ALL_STOCK_FAILED,
    err,
  };
}

export function getAllCategoryAct() {
  return {
    type: GET_ALL_CATEGORY,
  };
}
export function getAllCategorySuccess(data) {
  return {
    type: GET_ALL_CATEGORY_SUCCESS,
    data,
  };
}
export function getAllCategoryFailed(err) {
  return {
    type: GET_ALL_CATEGORY_FAILED,
    err,
  };
}

export function getAllInventoryAct() {
  return {
    type: GET_ALL_INVENTORY,
  };
}
export function getAllInventorySuccess(data) {
  return {
    type: GET_ALL_INVENTORY_SUCCESS,
    data,
  };
}
export function getAllInventoryFailed(err) {
  return {
    type: GET_ALL_INVENTORY_FAILED,
    err,
  };
}

export function getAllTagsAct() {
  return {
    type: GET_ALL_TAGS,
  };
}
export function getAllTagsSuccess(data) {
  return {
    type: GET_ALL_TAGS_SUCCESS,
    data,
  };
}
export function getAllTagsFailed(err) {
  return {
    type: GET_ALL_TAGS_FAILED,
    err,
  };
}
