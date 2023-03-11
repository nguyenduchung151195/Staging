/*
 *
 * CollaboratePage actions
 *
 */

import {
  CREATE_COLLABORATE,
  CREATE_COLLABORATE_SUCCESS,
  CREATE_COLLABORATE_FAILURE,
  DEFAULT_ACTION,
  UPDATE_COLLABORATE,
  UPDATE_COLLABORATE_SUCCESS,
  UPDATE_COLLABORATE_FAILURE,
  DELETE_COLLABORATE,
  DELETE_COLLABORATE_SUCCESS,
  DELETE_COLLABORATE_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function createCollaborate(data) {
  return {
    type: CREATE_COLLABORATE,
    data,
  };
}

export function createCollaborateSuccess(data) {
  return {
    type: CREATE_COLLABORATE_SUCCESS,
    data,
  };
}

export function createCollaborateFailure(error) {
  return {
    type: CREATE_COLLABORATE_FAILURE,
    error,
  };
}

export function updateCollaborate(hrmEmployeeId, data) {
  return {
    type: UPDATE_COLLABORATE,
    hrmEmployeeId,
    data,
  };
}

export function updateCollaborateSuccess(data) {
  return {
    type: UPDATE_COLLABORATE_SUCCESS,
    data,
  };
}

export function updateCollaborateFailure(error) {
  return {
    type: UPDATE_COLLABORATE_FAILURE,
    error,
  };
}

export function deleteCollaborate(hrmEmployeeId, ids) {
  return {
    type: DELETE_COLLABORATE,
    hrmEmployeeId,
    ids,
  };
}

export function deleteCollaborateSuccess(data) {
  return {
    type: DELETE_COLLABORATE_SUCCESS,
    data,
  };
}

export function deleteCollaborateFailure(error) {
  return {
    type: DELETE_COLLABORATE_FAILURE,
    error,
  };
}
