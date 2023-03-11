/*
 *
 * ExperiencePage actions
 *
 */

import {
  CREATE_EXPERIENCE,
  CREATE_EXPERIENCE_SUCCESS,
  CREATE_EXPERIENCE_FAILURE,
  UPDATE_EXPERIENCE,
  UPDATE_EXPERIENCE_SUCCESS,
  UPDATE_EXPERIENCE_FAILURE,
  DELETE_EXPERIENCE,
  DELETE_EXPERIENCE_SUCCESS,
  DELETE_EXPERIENCE_FAILURE,
} from './constants';

export function createExperience(data) {
  return {
    type: CREATE_EXPERIENCE,
    data,
  };
}

export function createExperienceSuccess(data) {
  return {
    type: CREATE_EXPERIENCE_SUCCESS,
    data,
  };
}

export function createExperienceFailure(error) {
  return {
    type: CREATE_EXPERIENCE_FAILURE,
    error,
  };
}

export function updateExperience(hrmEmployeeId, data) {
  return {
    type: UPDATE_EXPERIENCE,
    hrmEmployeeId,
    data,
  };
}

export function updateExperienceSuccess(data) {
  return {
    type: UPDATE_EXPERIENCE_SUCCESS,
    data,
  };
}

export function updateExperienceFailure(error) {
  return {
    type: UPDATE_EXPERIENCE_FAILURE,
    error,
  };
}

export function deleteExperience(hrmEmployeeId, ids) {
  return {
    type: DELETE_EXPERIENCE,
    hrmEmployeeId,
    ids
  };
}

export function deleteExperienceSuccess(data) {
  return {
    type: DELETE_EXPERIENCE_SUCCESS,
    data,
  };
}

export function deleteExperienceFailure(error) {
  return {
    type: DELETE_EXPERIENCE_FAILURE,
    error,
  };
}