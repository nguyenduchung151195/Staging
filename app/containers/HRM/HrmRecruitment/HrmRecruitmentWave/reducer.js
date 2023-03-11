/*
 *
 * RecruitmentWavePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_RECRUIMENTWAVE,
  CREATE_RECRUIMENTWAVE_SUCCESS,
  CREATE_RECRUIMENTWAVE_FAILURE,
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
  GET_HUMAN_RESOURCE_SUCCESS,
  GET_ROLE_GROUP_SUCCESS,
  POST_SWITCH_CANDIDATE,
  POST_SWITCH_CANDIDATE_FAILURE,
  POST_SWITCH_CANDIDATE_SUCCESS,
  CREATE_APPLICANTRECRUITMENT_AGENCY,
  CREATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
  CREATE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
  UPDATE_APPLICANTRECRUITMENT_AGENCY,
  UPDATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
  UPDATE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
  DELETE_APPLICANTRECRUITMENT_AGENCY,
  DELETE_APPLICANTRECRUITMENT_AGENCY_SUCCESS,
  DELETE_APPLICANTRECRUITMENT_AGENCY_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createRecruitmentWaveSuccess: null,
  updateRecruitmentWaveSuccess: null,
  deleteRecruitmentWaveSuccess: null,

  createRoundRecruitmentSuccess: null,
  updateRoundRecruitmentSuccess: null,
  deleteRoundRecruitmentSuccess: null,

  createApplicantRecruitmentSuccess: null,
  updateApplicantRecruitmentSuccess: null,
  deleteApplicantRecruitmentSuccess: null,

  createTestApplicantRecruitmentSuccess: null,
  updateTestApplicantRecruitmentSuccess: null,
  deleteTestApplicantRecruitmentSuccess: null,

  createSubjectRecruimentSuccess: null,
  updateSubjectRecruimentSuccess: null,
  deleteSubjectRecruimentSuccess: null,

  humanResource: [],
  fieldRole: [],
  roleGroups: [],

  postSwitchCandidateSuccess: false,
  updateRoundSuccess: false,
  updateApplicantSuccess: false,
  updateTestApplicantSuccess: false,
  updateSubjectSuccess: false,
});

function recruitmentWavePageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_RECRUIMENTWAVE:
      return state.set('isLoading', true).set('createRecruitmentWaveSuccess', null);
    case CREATE_RECRUIMENTWAVE_SUCCESS:
      return state.set('isLoading', false).set('createRecruitmentWaveSuccess', true);
    case CREATE_RECRUIMENTWAVE_FAILURE:
      return state.set('isLoading', false).set('createRecruitmentWaveSuccess', false);

    case CREATE_APPLICANTRECRUITMENT:
      return state
        .set('isLoading', true)
        .set('createApplicantRecruitmentSuccess', null)
        .set('error', undefined);
    case CREATE_APPLICANTRECRUITMENT_SUCCESS:
      return state
        .set('isLoading', false)
        .set('createApplicantRecruitmentSuccess', true)
        .set('error', false);
    case CREATE_APPLICANTRECRUITMENT_FAILURE:
      return state
        .set('isLoading', false)
        .set('createApplicantRecruitmentSuccess', false)
        .set('error', true);
    case UPDATE_APPLICANTRECRUITMENT:
      return state.set('isLoading', true).set('createApplicantRecruitmentSuccess', null);
    case UPDATE_APPLICANTRECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('createApplicantRecruitmentSuccess', true);
    case UPDATE_APPLICANTRECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('createApplicantRecruitmentSuccess', false);
    case DELETE_APPLICANTRECRUITMENT:
      return state.set('isLoading', true).set('createApplicantRecruitmentSuccess', null);
    case DELETE_APPLICANTRECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('createApplicantRecruitmentSuccess', true);
    case DELETE_APPLICANTRECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('createApplicantRecruitmentSuccess', false);

    case CREATE_TESTAPPLICANTRECRUITMENT:
      return state.set('isLoading', true).set('createTestApplicantRecruitmentSuccess', null);
    case CREATE_TESTAPPLICANTRECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('createTestApplicantRecruitmentSuccess', true);
    case CREATE_TESTAPPLICANTRECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('createTestApplicantRecruitmentSuccess', false);
    case UPDATE_TESTAPPLICANTRECRUITMENT:
      return state.set('isLoading', true).set('createTestApplicantRecruitmentSuccess', null);
    case UPDATE_TESTAPPLICANTRECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('createTestApplicantRecruitmentSuccess', true);
    case UPDATE_TESTAPPLICANTRECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('createTestApplicantRecruitmentSuccess', false);
    case DELETE_TESTAPPLICANTRECRUITMENT:
      return state.set('isLoading', true).set('createTestApplicantRecruitmentSuccess', null);
    case DELETE_TESTAPPLICANTRECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('createTestApplicantRecruitmentSuccess', true);
    case DELETE_TESTAPPLICANTRECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('createTestApplicantRecruitmentSuccess', false);
    // đăng tuyển
    case CREATE_APPLICANTRECRUITMENT_AGENCY:
      return state.set('isLoading', true).set('createApplicantRecruitmentAgencySuccess', null);
    case CREATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS:
      return state.set('isLoading', false).set('createApplicantRecruitmentAgencySuccess', true);
    case CREATE_APPLICANTRECRUITMENT_AGENCY_FAILURE:
      return state.set('isLoading', false).set('createApplicantRecruitmentAgencySuccess', false);
    case UPDATE_APPLICANTRECRUITMENT_AGENCY:
      return state.set('isLoading', true).set('createApplicantRecruitmentAgencySuccess', null);
    case UPDATE_APPLICANTRECRUITMENT_AGENCY_SUCCESS:
      return state.set('isLoading', false).set('createApplicantRecruitmentAgencySuccess', true);
    case UPDATE_APPLICANTRECRUITMENT_AGENCY_FAILURE:
      return state.set('isLoading', false).set('createApplicantRecruitmentAgencySuccess', false);
    case DELETE_APPLICANTRECRUITMENT_AGENCY:
      return state.set('isLoading', true).set('createApplicantRecruitmentAgencySuccess', null);
    case DELETE_APPLICANTRECRUITMENT_AGENCY_SUCCESS:
      return state.set('isLoading', false).set('createApplicantRecruitmentAgencySuccess', true);
    case DELETE_APPLICANTRECRUITMENT_AGENCY_FAILURE:
      return state.set('isLoading', false).set('createApplicantRecruitmentAgencySuccess', false);
    // hết đăng tuyển
    case POST_SWITCH_CANDIDATE:
      return state.set('isLoading', true).set('postSwitchCandidateSuccess', true);
    case POST_SWITCH_CANDIDATE_SUCCESS:
      return state.set('isLoading', true).set('postSwitchCandidateSuccess', false);
    case POST_SWITCH_CANDIDATE_FAILURE:
      return state.set('isLoading', false).set('postSwitchCandidateSuccess', false);
    case UPDATE_RECRUIMENTWAVE:
      return state.set('isLoading', true).set('updateRecruitmentWaveSuccess', null);
    case UPDATE_RECRUIMENTWAVE_SUCCESS:
      return state.set('isLoading', false).set('updateRecruitmentWaveSuccess', true);
    case UPDATE_RECRUIMENTWAVE_FAILURE:
      return state.set('isLoading', false).set('updateRecruitmentWaveSuccess', false);
    case DELETE_RECRUIMENTWAVE:
      return state.set('isLoading', true).set('deleteRecruitmentWaveSuccess', null);
    case DELETE_RECRUIMENTWAVE_SUCCESS:
      return state.set('isLoading', false).set('deleteRecruitmentWaveSuccess', true);
    case DELETE_RECRUIMENTWAVE_FAILURE:
      return state.set('isLoading', false).set('deleteRecruitmentWaveSuccess', false);
    case GET_HUMAN_RESOURCE_SUCCESS:
      return state.set('humanResource', action.data).set('fieldRole', action.fields);
    case GET_ROLE_GROUP_SUCCESS:
      return state.set('roleGroups', action.data);

    case CREATE_ROUNDRECRUIMENT:
      return { ...state, loading: true, updateRoundSuccess: false };
    case CREATE_ROUNDRECRUIMENT_SUCCESS:
      return { ...state, loading: false, updateRoundSuccess: true };
    case CREATE_ROUNDRECRUIMENT_FAILURE:
      return { ...state, loading: false, updateRoundSuccess: false };
    case UPDATE_ROUNDRECRUIMENT:
      return { ...state, loading: true, updateRoundSuccess: false };
    case UPDATE_ROUNDRECRUIMENT_SUCCESS:
      return { ...state, loading: false, updateRoundSuccess: true };
    case UPDATE_ROUNDRECRUIMENT_FAILURE:
      return { ...state, loading: false, updateRoundSuccess: false };
    case DELETE_ROUNDRECRUIMENT:
      return { ...state, loading: true, updateRoundSuccess: false };
    case DELETE_ROUNDRECRUIMENT_SUCCESS:
      return { ...state, loading: false, updateRoundSuccess: true };
    case DELETE_ROUNDRECRUIMENT_FAILURE:
      return { ...state, loading: false, updateRoundSuccess: false };
    case CREATE_SUBJECTRECRUIMENT:
      return { ...state, loading: true, updateSubjectSuccess: false };
    case CREATE_SUBJECTRECRUIMENT_SUCCESS:
      return { ...state, loading: false, updateSubjectSuccess: true };
    case CREATE_SUBJECTRECRUIMENT_FAILURE:
      return { ...state, loading: false, updateSubjectSuccess: false };
    case UPDATE_SUBJECTRECRUIMENT:
      return { ...state, loading: true, updateSubjectSuccess: false };
    case UPDATE_SUBJECTRECRUIMENT_SUCCESS:
      return { ...state, loading: false, updateSubjectSuccess: true };
    case UPDATE_SUBJECTRECRUIMENT_FAILURE:
      return { ...state, loading: false, updateSubjectSuccess: false };
    case DELETE_SUBJECTRECRUIMENT:
      return { ...state, loading: true, updateSubjectSuccess: false };
    case DELETE_SUBJECTRECRUIMENT_SUCCESS:
      return { ...state, loading: false, updateSubjectSuccess: true };
    case DELETE_SUBJECTRECRUIMENT_FAILURE:
      return { ...state, loading: false, updateSubjectSuccess: false };

    case UPDATE_APPLICANTRECRUITMENT:
      return { ...state, loading: true, updateApplicantSuccess: false };
    case UPDATE_APPLICANTRECRUITMENT_SUCCESS:
      return { ...state, loading: false, updateApplicantSuccess: true };
    case UPDATE_APPLICANTRECRUITMENT_FAILURE:
      return { ...state, loading: false, updateApplicantSuccess: false };
    case DELETE_APPLICANTRECRUITMENT:
      return { ...state, loading: true, updateApplicantSuccess: false };
    case DELETE_APPLICANTRECRUITMENT_SUCCESS:
      return { ...state, loading: false, updateApplicantSuccess: true };
    case DELETE_APPLICANTRECRUITMENT_FAILURE:
      return { ...state, loading: false, updateApplicantSuccess: false };

    // case UPDATE_TESTAPPLICANTRECRUITMENT:
    //   return { ...state, loading: true, updateTestApplicantSuccess: false };
    // case UPDATE_TESTAPPLICANTRECRUITMENT_SUCCESS:
    //   return { ...state, loading: false, updateTestApplicantSuccess: true };
    // case UPDATE_TESTAPPLICANTRECRUITMENT_FAILURE:
    //   return { ...state, loading: false, updateTestApplicantSuccess: false };
    // case DELETE_TESTAPPLICANTRECRUITMENT:
    //   return { ...state, loading: true, updateTestApplicantSuccess: false };
    // case DELETE_TESTAPPLICANTRECRUITMENT_SUCCESS:
    //   return { ...state, loading: false, updateTestApplicantSuccess: true };
    // case DELETE_TESTAPPLICANTRECRUITMENT_FAILURE:
    //   return { ...state, loading: false, updateTestApplicantSuccess: false };

    default:
      return state;
  }
}

export default recruitmentWavePageReducer;
