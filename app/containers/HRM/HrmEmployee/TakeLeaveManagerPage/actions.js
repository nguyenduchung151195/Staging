/*
 *
 * TakeLeaveManagePage actions
 *
 */

import { 
  DEFAULT_ACTION,
  CREATE_TAKE_LEAVE,
  CREATE_TAKE_LEAVE_SUCCESS,
  CREATE_TAKE_LEAVE_FAILURE, 
  UPDATE_TAKE_LEAVE,
  UPDATE_TAKE_LEAVE_SUCCESS,
  UPDATE_TAKE_LEAVE_FAILURE,
  DELETE_TAKE_LEAVE,
  DELETE_TAKE_LEAVE_SUCCESS,
  DELETE_TAKE_LEAVE_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function createTakeLeave(data) {
  return {
    type: CREATE_TAKE_LEAVE,
    data,
  };
}

export function createTakeLeaveSuccess(data) {
  return {
    type: CREATE_TAKE_LEAVE_SUCCESS,
    data,
  };
}

export function createTakeLeaveFailure(error) {
  return {
    type: CREATE_TAKE_LEAVE_FAILURE,
    error,
  };
}

export function updateTakeLeave(hrmEmployeeId, data) {
  return {
    type: UPDATE_TAKE_LEAVE,
    hrmEmployeeId,
    data,
  };
}

export function updateTakeLeaveSuccess(data) {
  return {
    type: UPDATE_TAKE_LEAVE_SUCCESS,
    data,
  };
}

export function updateTakeLeaveFailure(error) {
  return {
    type: UPDATE_TAKE_LEAVE_FAILURE,
    error,
  };
}

export function deleteTakeLeave(data) {
  return {
    type: DELETE_TAKE_LEAVE,
    data
  };
}

export function deleteTakeLeaveSuccess(data) {
  return {
    type: DELETE_TAKE_LEAVE_SUCCESS,
    data,
  };
}

export function deleteTakeLeaveFailure(error) {
  return {
    type: DELETE_TAKE_LEAVE_FAILURE,
    error,
  };
}