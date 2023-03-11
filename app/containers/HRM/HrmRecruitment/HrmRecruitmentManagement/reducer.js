/*
 *
 * RecruitmentManagementPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  CREATE_RECRUITMENTMANAGEMENT,
  CREATE_RECRUITMENTMANAGEMENT_SUCCESS,
  CREATE_RECRUITMENTMANAGEMENT_FAILURE,
  UPDATE_RECRUITMENTMANAGEMENT,
  UPDATE_RECRUITMENTMANAGEMENT_SUCCESS,
  UPDATE_RECRUITMENTMANAGEMENT_FAILURE,
  DELETE_RECRUITMENTMANAGEMENT,
  DELETE_RECRUITMENTMANAGEMENT_SUCCESS,
  DELETE_RECRUITMENTMANAGEMENT_FAILURE,
  GET_COUNT_HRM_BY_ROLE_SUCCESS,
  GET_POSITION_VACATION_SUCCESS,
  GET_HUMAN_RESOURCE_SUCCESS,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createRecruitmentManagementSuccess: null,
  updateRecruitmentManagementSuccess: null,
  deleteRecruitmentManagementSuccess: null,
  tab: 0,
  countEmployee: 0,
  fieldRole: [],
  humanResource: [],
  positionVacation: [],
});

function recruitmentManagementPageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case CREATE_RECRUITMENTMANAGEMENT:
      return state.set('isLoading', true).set('createRecruitmentManagementSuccess', null);
    case CREATE_RECRUITMENTMANAGEMENT_SUCCESS:
      return state.set('isLoading', false).set('createRecruitmentManagementSuccess', true);
    case CREATE_RECRUITMENTMANAGEMENT_FAILURE:
      return state.set('isLoading', false).set('createRecruitmentManagementSuccess', false);
    case UPDATE_RECRUITMENTMANAGEMENT:
      return state.set('isLoading', true).set('createRecruitmentManagementSuccess', null);
    case UPDATE_RECRUITMENTMANAGEMENT_SUCCESS:
      return state.set('isLoading', false).set('createRecruitmentManagementSuccess', true);
    case UPDATE_RECRUITMENTMANAGEMENT_FAILURE:
      return state.set('isLoading', false).set('createRecruitmentManagementSuccess', false);
    case DELETE_RECRUITMENTMANAGEMENT:
      return state.set('isLoading', true).set('deleteRecruitmentManagementSuccess', null);
    case DELETE_RECRUITMENTMANAGEMENT_SUCCESS:
      return state.set('isLoading', false).set('deleteRecruitmentManagementSuccess', true);
    case DELETE_RECRUITMENTMANAGEMENT_FAILURE:
      return state.set('isLoading', false).set('deleteRecruitmentManagementSuccess', false);

    case GET_COUNT_HRM_BY_ROLE_SUCCESS:
      return state.set('countEmployee', action.data);
    case GET_HUMAN_RESOURCE_SUCCESS:
      return state.set('humanResource', action.data).set('fieldRole', action.fields);
    case GET_POSITION_VACATION_SUCCESS:
      return state.set('positionVacation', action.data);
    default:
      return state;
  }
}

export default recruitmentManagementPageReducer;
