/*
 *
 * CloneModuleComponent actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_DOCS,
  GET_ALL_DOCS_SUCCESS,
  GET_ALL_DOCS_FAIL,
  GET_ALL_RELATION_DOCS,
  GET_ALL_RELATION_DOCS_SUCCESS,
  GET_ALL_RELATION_DOCS_FAIL,
  ADD_DOC,
  ADD_DOC_FAIL,
  ADD_DOC_SUCCESS,
  DELETE_DOCS,
  DELETE_DOCS_FAIL,
  DELETE_DOCS_SUCCESS,
  UPDATE_DOC,
  UPDATE_DOC_FAIL,
  UPDATE_DOC_SUCCESS,
  GET_ALL_PLUGINS,
  GET_ALL_PLUGINS_SUCCESS,
  GET_ALL_PLUGINS_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function fetchAllRelationDocsAction(listRelationRef) {
  return {
    type: GET_ALL_RELATION_DOCS,
    listRelationRef,
  };
}
export function fetchAllRelationDocsSuccessAction(message) {
  return {
    type: GET_ALL_RELATION_DOCS_SUCCESS,
    message,
  };
}
export function fetchAllRelationDocsFailAction(message) {
  return {
    type: GET_ALL_RELATION_DOCS_FAIL,
    message,
  };
}
export function fetchAllDocsAction(param) {
  return {
    type: GET_ALL_DOCS,
    param,
  };
}
export function fetchAllDocsSuccessAction(data, message) {
  return {
    type: GET_ALL_DOCS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllDocsFailAction(err, message) {
  return {
    type: GET_ALL_DOCS_FAIL,
    err,
    message,
  };
}
export function addDocAction(param, doc) {
  return {
    type: ADD_DOC,
    param,
    doc,
  };
}
export function addDocSuccessAction(data, message) {
  return {
    type: ADD_DOC_SUCCESS,
    data,
    message,
  };
}
export function addDocFailAction(err, message) {
  return {
    type: ADD_DOC_FAIL,
    err,
    message,
  };
}
export function deleteDocsAction(collectionCode, deleteIds) {
  return {
    type: DELETE_DOCS,
    collectionCode,
    deleteIds,
  };
}
export function deleteDocsSuccessAction(data, message) {
  return {
    type: DELETE_DOCS_SUCCESS,
    data,
    message,
  };
}
export function deleteDocsFailAction(err, message) {
  return {
    type: DELETE_DOCS_FAIL,
    err,
    message,
  };
}
export function updateDocsAction(param, doc) {
  return {
    type: UPDATE_DOC,
    param,
    doc,
  };
}
export function updateDocsSuccessAction(data, message) {
  return {
    type: UPDATE_DOC_SUCCESS,
    data,
    message,
  };
}
export function updateDocsFailAction(err, message) {
  return {
    type: UPDATE_DOC_FAIL,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getPluginsAction(collectionCode) {
  return {
    type: GET_ALL_PLUGINS,
    collectionCode,
  };
}
export function getPluginsSuccessAction(data, message) {
  return {
    type: GET_ALL_PLUGINS_SUCCESS,
    data,
    message,
  };
}
export function getPluginsDocsFailAction(err, message) {
  return {
    type: GET_ALL_PLUGINS_FAIL,
    err,
    message,
  };
}
