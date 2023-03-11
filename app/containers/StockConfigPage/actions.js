/*
 *
 * StockConfigPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_UNITS,
  GET_ALL_UNITS_SUCCESS,
  GET_ALL_UNITS_FAIL,
  ADD_UNIT,
  ADD_UNIT_FAIL,
  ADD_UNIT_SUCCESS,
  DELETE_UNITS,
  DELETE_UNITS_FAIL,
  DELETE_UNITS_SUCCESS,
  UPDATE_UNIT,
  UPDATE_UNIT_FAIL,
  UPDATE_UNIT_SUCCESS,
  GET_ALL_SERVICES,
  GET_ALL_SERVICES_SUCCESS,
  DELETE_SERVICES,
  DELETE_SERVICES_FAIL,
  DELETE_SERVICES_SUCCESS,
  ADD_SERVICE,
  ADD_SERVICE_FAIL,
  ADD_SERVICE_SUCCESS,
  UPDATE_SERVICE,
  UPDATE_SERVICE_FAIL,
  UPDATE_SERVICE_SUCCESS,
  GET_ALL_CATEGORY,
  GET_ALL_CATEGORY_SUCCESS,
  ADD_CATEGORY,
  ADD_CATEGORY_FAIL,
  ADD_CATEGORY_SUCCESS,
  DELETE_CATEGORY,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_SUCCESS,
  GET_ALL_TAGS,
  GET_ALL_TAGS_SUCCESS,
  GET_ALL_TAGS_FAIL,
  ADD_TAG,
  ADD_TAG_FAIL,
  ADD_TAG_SUCCESS,
  DELETE_TAGS,
  DELETE_TAGS_FAIL,
  DELETE_TAGS_SUCCESS,
  UPDATE_TAG,
  UPDATE_TAG_FAIL,
  UPDATE_TAG_SUCCESS,
  GET_ALL_ASSET_TYPE,
  GET_ALL_ASSET_TYPE_SUCCESS,
  GET_ALL_ASSET_TYPE_FAIL,
  ADD_ASSET_TYPE,
  ADD_ASSET_TYPE_FAIL,
  ADD_ASSET_TYPE_SUCCESS,
  DELETE_ASSET_TYPE,
  DELETE_ASSET_TYPE_FAIL,
  DELETE_ASSET_TYPE_SUCCESS,
  UPDATE_ASSET_TYPE,
  UPDATE_ASSET_TYPE_FAIL,
  UPDATE_ASSET_TYPE_SUCCESS,
  GET_ALL_ORIGIN,
  GET_ALL_ORIGIN_SUCCESS,
  ADD_ORIGIN,
  ADD_ORIGIN_FAIL,
  ADD_ORIGIN_SUCCESS,
  DELETE_ORIGIN,
  DELETE_ORIGIN_FAIL,
  DELETE_ORIGIN_SUCCESS,
  UPDATE_ORIGIN,
  UPDATE_ORIGIN_FAIL,
  UPDATE_ORIGIN_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

// UNIT

export function fetchAllUnitsAction(id) {
  return {
    type: GET_ALL_UNITS,
    id,
  };
}
export function fetchAllUnitsSuccessAction(data, message) {
  return {
    type: GET_ALL_UNITS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllUnitsFailAction(err, message) {
  return {
    type: GET_ALL_UNITS_FAIL,
    err,
    message,
  };
}
export function addUnitAction(body) {
  return {
    type: ADD_UNIT,
    body,
  };
}
export function addUnitSuccessAction(data, message) {
  return {
    type: ADD_UNIT_SUCCESS,
    data,
    message,
  };
}
export function addUnitFailAction(err, message) {
  return {
    type: ADD_UNIT_FAIL,
    err,
    message,
  };
}
export function deleteUnitsAction(body) {
  return {
    type: DELETE_UNITS,
    body,
  };
}
export function deleteUnitsSuccessAction(data, message) {
  return {
    type: DELETE_UNITS_SUCCESS,
    data,
    message,
  };
}
export function deleteUnitsFailAction(err, message) {
  return {
    type: DELETE_UNITS_FAIL,
    err,
    message,
  };
}
export function updateUnitsAction(body) {
  return {
    type: UPDATE_UNIT,
    body,
  };
}
export function updateUnitsSuccessAction(data, message) {
  return {
    type: UPDATE_UNIT_SUCCESS,
    data,
    message,
  };
}
export function updateUnitsFailAction(err, message) {
  return {
    type: UPDATE_UNIT_FAIL,
    err,
    message,
  };
}
// Dich vụ
export function getAllServicesAction() {
  return {
    type: GET_ALL_SERVICES,
  };
}
export function getAllServicesSucsessAction(data) {
  return {
    type: GET_ALL_SERVICES_SUCCESS,
    data,
  };
}
export function addServiceAction(body) {
  return {
    type: ADD_SERVICE,
    body,
  };
}
export function addServiceSuccessAction(data, message) {
  return {
    type: ADD_SERVICE_SUCCESS,
    data,
    message,
  };
}
export function addServiceFailAction(err, message) {
  return {
    type: ADD_SERVICE_FAIL,
    err,
    message,
  };
}
export function updateServiceAction(body) {
  return {
    type: UPDATE_SERVICE,
    body,
  };
}
export function updateServiceSuccessAction(data, message) {
  return {
    type: UPDATE_SERVICE_SUCCESS,
    data,
    message,
  };
}
export function updateServiceFailAction(err, message) {
  return {
    type: UPDATE_SERVICE_FAIL,
    err,
    message,
  };
}
export function deleteServicesAction(ids) {
  return {
    type: DELETE_SERVICES,
    ids,
  };
}
export function deleteServicesSucsessAction(data, message) {
  return {
    type: DELETE_SERVICES_SUCCESS,
    data,
    message,
  };
}
export function deleteServicesFailAction(data, message) {
  return {
    type: DELETE_SERVICES_FAIL,
    data,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
// Danh mục
export function fetchAllCategoryAction(id) {
  return {
    type: GET_ALL_CATEGORY,
    id,
  };
}
export function fetchAllCategorySuccessAction(data) {
  return {
    type: GET_ALL_CATEGORY_SUCCESS,
    data,
  };
}
// export function fetchAllCategoryFailAction() {
//   return {
//     type: GET_ALL_CATEGORY_FAIL,
//   };
// }
export function addCategoryAction(body) {
  return {
    type: ADD_CATEGORY,
    body,
  };
}
export function addCategorySuccessAction(message) {
  return {
    type: ADD_CATEGORY_SUCCESS,
    // data,
    message,
  };
}
export function addCategoryFailAction(err, message) {
  return {
    type: ADD_CATEGORY_FAIL,
    err,
    message,
  };
}
export function deleteCategoryAction(body) {
  return {
    type: DELETE_CATEGORY,
    body,
  };
}
export function deleteCategorySuccessAction(message) {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    message,
  };
}
export function deleteCategoryFailAction(err) {
  return {
    type: DELETE_CATEGORY_FAIL,
    err,
  };
}
export function updateCategoryAction(body) {
  return {
    type: UPDATE_CATEGORY,
    body,
  };
}
export function updateCategorySuccessAction(data, message) {
  return {
    type: UPDATE_CATEGORY_SUCCESS,
    data,
    message,
  };
}
export function updateCategoryFailAction(err, message) {
  return {
    type: UPDATE_CATEGORY_FAIL,
    err,
    message,
  };
}
// TAG
export function fetchAllTagsAction(id) {
  return {
    type: GET_ALL_TAGS,
    id,
  };
}
export function fetchAllTagsSuccessAction(data, message) {
  return {
    type: GET_ALL_TAGS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllTagsFailAction(err, message) {
  return {
    type: GET_ALL_TAGS_FAIL,
    err,
    message,
  };
}
export function addTagAction(body) {
  return {
    type: ADD_TAG,
    body,
  };
}
export function addTagSuccessAction(message) {
  return {
    type: ADD_TAG_SUCCESS,

    message,
  };
}
export function addTagFailAction(err, message) {
  return {
    type: ADD_TAG_FAIL,
    err,
    message,
  };
}
export function deleteTagsAction(body) {
  return {
    type: DELETE_TAGS,
    body,
  };
}
export function deleteTagsSuccessAction(message) {
  return {
    type: DELETE_TAGS_SUCCESS,

    message,
  };
}
export function deleteTagsFailAction(err, message) {
  return {
    type: DELETE_TAGS_FAIL,
    err,
    message,
  };
}
export function updateTagsAction(body) {
  return {
    type: UPDATE_TAG,
    body,
  };
}
export function updateTagsSuccessAction(message) {
  return {
    type: UPDATE_TAG_SUCCESS,
    message,
  };
}
export function updateTagsFailAction(err, message) {
  return {
    type: UPDATE_TAG_FAIL,
    err,
    message,
  };
}

// Asset Type
export function fetchAllAssetTypeAction(id) {
  return {
    type: GET_ALL_ASSET_TYPE,
    id,
  };
}
export function fetchAllAssetTypeSuccessAction(data, message) {
  return {
    type: GET_ALL_ASSET_TYPE_SUCCESS,
    data,
    message,
  };
}
export function fetchAllAssetTypeFailAction(err, message) {
  return {
    type: GET_ALL_ASSET_TYPE_FAIL,
    err,
    message,
  };
}
export function addAssetTypeAction(body) {
  return {
    type: ADD_ASSET_TYPE,
    body,
  };
}
export function addAssetTypeSuccessAction(message) {
  return {
    type: ADD_ASSET_TYPE_SUCCESS,

    message,
  };
}
export function addAssetTypeFailAction(err, message) {
  return {
    type: ADD_ASSET_TYPE_FAIL,
    err,
    message,
  };
}
export function deleteAssetTypeAction(body) {
  return {
    type: DELETE_ASSET_TYPE,
    body,
  };
}
export function deleteAssetTypeSuccessAction(message) {
  return {
    type: DELETE_ASSET_TYPE_SUCCESS,

    message,
  };
}
export function deleteAssetTypeFailAction(err, message) {
  return {
    type: DELETE_ASSET_TYPE_FAIL,
    err,
    message,
  };
}
export function updateAssetTypeAction(body) {
  return {
    type: UPDATE_ASSET_TYPE,
    body,
  };
}
export function updateAssetTypeSuccessAction(message) {
  return {
    type: UPDATE_ASSET_TYPE_SUCCESS,
    message,
  };
}
export function updateAssetTypeFailAction(err, message) {
  return {
    type: UPDATE_ASSET_TYPE_FAIL,
    err,
    message,
  };
}

// ORIGIM

export function fetchAllOriginAction(id) {
  return {
    type: GET_ALL_ORIGIN,
    id,
  };
}
export function fetchAllOriginSuccessAction(data) {
  return {
    type: GET_ALL_ORIGIN_SUCCESS,
    data,
  };
}
// export function fetchAllOriginFailAction() {
//   return {
//     type: GET_ALL_ORIGIN_FAIL,
//   };
// }
export function addOriginAction(body) {
  return {
    type: ADD_ORIGIN,
    body,
  };
}
export function addOriginSuccessAction(message) {
  return {
    type: ADD_ORIGIN_SUCCESS,
    // data,
    message,
  };
}
export function addOriginFailAction(err, message) {
  return {
    type: ADD_ORIGIN_FAIL,
    err,
    message,
  };
}
export function deleteOriginAction(body) {
  return {
    type: DELETE_ORIGIN,
    body,
  };
}
export function deleteOriginSuccessAction(message) {
  return {
    type: DELETE_ORIGIN_SUCCESS,
    message,
  };
}
export function deleteOriginFailAction(err) {
  return {
    type: DELETE_ORIGIN_FAIL,
    err,
  };
}
export function updateOriginAction(body) {
  return {
    type: UPDATE_ORIGIN,
    body,
  };
}
export function updateOriginSuccessAction(data, message) {
  return {
    type: UPDATE_ORIGIN_SUCCESS,
    data,
    message,
  };
}
export function updateOriginFailAction(err, message) {
  return {
    type: UPDATE_ORIGIN_FAIL,
    err,
    message,
  };
}
