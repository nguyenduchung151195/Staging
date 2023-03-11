/*
 *
 * DisciplinePage actions
 *
 */

import {
  CREATE_DISCIPLINE,
  CREATE_DISCIPLINE_SUCCESS,
  CREATE_DISCIPLINE_FAILURE,
  UPDATE_DISCIPLINE,
  UPDATE_DISCIPLINE_SUCCESS,
  UPDATE_DISCIPLINE_FAILURE,
  DELETE_DISCIPLINE,
  DELETE_DISCIPLINE_SUCCESS,
  DELETE_DISCIPLINE_FAILURE,
} from './constants';

export function createDiscipline(data) {
  return {
    type: CREATE_DISCIPLINE,
    data,
  };
}

export function createDisciplineSuccess(data) {
  return {
    type: CREATE_DISCIPLINE_SUCCESS,
    data,
  };
}

export function createDisciplineFailure(error) {
  return {
    type: CREATE_DISCIPLINE_FAILURE,
    error,
  };
}

export function updateDiscipline(hrmEmployeeId, data) {
  return {
    type: UPDATE_DISCIPLINE,
    hrmEmployeeId,
    data,
  };
}

export function updateDisciplineSuccess(data) {
  return {
    type: UPDATE_DISCIPLINE_SUCCESS,
    data,
  };
}

export function updateDisciplineFailure(error) {
  return {
    type: UPDATE_DISCIPLINE_FAILURE,
    error,
  };
}

export function deleteDiscipline(hrmEmployeeId, ids) {
  return {
    type: DELETE_DISCIPLINE,
    hrmEmployeeId,
    ids
  };
}

export function deleteDisciplineSuccess(data) {
  return {
    type: DELETE_DISCIPLINE_SUCCESS,
    data,
  };
}

export function deleteDisciplineFailure(error) {
  return {
    type: DELETE_DISCIPLINE_FAILURE,
    error,
  };
}