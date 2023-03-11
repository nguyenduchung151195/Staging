/*
 *
 * AddRecruitmentWave actions
 *
 */

import {
  DEFAULT_ACTION,
  CREATE_RECRUITMENTMANAGEMENT,
  CREATE_RECRUITMENTMANAGEMENT_SUCCESS,
  CREATE_RECRUITMENTMANAGEMENT_FAILURE,
  POST_SWITCH_CANDIDATE,
  POST_SWITCH_CANDIDATE_SUCCESS,
  POST_SWITCH_CANDIDATE_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function createRecruitmentManagement(data) {
  return {
    type: CREATE_RECRUITMENTMANAGEMENT,
    data,
  };
}

export function createRecruitmentManagementSuccess(data) {
  return {
    type: CREATE_RECRUITMENTMANAGEMENT_SUCCESS,
    data,
  };
}

export function createRecruitmentManagementFailure(error) {
  return {
    type: CREATE_RECRUITMENTMANAGEMENT_FAILURE,
    error,
  };
}

export function postSwitchCandidate(data) {
  return {
    type: POST_SWITCH_CANDIDATE,
    data,
  };
}

export function postSwitchCandidateSuccess(data) {
  return {
    type: POST_SWITCH_CANDIDATE_SUCCESS,
    data,
  };
}

export function postSwitchCandidateFailure(err) {
  return {
    type: POST_SWITCH_CANDIDATE_FAILURE,
    err,
  };
}
