/*
 *
 * SabbaticalPage actions
 *
 */

import {
  CREATE_SABBATICAL,
  CREATE_SABBATICAL_SUCCESS,
  CREATE_SABBATICAL_FAILURE,
  DEFAULT_ACTION,
  UPDATE_SABBATICAL,
  UPDATE_SABBATICAL_SUCCESS,
  UPDATE_SABBATICAL_FAILURE,
  DELETE_SABBATICAL,
  DELETE_SABBATICAL_SUCCESS,
  DELETE_SABBATICAL_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function createSabbatical(data) {
  return {
    type: CREATE_SABBATICAL,
    data,
  };
}

export function createSabbaticalSuccess(data) {
  return {
    type: CREATE_SABBATICAL_SUCCESS,
    data,
  };
}

export function createSabbaticalFailure(error) {
  return {
    type: CREATE_SABBATICAL_FAILURE,
    error,
  };
}

export function updateSabbatical(hrmEmployeeId, data) {
  return {
    type: UPDATE_SABBATICAL,
    hrmEmployeeId,
    data,
  };
}

export function updateSabbaticalSuccess(data) {
  return {
    type: UPDATE_SABBATICAL_SUCCESS,
    data,
  };
}

export function updateSabbaticalFailure(error) {
  return {
    type: UPDATE_SABBATICAL_FAILURE,
    error,
  };
}

export function deleteSabbatical(hrmEmployeeId, ids) {
  return {
    type: DELETE_SABBATICAL,
    hrmEmployeeId,
    ids,
  };
}

export function deleteSabbaticalSuccess(data) {
  return {
    type: DELETE_SABBATICAL_SUCCESS,
    data,
  };
}

export function deleteSabbaticalFailure(error) {
  return {
    type: DELETE_SABBATICAL_FAILURE,
    error,
  };
}
