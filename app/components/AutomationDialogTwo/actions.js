/*
 *
 * PluginAutomation actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_DYNAMIC_FORMS,
  GET_ALL_DYNAMIC_FORMS_SUCCESS,
  GET_ALL_DYNAMIC_FORMS_FAIL,
  GET_ALL_AUTOMATION,
  GET_ALL_AUTOMATION_SUCCESS,
  GET_ALL_AUTOMATION_FAIL,
  ADD_AUTOMATION,
  ADD_AUTOMATION_FAIL,
  ADD_AUTOMATION_SUCCESS,
  DELETE_AUTOMATION,
  DELETE_AUTOMATION_FAIL,
  DELETE_AUTOMATION_SUCCESS,
  UPDATE_AUTOMATION,
  UPDATE_AUTOMATION_FAIL,
  UPDATE_AUTOMATION_SUCCESS,
  GET_ALL_APPROVE_GROUP,
  GET_ALL_APPROVE_GROUP_SUCCESS,
  GET_ALL_APPROVE_GROUP_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getAllDynamicFormAction() {
  return {
    type: GET_ALL_DYNAMIC_FORMS,
  };
}
export function getAllDynamicFormSuccessAction(data) {
  return {
    type: GET_ALL_DYNAMIC_FORMS_SUCCESS,
    data,
    // message,
  };
}
export function getAllDynamicFormFailAction(err, message) {
  return {
    type: GET_ALL_DYNAMIC_FORMS_FAIL,
    err,
    message,
  };
}
export function getAllAutomationAction(collectionCode) {
  return {
    type: GET_ALL_AUTOMATION,
    collectionCode,
  };
}
export function getAllAutomationSuccessAction(data, message) {
  return {
    type: GET_ALL_AUTOMATION_SUCCESS,
    data,
    message,
  };
}
export function getAllAutomationFailAction(err, message) {
  return {
    type: GET_ALL_AUTOMATION_FAIL,
    err,
    message,
  };
}
export function addAutomationAction(automation) {
  return {
    type: ADD_AUTOMATION,
    automation,
  };
}
export function addAutomationSuccessAction(data, message) {
  return {
    type: ADD_AUTOMATION_SUCCESS,
    data,
    message,
  };
}
export function addAutomationFailAction(err, message) {
  return {
    type: ADD_AUTOMATION_FAIL,
    err,
    message,
  };
}
export function deleteAutomationAction(automationCode) {
  return {
    type: DELETE_AUTOMATION,
    automationCode,
  };
}
export function deleteAutomationSuccessAction(data, message) {
  return {
    type: DELETE_AUTOMATION_SUCCESS,
    data,
    message,
  };
}
export function deleteAutomationFailAction(err, message) {
  return {
    type: DELETE_AUTOMATION_FAIL,
    err,
    message,
  };
}
export function updateAutomationAction(automationCode, automation) {
  return {
    type: UPDATE_AUTOMATION,
    automationCode,
    automation,
  };
}
export function updateAutomationSuccessAction(data, message) {
  return {
    type: UPDATE_AUTOMATION_SUCCESS,
    data,
    message,
  };
}
export function updateAutomationFailAction(err, message) {
  return {
    type: UPDATE_AUTOMATION_FAIL,
    err,
    message,
  };
}
export function getAllApproveGroupAction() {
  return {
    type: GET_ALL_APPROVE_GROUP,
  };
}
export function getAllApproveGroupSuccessAction(data, mappingConvert) {
  return {
    type: GET_ALL_APPROVE_GROUP_SUCCESS,
    data,
    mappingConvert,
  };
}
export function getAllApproveGroupFailAction(err, message) {
  return {
    type: GET_ALL_APPROVE_GROUP_FAIL,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
