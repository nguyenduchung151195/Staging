/*
 *
 * DismissedPage actions
 *
 */

import {
  CREATE_DISMISSED,
  CREATE_DISMISSED_SUCCESS,
  CREATE_DISMISSED_FAILURE,
  UPDATE_DISMISSED,
  UPDATE_DISMISSED_SUCCESS,
  UPDATE_DISMISSED_FAILURE,
  DELETE_DISMISSED,
  DELETE_DISMISSED_SUCCESS,
  DELETE_DISMISSED_FAILURE,
} from './constants';

export function createDismissed(data) {
  return {
    type: CREATE_DISMISSED,
    data,
  };
}

export function createDismissedSuccess(data) {
  return {
    type: CREATE_DISMISSED_SUCCESS,
    data,
  };
}

export function createDismissedFailure(error) {
  return {
    type: CREATE_DISMISSED_FAILURE,
    error,
  };
}

export function updateDismissed(hrmEmployeeId, data) {
  return {
    type: UPDATE_DISMISSED,
    hrmEmployeeId,
    data,
  };
}

export function updateDismissedSuccess(data) {
  return {
    type: UPDATE_DISMISSED_SUCCESS,
    data,
  };
}

export function updateDismissedFailure(error) {
  return {
    type: UPDATE_DISMISSED_FAILURE,
    error,
  };
}

export function deleteDismissed(hrmEmployeeId, ids) {
  return {
    type: DELETE_DISMISSED,
    hrmEmployeeId,
    ids
  };
}

export function deleteDismissedSuccess(data) {
  return {
    type: DELETE_DISMISSED_SUCCESS,
    data,
  };
}

export function deleteDismissedFailure(error) {
  return {
    type: DELETE_DISMISSED_FAILURE,
    error,
  };
}