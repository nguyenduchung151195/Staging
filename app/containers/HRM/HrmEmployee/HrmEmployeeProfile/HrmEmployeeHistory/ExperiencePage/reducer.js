/*
 *
 * ExperiencePage reducer
 *
 */

import { fromJS } from 'immutable';
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

export const initialState = fromJS({
  isLoading: false,
  createExperienceSuccess: null,
  updateExperienceSuccess: null,
  deleteExperienceSuccess: null,
  reload: false,
});

function experiencePageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_EXPERIENCE:
      return state.set('isLoading', true).set('createExperienceSuccess', null).set('reload', false);
    case CREATE_EXPERIENCE_SUCCESS:
      return state.set('isLoading', false).set('createExperienceSuccess', true).set('reload', true);
    case CREATE_EXPERIENCE_FAILURE:
      return state.set('isLoading', false).set('createExperienceSuccess', false).set('reload', false);
    case UPDATE_EXPERIENCE:
      return state.set('isLoading', true).set('updateExperienceSuccess', null).set('reload', false);
    case UPDATE_EXPERIENCE_SUCCESS:
      return state.set('isLoading', false).set('updateExperienceSuccess', true).set('reload', true);
    case UPDATE_EXPERIENCE_FAILURE:
      return state.set('isLoading', false).set('updateExperienceSuccess', false).set('reload', false);
    case DELETE_EXPERIENCE:
      return state.set('isLoading', true).set('deleteExperienceSuccess', null).set('reload', false);
    case DELETE_EXPERIENCE_SUCCESS:
      return state.set('isLoading', false).set('deleteExperienceSuccess', true).set('reload', true);
    case DELETE_EXPERIENCE_FAILURE:
      return state.set('isLoading', false).set('deleteExperienceSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default experiencePageReducer;
