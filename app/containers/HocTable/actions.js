/*
 *
 * HocTable actions
 *
 */

import {
  DEFAULT_ACTION,
  EDIT_VIEWCONFIG_ACTION,
  EDIT_VIEWCONFIG_SUCCESS,
  EDIT_VIEWCONFIG_FAIL,
  GET_DYNAMIC_FORM_ACTION,
  GET_DYNAMIC_FORM_SUCCESS,
  GET_DYNAMIC_FORM_FAIL,
  EXPORT_FORM_ACTION,
  CREATE_APPROVE,
  CREATE_APPROVE_FAILED,
  CREATE_APPROVE_SUCCESS,
  SET_APPROVE_FINISH,
  SET_APPROVE_FINISH_SUCCESS,
  SET_APPROVE_FINISH_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function editViewConfigAction(newViewConfig) {
  return {
    type: EDIT_VIEWCONFIG_ACTION,
    newViewConfig,
  };
}
export function editViewConfigSuccessAction() {
  return {
    type: EDIT_VIEWCONFIG_SUCCESS,
  };
}
export function editViewConfigFailAction(message) {
  return {
    type: EDIT_VIEWCONFIG_FAIL,
    message,
  };
}
export function getDynamicFormAction(collectionCode) {
  return {
    type: GET_DYNAMIC_FORM_ACTION,
    collectionCode,
  };
}
export function getDynamicFormSuccessAction(data) {
  return {
    type: GET_DYNAMIC_FORM_SUCCESS,
    data,
  };
}
export function getDynamicFormFailAction(message) {
  return {
    type: GET_DYNAMIC_FORM_FAIL,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function exportForm(collectionCode, formId, data, viewConfig) {
  return {
    type: EXPORT_FORM_ACTION,
    collectionCode,
    formId,
    data,
    viewConfig,
  };
}

export function createApproveAct(body) {
  return {
    type: CREATE_APPROVE,
    body,
  };
}
export function createApproveSuccess(data) {
  return {
    type: CREATE_APPROVE_SUCCESS,
    data,
  };
}
export function createApproveFailed(err) {
  return {
    type: CREATE_APPROVE_FAILED,
    err,
  };
}

export function setApproveFinish(body) {
  return {
    type: SET_APPROVE_FINISH,
    body,
  };
}
export function setApproveFinishSuccess(data) {
  return {
    type: SET_APPROVE_FINISH_SUCCESS,
    data,
  };
}
export function functionsetApproveFinishError(err) {
  return {
    type: SET_APPROVE_FINISH_ERROR,
    err,
  };
}
