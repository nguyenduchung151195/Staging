/*
 *
 * EducationPage actions
 *
 */

import {
  CREATE_EDUCATION,
  CREATE_EDUCATION_SUCCESS,
  CREATE_EDUCATION_FAILURE,
  UPDATE_EDUCATION,
  UPDATE_EDUCATION_SUCCESS,
  UPDATE_EDUCATION_FAILURE,
  DELETE_EDUCATION,
  DELETE_EDUCATION_SUCCESS,
  DELETE_EDUCATION_FAILURE,
} from './constants';

export function createEducation(data) {
  return {
    type: CREATE_EDUCATION,
    data,
  };
}

export function createEducationSuccess(data) {
  return {
    type: CREATE_EDUCATION_SUCCESS,
    data,
  };
}

export function createEducationFailure(error) {
  return {
    type: CREATE_EDUCATION_FAILURE,
    error,
  };
}

export function updateEducation(hrmEmployeeId, data) {
  return {
    type: UPDATE_EDUCATION,
    hrmEmployeeId,
    data,
  };
}

export function updateEducationSuccess(data) {
  return {
    type: UPDATE_EDUCATION_SUCCESS,
    data,
  };
}

export function updateEducationFailure(error) {
  return {
    type: UPDATE_EDUCATION_FAILURE,
    error,
  };
}

export function deleteEducation(hrmEmployeeId, ids) {
  return {
    type: DELETE_EDUCATION,
    hrmEmployeeId,
    ids
  };
}

export function deleteEducationSuccess(data) {
  return {
    type: DELETE_EDUCATION_SUCCESS,
    data,
  };
}

export function deleteEducationFailure(error) {
  return {
    type: DELETE_EDUCATION_FAILURE,
    error,
  };
}