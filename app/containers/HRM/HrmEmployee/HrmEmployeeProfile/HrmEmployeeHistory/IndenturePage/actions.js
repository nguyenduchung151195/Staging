/*
 *
 * IndenturePage actions
 *
 */

import {
  CREATE_INDENTURE,
  CREATE_INDENTURE_SUCCESS,
  CREATE_INDENTURE_FAILURE,
  UPDATE_INDENTURE,
  UPDATE_INDENTURE_SUCCESS,
  UPDATE_INDENTURE_FAILURE,
  DELETE_INDENTURE,
  DELETE_INDENTURE_SUCCESS,
  DELETE_INDENTURE_FAILURE,
} from './constants';

export function createIndenture(data) {
  return {
    type: CREATE_INDENTURE,
    data,
  };
}

export function createIndentureSuccess(data) {
  return {
    type: CREATE_INDENTURE_SUCCESS,
    data,
  };
}

export function createIndentureFailure(error) {
  return {
    type: CREATE_INDENTURE_FAILURE,
    error,
  };
}

export function updateIndenture(hrmEmployeeId, data) {
  return {
    type: UPDATE_INDENTURE,
    hrmEmployeeId,
    data,
  };
}

export function updateIndentureSuccess(data) {
  return {
    type: UPDATE_INDENTURE_SUCCESS,
    data,
  };
}

export function updateIndentureFailure(error) {
  return {
    type: UPDATE_INDENTURE_FAILURE,
    error,
  };
}

export function deleteIndenture(hrmEmployeeId, ids) {
  return {
    type: DELETE_INDENTURE,
    hrmEmployeeId,
    ids
  };
}

export function deleteIndentureSuccess(data) {
  return {
    type: DELETE_INDENTURE_SUCCESS,
    data,
  };
}

export function deleteIndentureFailure(error) {
  return {
    type: DELETE_INDENTURE_FAILURE,
    error,
  };
}