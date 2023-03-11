/*
 *
 * AddSupplierPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SUPPLIER,
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_FAILED,
  POST_SUPPLIER,
  POST_SUPPLIER_SUCCESS,
  POST_SUPPLIER_FAILED,
  PUT_SUPPLIER,
  PUT_SUPPLIER_SUCCESS,
  PUT_SUPPLIER_FAILED,
  SNACKBAR,
  UPLOAD_FAILED,
  CHANGE_NAME,
  CHANGE_IMAGE,
  DEFAULT_STATE,
  GET_DATA,
  GET_DATA_SUCCESS,
  MERGE_DATA,
} from './constants';
export const defaultAction = () => ({ type: DEFAULT_ACTION });
export const getSupplier = id => ({ type: GET_SUPPLIER, id });
export const getSupplierSuccess = data => ({ type: GET_SUPPLIER_SUCCESS, data });
export const getSupplierFailed = () => ({ type: GET_SUPPLIER_FAILED });
export const postSupplier = data => ({ type: POST_SUPPLIER, data });
export const postSupplierSuccess = () => ({ type: POST_SUPPLIER_SUCCESS });
export const postSupplierFailed = () => ({ type: POST_SUPPLIER_FAILED });
export const putSupplier = (id, data) => ({ type: PUT_SUPPLIER, id, data });
export const putSupplierSuccess = data => ({ type: PUT_SUPPLIER_SUCCESS, data });
export const putSupplierFailed = () => ({ type: PUT_SUPPLIER_FAILED });
export const snackbar = () => ({ type: SNACKBAR });
export const uploadFailed = () => ({ type: UPLOAD_FAILED });
export const changeValue = data => ({ type: CHANGE_NAME, data });
export const changeImage = data => ({ type: CHANGE_IMAGE, data });
export const setDefaultState = () => ({ type: DEFAULT_STATE });
export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(attributes, listAtt, resource) {
  return {
    type: GET_DATA_SUCCESS,
    attributes,
    listAtt,
    resource,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
