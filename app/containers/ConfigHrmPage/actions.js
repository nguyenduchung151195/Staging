/*
 *
 * ConfigHrmPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_STATUS,
  GET_ALL_STATUS_SUCCESS,
  ADD_STATUS,
  ADD_STATUS_SUCCESS,
  ADD_HRM_STATUS,
  ADD_HRM_STATUS_SUCCESS,
  DELETE_STATUS,
  GET_ALL_CATEGORY,
  DELETE_STATUS_SUCCESS,
  UPDATE_STATUS,
  UPDATE_STATUS_INDEX,
  UPDATE_STATUS_INDEX_SUCCESS,
  GET_ALL_CATEGORY_SUCCESS,
  UPDATE_STATUS_SUCCESS,
  GET_DEFAULT,
  ADD_CATEGORY,
  ADD_CATEGORY_SUCCESS,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY,
  MERGE_DATA,
  RESET_ALL_CATEGORY,
  RESET_ALL_CATEGORY_SUCCESS,
  RESET_ALL_CATEGORY_FAILURE,
  RESET_ALL_STATUS,
  RESET_ALL_STATUS_SUCCESS,
  RESET_ALL_STATUS_FAILURE,
  EDIT_HRM_STATUS,
  EDIT_HRM_STATUS_SUCCESS,
  DELETE_HRM_STATUS,
  DELETE_HRM_STATUS_SUCCESS,
  ADD_HRM_CATEGORY,
  ADD_HRM_CATEGORY_SUCCESS,
  EDIT_HRM_CATEGORY,
  EDIT_HRM_CATEGORY_SUCCESS,
  DELETE_HRM_CATEGORY,
  DELETE_HRM_CATEGORY_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function fetchAllStatusAction(id) {
  return {
    type: GET_ALL_STATUS,
    id,
  };
}
export function fetchAllStatusSuccessAction(data) {
  return {
    type: GET_ALL_STATUS_SUCCESS,
    data,
  };
}
export function addStatusAction(title, id) {
  return {
    type: ADD_STATUS,
    title,
    id,
  };
}
export function addStatusSuccessAction(data) {
  return {
    type: ADD_STATUS_SUCCESS,
    data,
  };
}

export function deleteStatusAction(statusId, id) {
  return {
    type: DELETE_STATUS,
    statusId,
    id,
  };
}
export function deleteStatusSuccessAction(data) {
  return {
    type: DELETE_STATUS_SUCCESS,
    data,
  };
}

export function updateStatusAction(body, id) {
  return {
    type: UPDATE_STATUS,
    body,
    id,
  };
}
export function updateStatusSuccessAction(data) {
  return {
    type: UPDATE_STATUS_SUCCESS,
    data,
  };
}

export function updateStatusIndexAction(body, id) {
  return {
    type: UPDATE_STATUS_INDEX,
    body,
    id,
  };
}
export function updateStatusIndexSuccessAction(data) {
  return {
    type: UPDATE_STATUS_INDEX_SUCCESS,
    data,
  };
}
export function addHRMStatusAction(title) {
  return {
    type: ADD_HRM_STATUS,
    title,
  };
}
export function addHRMStatusSuccessAction(data) {
  return {
    type: ADD_HRM_STATUS_SUCCESS,
    data,
  };
}

export function editHRMStatusAction(title, id) {
  return {
    type: EDIT_HRM_STATUS,
    title,
    id
  };
}
export function editHRMStatusSuccessAction(data) {
  return {
    type: EDIT_HRM_STATUS_SUCCESS,
    data,
  };
}

export function deleteHRMStatusAction(id) {
  return {
    type: DELETE_HRM_STATUS,
    id,
  };
}
export function deleteHRMStatusSuccessAction(data) {
  return {
    type: DELETE_HRM_STATUS_SUCCESS,
    data,
  };
}

export function resetAllStatus(data) {
  return {
    type: RESET_ALL_STATUS,
    data,
  };
}

export function resetAllStatusSuccess(data) {
  return {
    type: RESET_ALL_STATUS_SUCCESS,
    data,
  };
}

export function resetAllStatusFailure(error) {
  return {
    type: RESET_ALL_STATUS_FAILURE,
    error,
  };
}

// Category

export function fetchAllCategoryAction() {
  return {
    type: GET_ALL_CATEGORY,
  };
}
export function fetchAllCategorySuccessAction(data) {
  return {
    type: GET_ALL_CATEGORY_SUCCESS,
    data,
  };
}

export function addCategoryAction(title, code) {
  return {
    type: ADD_CATEGORY,
    title,
    code,
  };
}
export function addCategorySuccessAction(data) {
  return {
    type: ADD_CATEGORY_SUCCESS,
    data,
  };
}

export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}

export function updateCategoryAction(title, param) {
  return {
    type: UPDATE_CATEGORY,
    title,
    param,
  };
}
export function updateCategorySuccessAction(data) {
  return {
    type: UPDATE_CATEGORY_SUCCESS,
    data,
  };
}
export function deleteCategoryAction(id) {
  return {
    type: DELETE_CATEGORY,
    id,
  };
}
export function deleteCategorySuccessAction(data) {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    data,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function resetAllCategory(data) {
  return {
    type: RESET_ALL_CATEGORY,
    data,
  };
}

export function resetAllCategorySuccess(data) {
  return {
    type: RESET_ALL_CATEGORY_SUCCESS,
    data,
  };
}

export function resetAllCategoryFailure(error) {
  return {
    type: RESET_ALL_CATEGORY_FAILURE,
    error,
  };
}

export function addHRMCategoryAction(title) {
  return {
    type: ADD_HRM_CATEGORY,
    title,
  };
}
export function addHRMCategorySuccessAction(data) {
  return {
    type: ADD_HRM_CATEGORY_SUCCESS,
    data,
  };
}

export function editHRMCategoryAction(title, id) {
  return {
    type: EDIT_HRM_CATEGORY,
    title,
    id,
  };
}
export function editHRMCategorySuccessAction(data) {
  return {
    type: EDIT_HRM_CATEGORY_SUCCESS,
    data,
  };
}

export function deleteHRMCategoryAction(title) {
  return {
    type: DELETE_HRM_CATEGORY,
    title,
  };
}
export function deleteHRMCategorySuccessAction(data) {
  return {
    type: DELETE_HRM_CATEGORY_SUCCESS,
    data,
  };
}