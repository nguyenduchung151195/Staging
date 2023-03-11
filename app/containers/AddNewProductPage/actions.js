/*
 *
 * AddNewProductPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_TAGS,
  GET_TAGS_SUCCESS,
  GET_TAGS_FAILED,
  GET_SUPPLIER,
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_FAILED,
  GET_PROPERTIES_SET,
  GET_PROPERTIES_SET_SUCCESS,
  GET_CALCULATE_UNIT,
  GET_CALCULATE_UNIT_SUCCESS,
  GET_CALCULATE_UNIT_FAILED,
  GET_PROPERTIES_SET_FAILED,
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_AGENCY_LEVEL,
  GET_AGENCY_LEVEL_SUCCESS,
  GET_AGENCY_LEVEL_FAILED,
  GET_DEPARTMENT,
  GET_DEPARTMENT_SUCCESS,
  GET_DEPARTMENT_FAILED,
  GET_ORIGIN,
  GET_ORIGIN_SUCCESS,
  GET_ORIGIN_FAILED,
  ADD_NEW_PRODUCT,
  ADD_NEW_PRODUCT_SUCCESS,
  ADD_NEW_PRODUCT_FAILED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetNoti() {
  return {
    type: RESET_NOTI,
  };
}
// get tags
export function getTagsAct(body) {
  return {
    type: GET_TAGS,
    body,
  };
}
export function getTagsSuccess(data) {
  return {
    type: GET_TAGS_SUCCESS,
    data,
  };
}
export function getTagsFailed(err) {
  return {
    type: GET_TAGS_FAILED,
    err,
  };
}

// get supplier
export function getSuppliersAct(body) {
  return {
    type: GET_SUPPLIER,
    body,
  };
}
export function getSuppliersSuccess(data) {
  return {
    type: GET_SUPPLIER_SUCCESS,
    data,
  };
}
export function getSuppliersFailed(err) {
  return {
    type: GET_SUPPLIER_FAILED,
    err,
  };
}

// get properties set
export function getPropertiesSetAct(body) {
  return {
    type: GET_PROPERTIES_SET,
    body,
  };
}
export function getPropertiesSetSuccess(data) {
  return {
    type: GET_PROPERTIES_SET_SUCCESS,
    data,
  };
}
export function getPropertiesSetFailed(err) {
  return {
    type: GET_PROPERTIES_SET_FAILED,
    err,
  };
}

// get calculate unit
export function getCalculateUnitAct(body) {
  return {
    type: GET_CALCULATE_UNIT,
    body,
  };
}
export function getCalculateUnitSuccess(data) {
  return {
    type: GET_CALCULATE_UNIT_SUCCESS,
    data,
  };
}
export function getCalculateUnitFailed(err) {
  return {
    type: GET_CALCULATE_UNIT_FAILED,
    err,
  };
}

// get calculate unit
export function getCategoryAct(body) {
  return {
    type: GET_CATEGORY,
    body,
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

// get agency level
export function getAgencyLevelAct(body) {
  return {
    type: GET_AGENCY_LEVEL,
    body,
  };
}
export function getAgencyLevelSuccess(data) {
  return {
    type: GET_AGENCY_LEVEL_SUCCESS,
    data,
  };
}
export function getAgencyLevelFailed(err) {
  return {
    type: GET_AGENCY_LEVEL_FAILED,
    err,
  };
}

// get department
export function getDepartmentAct(body) {
  return {
    type: GET_DEPARTMENT,
    body,
  };
}
export function getDepartmentSuccess(data) {
  return {
    type: GET_DEPARTMENT_SUCCESS,
    data,
  };
}
export function getDepartmentFailed(err) {
  return {
    type: GET_DEPARTMENT_FAILED,
    err,
  };
}

// get origin
export function getOriginAct(body) {
  return {
    type: GET_ORIGIN,
    body,
  };
}
export function getOriginSuccess(data) {
  return {
    type: GET_ORIGIN_SUCCESS,
    data,
  };
}
export function getOriginFailed(err) {
  return {
    type: GET_ORIGIN_FAILED,
    err,
  };
}

// add new product
export function addNewProductAct(body) {
  return {
    type: ADD_NEW_PRODUCT,
    body,
  };
}
export function addNewProductSuccess(data) {
  return {
    type: ADD_NEW_PRODUCT_SUCCESS,
    data,
  };
}
export function addNewProductFailed(err) {
  return {
    type: ADD_NEW_PRODUCT_FAILED,
    err,
  };
}
