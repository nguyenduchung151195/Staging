/*
 *
 * AddRecruitmentWave reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  CREATE_RECRUITMENTMANAGEMENT,
  CREATE_RECRUITMENTMANAGEMENT_SUCCESS,
  CREATE_RECRUITMENTMANAGEMENT_FAILURE,
  POST_SWITCH_CANDIDATE,
  POST_SWITCH_CANDIDATE_SUCCESS,
  POST_SWITCH_CANDIDATE_FAILURE,
} from './constants';

export const initialState = fromJS({});

function addRecruitmentWave(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CREATE_RECRUITMENTMANAGEMENT:
      return state.set('isLoading', true).set('createRecruitmentManagementSuccess', null).set('error', undefined);
    case CREATE_RECRUITMENTMANAGEMENT_SUCCESS:
      return state.set('isLoading', false).set('createRecruitmentManagementSuccess', true).set('error', false);
    case CREATE_RECRUITMENTMANAGEMENT_FAILURE:
      return state.set('isLoading', false).set('createRecruitmentManagementSuccess', false).set('error', true);
    case POST_SWITCH_CANDIDATE:
      return state
        .set('isLoading', true)
        .set('postSwitchCandidateSuccess', true)
        .set('error', undefined);
    case POST_SWITCH_CANDIDATE_SUCCESS:
      return state
        .set('isLoading', true)
        .set('postSwitchCandidateSuccess', false)
        .set('error', false);
    case POST_SWITCH_CANDIDATE_FAILURE:
      return state
        .set('isLoading', false)
        .set('postSwitchCandidateSuccess', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addRecruitmentWave;
