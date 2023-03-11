/*
 *
 * ConfigHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_ROUND,
  CREATE_ROUND_SUCCESS,
  CREATE_ROUND_FAILURE,
  CREATE_QUESTION,
  CREATE_QUESTION_SUCCESS,
  CREATE_QUESTION_FAILURE,
  CREATE_SUBJECT,
  CREATE_SUBJECT_FAILURE,
  CREATE_SUBJECT_SUCCESS,
  CREATE_VACATION,
  CREATE_VACATION_FAILURE,
  CREATE_VACATION_SUCCESS,
  UPDATE_VACATION,
  UPDATE_VACATION_SUCCESS,
  UPDATE_VACATION_FAILURE,
  DELETE_VACATION,
  DELETE_VACATION_SUCCESS,
  DELETE_VACATION_FAILURE,
  UPDATE_ROUND,
  UPDATE_ROUND_SUCCESS,
  UPDATE_ROUND_FAILURE,
  UPDATE_QUESTION,
  UPDATE_QUESTION_SUCCESS,
  UPDATE_QUESTION_FAILURE,
  DELETE_ROUND,
  DELETE_ROUND_SUCCESS,
  DELETE_ROUND_FAILURE,
  DELETE_QUESTION,
  DELETE_QUESTION_SUCCESS,
  DELETE_QUESTION_FAILURE,
  UPDATE_SUBJECT,
  UPDATE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_FAILURE,
  DELETE_SUBJECT,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILURE,
  UPDATE_RECRUITMENT_AGENCY_SUCCESS,
  UPDATE_RECRUITMENT_AGENCY_FAILURE,
  UPDATE_RECRUITMENT_AGENCY,
  CREATE_RECRUITMENT_AGENCY,
  CREATE_RECRUITMENT_AGENCY_SUCCESS,
  CREATE_RECRUITMENT_AGENCY_FAILURE,
  DELETE_RECRUITMENT_AGENCY,
  DELETE_RECRUITMENT_AGENCY_SUCCESS,
  DELETE_RECRUITMENT_AGENCY_FAILURE,
} from './constants';

export const initialState = fromJS({
  data: '',
  questionData: {},
  loading: false,
  error: false,
  success: false,
});

function configSalaryReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_ROUND:
      return state.set('loading', true).set('success', false);
    case CREATE_ROUND_SUCCESS:
      return state.set('loading', false).set('success', true);
    case CREATE_ROUND_FAILURE:
      return state.set('loading', false).set('success', false);
    case CREATE_QUESTION:
      return state.set('loading', true).set('success', false);
    case CREATE_QUESTION_SUCCESS:
      return state.set('loading', false).set('success', true);
    case CREATE_QUESTION_FAILURE:
      return state.set('loading', false).set('success', false);
    case CREATE_SUBJECT:
      return state.set('loading', true).set('success', false);
    case CREATE_SUBJECT_SUCCESS:
      return state.set('loading', false).set('success', true);
    case CREATE_SUBJECT_FAILURE:
      return state.set('loading', false).set('success', false);
    case CREATE_VACATION:
      return state.set('loading', true).set('success', false);
    case CREATE_VACATION_SUCCESS:
      return state.set('loading', false).set('success', true);
    case CREATE_VACATION_FAILURE:
      return state.set('loading', false).set('success', false);
    case UPDATE_VACATION:
      return state.set('loading', true).set('success', false);
    case UPDATE_VACATION_SUCCESS:
      return state.set('loading', false).set('success', true);
    case UPDATE_VACATION_FAILURE:
      return state.set('loading', false).set('success', false);
    case UPDATE_ROUND:
      return state.set('loading', true).set('success', false);
    case UPDATE_ROUND_SUCCESS:
      return state.set('loading', false).set('success', true);
    case UPDATE_ROUND_FAILURE:
      return state.set('loading', false).set('success', false);
    case UPDATE_QUESTION:
      return state.set('loading', true).set('success', false);
    case UPDATE_QUESTION_SUCCESS:
      return state.set('loading', false).set('success', true);
    case UPDATE_QUESTION_FAILURE:
      return state.set('loading', false).set('success', false);
    case DELETE_VACATION:
      return state.set('loading', true).set('success', false);
    case DELETE_VACATION_SUCCESS:
      return state.set('loading', false).set('success', true);
    case DELETE_VACATION_FAILURE:
      return state.set('loading', false).set('success', false);
    case DELETE_ROUND:
      return state.set('loading', true).set('success', false);
    case DELETE_ROUND_SUCCESS:
      return state.set('loading', false).set('success', true);
    case DELETE_ROUND_FAILURE:
      return state.set('loading', false).set('success', false);
    case UPDATE_SUBJECT:
      return state.set('loading', true).set('success', false);
    case UPDATE_SUBJECT_SUCCESS:
      return state.set('loading', false).set('success', true);
    case UPDATE_SUBJECT_FAILURE:
      return state.set('loading', false).set('success', false);
    case DELETE_SUBJECT:
      return state.set('loading', true).set('success', false);
    case DELETE_SUBJECT_SUCCESS:
      return state.set('loading', false).set('success', true);
    case DELETE_SUBJECT_FAILURE:
      return state.set('loading', false).set('success', false);
    case DELETE_QUESTION:
      return state.set('loading', true).set('success', false);
    case DELETE_QUESTION_SUCCESS:
      return state.set('loading', false).set('success', true);
    case DELETE_QUESTION_FAILURE:
      return state.set('loading', false).set('success', false);
    //tuyển dụng
    case UPDATE_RECRUITMENT_AGENCY:
      return state.set('loading', true).set('success', false);
    case UPDATE_RECRUITMENT_AGENCY_SUCCESS:
      return state.set('loading', false).set('success', true);
    case UPDATE_RECRUITMENT_AGENCY_FAILURE:
      return state.set('loading', false).set('success', false);
    case CREATE_RECRUITMENT_AGENCY:
      return state.set('loading', true).set('success', false);
    case CREATE_RECRUITMENT_AGENCY_SUCCESS:
      return state.set('loading', false).set('success', true);
    case CREATE_RECRUITMENT_AGENCY_FAILURE:
      return state.set('loading', false).set('success', false);
    case DELETE_RECRUITMENT_AGENCY:
      return state.set('loading', true).set('success', false);
    case DELETE_RECRUITMENT_AGENCY_SUCCESS:
      return state.set('loading', false).set('success', true);
    case DELETE_RECRUITMENT_AGENCY_FAILURE:
      return state.set('loading', false).set('success', false);
    default:
      return state;
  }
}

export default configSalaryReducer;
