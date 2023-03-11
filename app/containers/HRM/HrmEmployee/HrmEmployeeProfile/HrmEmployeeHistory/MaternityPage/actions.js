/*
 *
 * MaternityPage actions
 *
 */

import {
  CREATE_MATERNITY,
  CREATE_MATERNITY_SUCCESS,
  CREATE_MATERNITY_FAILURE,
  UPDATE_MATERNITY,
  UPDATE_MATERNITY_SUCCESS,
  UPDATE_MATERNITY_FAILURE,
  DELETE_MATERNITY,
  DELETE_MATERNITY_SUCCESS,
  DELETE_MATERNITY_FAILURE,
} from './constants';

export function createMaternity(data) {
  return {
    type: CREATE_MATERNITY,
    data,
  };
}

export function createMaternitySuccess(data) {
  return {
    type: CREATE_MATERNITY_SUCCESS,
    data,
  };
}

export function createMaternityFailure(error) {
  return {
    type: CREATE_MATERNITY_FAILURE,
    error,
  };
}

export function updateMaternity(hrmEmployeeId, data) {
  return {
    type: UPDATE_MATERNITY,
    hrmEmployeeId,
    data,
  };
}

export function updateMaternitySuccess(data) {
  return {
    type: UPDATE_MATERNITY_SUCCESS,
    data,
  };
}

export function updateMaternityFailure(error) {
  return {
    type: UPDATE_MATERNITY_FAILURE,
    error,
  };
}

export function deleteMaternity(hrmEmployeeId, ids) {
  return {
    type: DELETE_MATERNITY,
    hrmEmployeeId,
    ids
  };
}

export function deleteMaternitySuccess(data) {
  return {
    type: DELETE_MATERNITY_SUCCESS,
    data,
  };
}

export function deleteMaternityFailure(error) {
  return {
    type: DELETE_MATERNITY_FAILURE,
    error,
  };
}