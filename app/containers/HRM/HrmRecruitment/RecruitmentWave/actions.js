/*
 *
 * RecruitmentPage actions
 *
 */

import {
  CREATE_RECRUITMENT,
  CREATE_RECRUITMENT_SUCCESS,
  CREATE_RECRUITMENT_FAILURE,
  DEFAULT_ACTION,
  UPDATE_RECRUITMENT,
  UPDATE_RECRUITMENT_SUCCESS,
  UPDATE_RECRUITMENT_FAILURE,
  DELETE_RECRUITMENT,
  DELETE_RECRUITMENT_SUCCESS,
  DELETE_RECRUITMENT_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function createRecruitment(data) {
  return {
    type: CREATE_RECRUITMENT,
    data,
  };
}

export function createRecruitmentSuccess(data) {
  return {
    type: CREATE_RECRUITMENT_SUCCESS,
    data,
  };
}

export function createRecruitmentFailure(error) {
  return {
    type: CREATE_RECRUITMENT_FAILURE,
    error,
  };
}

export function updateRecruitment(hrmEmployeeId, data) {
  return {
    type: UPDATE_RECRUITMENT,
    hrmEmployeeId,
    data,
  };
}

export function updateRecruitmentSuccess(data) {
  return {
    type: UPDATE_RECRUITMENT_SUCCESS,
    data,
  };
}

export function updateRecruitmentFailure(error) {
  return {
    type: UPDATE_RECRUITMENT_FAILURE,
    error,
  };
}

export function deleteRecruitment(hrmEmployeeId) {
  return {
    type: DELETE_RECRUITMENT,
    hrmEmployeeId,
  };
}

export function deleteRecruitmentSuccess(data) {
  return {
    type: DELETE_RECRUITMENT_SUCCESS,
    data,
  };
}

export function deleteRecruitmentFailure(error) {
  return {
    type: DELETE_RECRUITMENT_FAILURE,
    error,
  };
}