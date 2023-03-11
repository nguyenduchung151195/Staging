/*
 *
 * ProcessPage actions
 *
 */

import {
  CREATE_PROCESS,
  CREATE_PROCESS_SUCCESS,
  CREATE_PROCESS_FAILURE,
  UPDATE_PROCESS,
  UPDATE_PROCESS_SUCCESS,
  UPDATE_PROCESS_FAILURE,
  DELETE_PROCESS,
  DELETE_PROCESS_SUCCESS,
  DELETE_PROCESS_FAILURE,
} from './constants';

export function createProcess(data) {
  return {
    type: CREATE_PROCESS,
    data,
  };
}

export function createProcessSuccess(data) {
  return {
    type: CREATE_PROCESS_SUCCESS,
    data,
  };
}

export function createProcessFailure(error) {
  return {
    type: CREATE_PROCESS_FAILURE,
    error,
  };
}

export function updateProcess(hrmEmployeeId, data) {
  return {
    type: UPDATE_PROCESS,
    hrmEmployeeId,
    data,
  };
}

export function updateProcessSuccess(data) {
  return {
    type: UPDATE_PROCESS_SUCCESS,
    data,
  };
}

export function updateProcessFailure(error) {
  return {
    type: UPDATE_PROCESS_FAILURE,
    error,
  };
}

export function deleteProcess(hrmEmployeeId, ids) {
  return {
    type: DELETE_PROCESS,
    hrmEmployeeId,
    ids
  };
}

export function deleteProcessSuccess(data) {
  return {
    type: DELETE_PROCESS_SUCCESS,
    data,
  };
}

export function deleteProcessFailure(error) {
  return {
    type: DELETE_PROCESS_FAILURE,
    error,
  };
}