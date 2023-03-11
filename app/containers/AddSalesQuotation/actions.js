/*
 *
 * AddSalesQuotation actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_STATE,
  GET_SALE,
  GET_SALE_SUCCESS,
  MERGE_DATA,
  POST_SALE,
  PUT_SALE,
  GET_DEFAULT_SUCCESS,
  CLOSE_SALES,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function postSale(data, print) {
  return {
    type: POST_SALE,
    data,
    print
  };
}

export function putSale(id, data, print) {
  return {
    type: PUT_SALE,
    id,
    data,
    print
  };
}

export function getSaleDefaultSuccess(data) {
  return {
    type: GET_DEFAULT_SUCCESS,
    data,
  };
}

export const setState = (name, value) => ({ type: SET_STATE, name, value });
export const mergeData = data => ({ type: MERGE_DATA, data });

export const getSale = (id, addCustomer, customerBoDialog) => ({ type: GET_SALE, id, addCustomer, customerBoDialog });
export const getSaleSuccess = data => ({ type: GET_SALE_SUCCESS, data });

export function closeSales(callback) {
  return {
    type: CLOSE_SALES,
    callback,
  };
}
