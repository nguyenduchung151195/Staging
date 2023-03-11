/*
 *
 * RecruitmentWavePage actions
 *
 */

import {
  CREATE_RECRUIMENTWAVE,
  CREATE_RECRUIMENTWAVE_SUCCESS,
  CREATE_RECRUIMENTWAVE_FAILURE,
  DEFAULT_ACTION,
  UPDATE_RECRUIMENTWAVE,
  UPDATE_RECRUIMENTWAVE_SUCCESS,
  UPDATE_RECRUIMENTWAVE_FAILURE,
  DELETE_RECRUIMENTWAVE,
  DELETE_RECRUIMENTWAVE_SUCCESS,
  DELETE_RECRUIMENTWAVE_FAILURE,
  CREATE_ROUNDRECRUIMENT,
  CREATE_ROUNDRECRUIMENT_SUCCESS,
  CREATE_ROUNDRECRUIMENT_FAILURE,
  UPDATE_ROUNDRECRUIMENT,
  UPDATE_ROUNDRECRUIMENT_SUCCESS,
  UPDATE_ROUNDRECRUIMENT_FAILURE,
  DELETE_ROUNDRECRUIMENT,
  DELETE_ROUNDRECRUIMENT_SUCCESS,
  DELETE_ROUNDRECRUIMENT_FAILURE,
  CREATE_SUBJECTRECRUIMENT,
  CREATE_SUBJECTRECRUIMENT_SUCCESS,
  CREATE_SUBJECTRECRUIMENT_FAILURE,
  UPDATE_SUBJECTRECRUIMENT,
  UPDATE_SUBJECTRECRUIMENT_SUCCESS,
  UPDATE_SUBJECTRECRUIMENT_FAILURE,
  DELETE_SUBJECTRECRUIMENT,
  DELETE_SUBJECTRECRUIMENT_SUCCESS,
  DELETE_SUBJECTRECRUIMENT_FAILURE,
  CREATE_APPLICANTRECRUITMENT,
  CREATE_APPLICANTRECRUITMENT_SUCCESS,
  CREATE_APPLICANTRECRUITMENT_FAILURE,
  UPDATE_APPLICANTRECRUITMENT,
  UPDATE_APPLICANTRECRUITMENT_SUCCESS,
  UPDATE_APPLICANTRECRUITMENT_FAILURE,
  DELETE_APPLICANTRECRUITMENT,
  DELETE_APPLICANTRECRUITMENT_SUCCESS,
  DELETE_APPLICANTRECRUITMENT_FAILURE,
  CREATE_TESTAPPLICANTRECRUITMENT,
  CREATE_TESTAPPLICANTRECRUITMENT_SUCCESS,
  CREATE_TESTAPPLICANTRECRUITMENT_FAILURE,
  UPDATE_TESTAPPLICANTRECRUITMENT,
  UPDATE_TESTAPPLICANTRECRUITMENT_SUCCESS,
  UPDATE_TESTAPPLICANTRECRUITMENT_FAILURE,
  DELETE_TESTAPPLICANTRECRUITMENT,
  DELETE_TESTAPPLICANTRECRUITMENT_SUCCESS,
  DELETE_TESTAPPLICANTRECRUITMENT_FAILURE,
  GET_HUMAN_RESOURCE,
  GET_HUMAN_RESOURCE_SUCCESS,
  GET_HUMAN_RESOURCE_FAILURE,
  GET_ROLE_GROUP,
  GET_ROLE_GROUP_SUCCESS,
  GET_ROLE_GROUP_ERROR,
  POST_SWITCH_CANDIDATE,
  POST_SWITCH_CANDIDATE_SUCCESS,
  POST_SWITCH_CANDIDATE_FAILURE,
  CREATE_APPLICANTRECRUITMENT_AGENCY,
  CREATE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
  CREATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
  UPDATE_APPLICANTRECRUITMENT_AGENCY,
  UPDATE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
  UPDATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
  DELETE_APPLICANTRECRUITMENT_AGENCY,
  DELETE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
  DELETE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function createRecruitmentWave(data) {
  return {
    type: CREATE_RECRUIMENTWAVE,
    data,
  };
}

export function createRecruitmentWaveSuccess(data) {
  return {
    type: CREATE_RECRUIMENTWAVE_SUCCESS,
    data,
  };
}

export function createRecruitmentWaveFailure(error) {
  return {
    type: CREATE_RECRUIMENTWAVE_FAILURE,
    error,
  };
}

export function updateRecruitmentWave(hrmEmployeeId, data) {
  return {
    type: UPDATE_RECRUIMENTWAVE,
    hrmEmployeeId,
    data,
  };
}

export function updateRecruitmentWaveSuccess(data) {
  return {
    type: UPDATE_RECRUIMENTWAVE_SUCCESS,
    data,
  };
}

export function updateRecruitmentWaveFailure(error) {
  return {
    type: UPDATE_RECRUIMENTWAVE_FAILURE,
    error,
  };
}

export function deleteRecruitmentWave(hrmEmployeeId, ids) {
  return {
    type: DELETE_RECRUIMENTWAVE,
    hrmEmployeeId,
    ids,
  };
}

export function deleteRecruitmentWaveSuccess(data) {
  return {
    type: DELETE_RECRUIMENTWAVE_SUCCESS,
    data,
  };
}

export function deleteRecruitmentWaveFailure(error) {
  return {
    type: DELETE_RECRUIMENTWAVE_FAILURE,
    error,
  };
}

export function createRoundRecruitment(data) {
  return {
    type: CREATE_ROUNDRECRUIMENT,
    data,
  };
}

export function createRoundRecruitmentSuccess(data) {
  return {
    type: CREATE_ROUNDRECRUIMENT_SUCCESS,
    data,
  };
}

export function createRoundRecruitmentFailure(error) {
  return {
    type: CREATE_ROUNDRECRUIMENT_FAILURE,
    error,
  };
}

export function updateRoundRecruitment(hrmEmployeeId, data) {
  return {
    type: UPDATE_ROUNDRECRUIMENT,
    hrmEmployeeId,
    data,
  };
}

export function updateRoundRecruitmentSuccess(data) {
  return {
    type: UPDATE_ROUNDRECRUIMENT_SUCCESS,
    data,
  };
}

export function updateRoundRecruitmentFailure(error) {
  return {
    type: UPDATE_ROUNDRECRUIMENT_FAILURE,
    error,
  };
}

export function deleteRoundRecruitment(hrmEmployeeId, ids) {
  return {
    type: DELETE_ROUNDRECRUIMENT,
    hrmEmployeeId,
    ids,
  };
}

export function deleteRoundRecruitmentSuccess(data) {
  return {
    type: DELETE_ROUNDRECRUIMENT_SUCCESS,
    data,
  };
}

export function deleteRoundRecruitmentFailure(error) {
  return {
    type: DELETE_ROUNDRECRUIMENT_FAILURE,
    error,
  };
}

export function createSubjectRecruiment(data) {
  return {
    type: CREATE_SUBJECTRECRUIMENT,
    data,
  };
}

export function createSubjectRecruimentSuccess(data) {
  return {
    type: CREATE_SUBJECTRECRUIMENT_SUCCESS,
    data,
  };
}

export function createSubjectRecruimentFailure(error) {
  return {
    type: CREATE_SUBJECTRECRUIMENT_FAILURE,
    error,
  };
}

export function updateSubjectRecruiment(hrmEmployeeId, data) {
  return {
    type: UPDATE_SUBJECTRECRUIMENT,
    hrmEmployeeId,
    data,
  };
}

export function updateSubjectRecruimentSuccess(data) {
  return {
    type: UPDATE_SUBJECTRECRUIMENT_SUCCESS,
    data,
  };
}

export function updateSubjectRecruimentFailure(error) {
  return {
    type: UPDATE_SUBJECTRECRUIMENT_FAILURE,
    error,
  };
}

export function deleteSubjectRecruiment(hrmEmployeeId, ids) {
  return {
    type: DELETE_SUBJECTRECRUIMENT,
    hrmEmployeeId,
    ids,
  };
}

export function deleteSubjectRecruimentSuccess(data) {
  return {
    type: DELETE_SUBJECTRECRUIMENT_SUCCESS,
    data,
  };
}

export function deleteSubjectRecruimentFailure(error) {
  return {
    type: DELETE_SUBJECTRECRUIMENT_FAILURE,
    error,
  };
}

export function createApplicantRecruitment(action) {
  return {
    type: CREATE_APPLICANTRECRUITMENT,
    action,
  };
}

export function createApplicantRecruitmentSuccess(data) {
  return {
    type: CREATE_APPLICANTRECRUITMENT_SUCCESS,
    data,
  };
}

export function createApplicantRecruitmentFailure(error) {
  return {
    type: CREATE_APPLICANTRECRUITMENT_FAILURE,
    error,
  };
}
// đăng tuyển

export function createApplicantRecruitmentAgency(action) {
  return {
    type: CREATE_APPLICANTRECRUITMENT_AGENCY,
    action,
  };
}

export function createApplicantRecruitmentAgencySuccess(data) {
  return {
    type: CREATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
    data,
  };
}

export function createApplicantRecruitmentAgencyFailure(error) {
  return {
    type: CREATE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
    error,
  };
}

export function updateApplicantRecruitmentAgency(data) {
  return {
    type: UPDATE_APPLICANTRECRUITMENT_AGENCY,
    data,
  };
}

export function updateApplicantRecruitmentAgencySuccess(data) {
  return {
    type: UPDATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
    data,
  };
}

export function updateApplicantRecruitmentAgencyFailure(error) {
  return {
    type: UPDATE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
    error,
  };
}
export function deleteApplicantRecruitmentAgency(id) {
  return {
    type: DELETE_APPLICANTRECRUITMENT_AGENCY,
    id,
  };
}
export function deleteApplicantRecruitmentAgencySuccess(data) {
  return {
    type: DELETE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
    data,
  };
}
export function deleteApplicantRecruitmentAgencyFailure(error) {
  return {
    type: DELETE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
    error,
  };
}
// hết  đăng tuyển
export function updateApplicantRecruitment(hrmEmployeeId, data) {
  return {
    type: UPDATE_APPLICANTRECRUITMENT,
    hrmEmployeeId,
    data,
  };
}

export function updateApplicantRecruitmentSuccess(data) {
  return {
    type: UPDATE_APPLICANTRECRUITMENT_SUCCESS,
    data,
  };
}

export function updateApplicantRecruitmentFailure(error) {
  return {
    type: UPDATE_APPLICANTRECRUITMENT_FAILURE,
    error,
  };
}

export function deleteApplicantRecruitment(hrmEmployeeId, ids) {
  return {
    type: DELETE_APPLICANTRECRUITMENT,
    hrmEmployeeId,
    ids,
  };
}

export function deleteApplicantRecruitmentSuccess(data) {
  return {
    type: DELETE_APPLICANTRECRUITMENT_SUCCESS,
    data,
  };
}

export function deleteApplicantRecruitmentFailure(error) {
  return {
    type: DELETE_APPLICANTRECRUITMENT_FAILURE,
    error,
  };
}

export function createTestApplicantRecruitment(action) {
  return {
    type: CREATE_TESTAPPLICANTRECRUITMENT,
    action,
  };
}

export function createTestApplicantRecruitmentSuccess(data) {
  return {
    type: CREATE_TESTAPPLICANTRECRUITMENT_SUCCESS,
    data,
  };
}

export function createTestApplicantRecruitmentFailure(error) {
  return {
    type: CREATE_TESTAPPLICANTRECRUITMENT_FAILURE,
    error,
  };
}

export function updateTestApplicantRecruitment(data, id) {
  return {
    type: UPDATE_TESTAPPLICANTRECRUITMENT,
    data,
    id,
  };
}

export function updateTestApplicantRecruitmentSuccess(data) {
  return {
    type: UPDATE_TESTAPPLICANTRECRUITMENT_SUCCESS,
    data,
  };
}

export function updateTestApplicantRecruitmentFailure(error) {
  return {
    type: UPDATE_TESTAPPLICANTRECRUITMENT_FAILURE,
    error,
  };
}

export function deleteTestApplicantRecruitment(ids) {
  return {
    type: DELETE_TESTAPPLICANTRECRUITMENT,
    ids,
  };
}

export function deleteTestApplicantRecruitmentSuccess(data) {
  return {
    type: DELETE_TESTAPPLICANTRECRUITMENT_SUCCESS,
    data,
  };
}

export function deleteTestApplicantRecruitmentFailure(error) {
  return {
    type: DELETE_TESTAPPLICANTRECRUITMENT_FAILURE,
    error,
  };
}

export function getHumanResource() {
  return {
    type: GET_HUMAN_RESOURCE,
  };
}
export function getHumanResourceSuccess(fields, data) {
  return {
    type: GET_HUMAN_RESOURCE_SUCCESS,
    fields,
    data,
  };
}
export function getHumanResourceFailure(error) {
  return {
    type: GET_HUMAN_RESOURCE_FAILURE,
    error,
  };
}

export function getRoleGroupAction(body) {
  return {
    type: GET_ROLE_GROUP,
    body,
  };
}

export function getRoleGroupSuccessAction(data) {
  return {
    type: GET_ROLE_GROUP_SUCCESS,
    data,
  };
}

export function getRoleGroupError(err) {
  return {
    type: GET_ROLE_GROUP_ERROR,
    err,
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
