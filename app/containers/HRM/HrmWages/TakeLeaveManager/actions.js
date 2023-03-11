/*
 *
 * WagesManagement actions
 *
 */

import {
  MERGE_DATA,
  ADD_TAKE_LEAVE_MANAGER,
  ADD_TAKE_LEAVE_MANAGER_SUCCESS,
  ADD_TAKE_LEAVE_MANAGER_FAILURE,
  UPDATE_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER_SUCCESS,
  UPDATE_TAKE_LEAVE_MANAGER_FAILURE,
  DELETE_TAKE_LEAVE_MANAGER,
  DELETE_TAKE_LEAVE_MANAGER_SUCCESS,
  DELETE_TAKE_LEAVE_MANAGER_FAILURE,
  GET_ALL_VACATION_MODE,
  GET_ALL_VACATION_MODE_SUCCESS,
  GET_ALL_VACATION_MODE_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

// quan ly ngay nghi phep
export function addTakeLeaveManager(data) {
  return {
    type: ADD_TAKE_LEAVE_MANAGER,
    data,
  };
}

export function addTakeLeaveManagerSuccess(data) {
  return {
    type: ADD_TAKE_LEAVE_MANAGER_SUCCESS,
    data,
  };
}

export function addTakeLeaveManagerFailure(error) {
  return {
    type: ADD_TAKE_LEAVE_MANAGER_FAILURE,
    error,
  };
}

export function updateTakeLeaveManager(data) {
  return {
    type: UPDATE_TAKE_LEAVE_MANAGER,
    data,
  };
}

export function updateTakeLeaveManagerSuccess(data) {
  return {
    type: UPDATE_TAKE_LEAVE_MANAGER_SUCCESS,
    data,
  };
}

export function updateTakeLeaveManagerFailure(error) {
  return {
    type: UPDATE_TAKE_LEAVE_MANAGER_FAILURE,
    error,
  };
}

export function deleteTakeLeaveManager(ids) {
  return {
    type: DELETE_TAKE_LEAVE_MANAGER,
    ids,
  };
}

export function deleteTakeLeaveManagerSuccess(data) {
  return {
    type: DELETE_TAKE_LEAVE_MANAGER_SUCCESS,
    data,
  };
}

export function deleteTakeLeaveManagerFailure(error) {
  return {
    type: DELETE_TAKE_LEAVE_MANAGER_FAILURE,
    error,
  };
}

export function getAllVacationMode() {
  return {
    type: GET_ALL_VACATION_MODE,
  };
}
export function getAllVacationModeSuccess(data) {
  return {
    type: GET_ALL_VACATION_MODE_SUCCESS,
    data,
  };
}
export function getAllVacationModeFailure(error) {
  return {
    type: GET_ALL_VACATION_MODE_FAILURE,
    error,
  };
}
