/*
 *
 * EducationPage reducer
 *
 */

import { fromJS } from 'immutable';
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

export const initialState = fromJS({
  isLoading: false,
  createEducationSuccess: null,
  updateEducationSuccess: null,
  deleteEducationSuccess: null,
  reload: false,
});

function educationPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_EDUCATION:
      return state.set('isLoading', true).set('createEducationSuccess', null).set('reload', false);
    case CREATE_EDUCATION_SUCCESS:
      return state.set('isLoading', false).set('createEducationSuccess', true).set('reload', true);
    case CREATE_EDUCATION_FAILURE:
      return state.set('isLoading', false).set('createEducationSuccess', false).set('reload', false);
    case UPDATE_EDUCATION:
      return state.set('isLoading', true).set('updateEducationSuccess', null).set('reload', false);
    case UPDATE_EDUCATION_SUCCESS:
      return state.set('isLoading', false).set('updateEducationSuccess', true).set('reload', true);
    case UPDATE_EDUCATION_FAILURE:
      return state.set('isLoading', false).set('updateEducationSuccess', false).set('reload', false);
    case DELETE_EDUCATION:
      return state.set('isLoading', true).set('deleteEducationSuccess', null).set('reload', false);
    case DELETE_EDUCATION_SUCCESS:
      return state.set('isLoading', false).set('deleteEducationSuccess', true).set('reload', true);
    case DELETE_EDUCATION_FAILURE:
      return state.set('isLoading', false).set('deleteEducationSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default educationPageReducer;
