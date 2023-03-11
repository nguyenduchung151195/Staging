/*
 *
 * StockPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_PRODUCT,
  GET_ALL_PRODUCT_SUCCESS,
  GET_ALL_PRODUCT_FAILED,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILED,
  RESET_NOTI,
  GET_ALL_STOCK,
  GGET_ALL_STOCK_SUCCESS,
  GET_ALL_STOCK_FAILED,
  GET_PRODUCT_BY_STOCK,
  GET_PRODUCT_BY_STOCK_SUCCESS,
  GET_PRODUCT_BY_STOCK_FAILED,
  EDIT_PRODUCT,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILED,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_CATEGORY,
  GET_ALL_UPPER_LIMIT_PRODUCT,
  GET_ALL_UPPER_LIMIT_PRODUCT_SUCCESS,
  GET_ALL_UPPER_LIMIT_PRODUCT_FAILED,
  GET_ALL_LOWER_LIMIT_PRODUCT,
  GET_ALL_LOWER_LIMIT_PRODUCT_SUCCESS,
  GET_ALL_LOWER_LIMIT_PRODUCT_FAILED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

// get all product
export function getAllProductAct(body) {
  return {
    type: GET_ALL_PRODUCT,
    body,
  };
}

export function resetNoti(body) {
  return {
    type: RESET_NOTI,
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

export function getAllStockAct(body) {
  return {
    type: GET_ALL_STOCK,
    body,
  };
}

export function getAllStockSuccess(data) {
  return {
    type: GGET_ALL_STOCK_SUCCESS,
    data,
  };
}
export function getAllStockFailed(err) {
  return {
    type: GET_ALL_STOCK_FAILED,
    err,
  };
}

// delete product
export function deleteProductAct(body) {
  return {
    type: DELETE_PRODUCT,
    body,
  };
}
export function deleteProductSuccess(data) {
  return {
    type: DELETE_PRODUCT_SUCCESS,
    data,
  };
}
export function deleteProductFailed(err) {
  return {
    type: DELETE_PRODUCT_FAILED,
    err,
  };
}

export function getAllProductByStockAct(body) {
  return {
    type: GET_PRODUCT_BY_STOCK,
    body,
  };
}

export function getAllProductByStockSuccess(data) {
  return {
    type: GET_PRODUCT_BY_STOCK_SUCCESS,
    data,
  };
}
export function getAllProductByStockFailed(err) {
  return {
    type: GET_PRODUCT_BY_STOCK_FAILED,
    err,
  };
}

// edit product
export function editProductAct(body, id) {
  return {
    type: EDIT_PRODUCT,
    body,
    id,
  };
}
export function editProductSuccess(data) {
  return {
    type: EDIT_PRODUCT_SUCCESS,
    data,
  };
}
export function editProductFailed(err) {
  return {
    type: EDIT_PRODUCT_FAILED,
    err,
  };
}

export function getCategory() {
  return {
    type: GET_CATEGORY,
  };
}

export function getCategorySuccess(data) {
  return {
    type: GET_CATEGORY_SUCCESS,
    data,
  };
}

export function getCategoryFailed(err) {
  return {
    type: GET_CATEGORY_FAILED,
    err,
  };
}

export function getAllUpperLimitProduct(data) {
  return {
    type: GET_ALL_UPPER_LIMIT_PRODUCT,
    data,
  };
}

export function getAllUpperLimitProductSuccess(data) {
  return {
    type: GET_ALL_UPPER_LIMIT_PRODUCT_SUCCESS,
    data,
  };
}
export function getAllUpperLimitProductFailed(err) {
  return {
    type: GET_ALL_UPPER_LIMIT_PRODUCT_FAILED,
    err,
  };
}

export function getAllLowerLimitProduct(data) {
  return {
    type: GET_ALL_LOWER_LIMIT_PRODUCT,
    data,
  };
}

export function getAllLowerLimitProductSuccess(data) {
  return {
    type: GET_ALL_LOWER_LIMIT_PRODUCT_SUCCESS,
    data,
  };
}
export function getAllLowerLimitProductFailed(err) {
  return {
    type: GET_ALL_LOWER_LIMIT_PRODUCT_FAILED,
    err,
  };
}