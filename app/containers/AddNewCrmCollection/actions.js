/*
 *
 * AddNewCrmCollection actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_COLLECTION,
  GET_ALL_COLLECTION_FALSE,
  GET_ALL_COLLECTION_SUCCESS,
  ADD_NEW_COLLECTION,
  ADD_NEW_COLLECTION_SUCCESS,
  ADD_NEW_COLLECTION_FALSE,
  EDIT_COLLECTION_SUCCESS,
  EDIT_COLLECTION_FALSE,
  EDIT_COLLECTION,
  DELETE_COLLECTION,
  DELETE_COLLECTION_FALSE,
  DELETE_COLLECTION_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAllCollection() {
  return {
    type: GET_ALL_COLLECTION,
  };
}
export function getAllCRMCollectionSuccess(data) {
  return {
    type: GET_ALL_COLLECTION_SUCCESS,
    data,
  };
}
export function getAllCRMCollectionFalse(err) {
  return {
    type: GET_ALL_COLLECTION_FALSE,
    err,
  };
}

export function postAddNewCollection(body) {
  return {
    type: ADD_NEW_COLLECTION,
    body,
  };
}
export function postAddNewCollectionSuccess(data, message) {
  return {
    type: ADD_NEW_COLLECTION_SUCCESS,
    data,
    message,
  };
}
export function postAddNewCollectionFalse(err, message) {
  return {
    type: ADD_NEW_COLLECTION_FALSE,
    err,
    message,
  };
}

export function putUpdateCollection(body, oldData) {
  return {
    type: EDIT_COLLECTION,
    body,
    oldData,
  };
}
export function putUpdateCollectionSuccess(message) {
  return {
    type: EDIT_COLLECTION_SUCCESS,
    // data,
    message,
  };
}
export function putUpdateCollectionFalse(err, message) {
  return {
    type: EDIT_COLLECTION_FALSE,
    err,
    message,
  };
}
export function deleteCollection(body) {
  return {
    type: DELETE_COLLECTION,
    body,
  };
}
export function deleteCollectionSuccess(data, message) {
  return {
    type: DELETE_COLLECTION_SUCCESS,
    data,
    message,
  };
}
export function deleteCollectionFalse(err, message) {
  return {
    type: DELETE_COLLECTION_FALSE,
    err,
    message,
  };
}
