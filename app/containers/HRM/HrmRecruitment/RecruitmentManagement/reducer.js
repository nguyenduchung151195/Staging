/*
 *
 * RecruitmentPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_RECRUITMENT,
  CREATE_RECRUITMENT_SUCCESS,
  CREATE_RECRUITMENT_FAILURE,
  UPDATE_RECRUITMENT,
  UPDATE_RECRUITMENT_SUCCESS,
  UPDATE_RECRUITMENT_FAILURE,
  DELETE_RECRUITMENT,
  DELETE_RECRUITMENT_SUCCESS,
  DELETE_RECRUITMENT_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createRecruitmentSuccess: null,
  updateRecruitmentSuccess: null,
  deleteRecruitmentSuccess: null,
});

function salaryPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_RECRUITMENT:
      return state.set('isLoading', true).set('createRecruitmentSuccess', null);
    case CREATE_RECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('createRecruitmentSuccess', true);
    case CREATE_RECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('createRecruitmentSuccess', false);
    case UPDATE_RECRUITMENT:
      return state.set('isLoading', true).set('updateRecruitmentSuccess', null);
    case UPDATE_RECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('updateRecruitmentSuccess', true);
    case UPDATE_RECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('updateRecruitmentSuccess', false);
    case DELETE_RECRUITMENT:
      return state.set('isLoading', true).set('deleteRecruitmentSuccess', null);
    case DELETE_RECRUITMENT_SUCCESS:
      return state.set('isLoading', false).set('deleteRecruitmentSuccess', true);
    case DELETE_RECRUITMENT_FAILURE:
      return state.set('isLoading', false).set('deleteRecruitmentSuccess', false);
    default:
      return state;
  }
}

export default salaryPageReducer;
