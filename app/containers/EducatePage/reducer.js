/*
 *
 * EducatePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION, CREATE_EDUCATE,
  CREATE_EDUCATE_SUCCESS,
  CREATE_EDUCATE_FAILURE,
  UPDATE_EDUCATE,
  UPDATE_EDUCATE_SUCCESS,
  UPDATE_EDUCATE_FAILURE,
  DELETE_EDUCATE,
  DELETE_EDUCATE_SUCCESS,
  DELETE_EDUCATE_FAILURE,
  CREATE_EDUCATE_ROUND,
  CREATE_EDUCATE_ROUND_SUCCESS,
  CREATE_EDUCATE_ROUND_FAILURE,
  UPDATE_EDUCATE_ROUND,
  UPDATE_EDUCATE_ROUND_SUCCESS,
  UPDATE_EDUCATE_ROUND_FAILURE,
  DELETE_EDUCATE_ROUND,
  DELETE_EDUCATE_ROUND_SUCCESS,
  DELETE_EDUCATE_ROUND_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createEducateSuccess: null,
  updateEducateSuccess: null,
  deleteEducateSuccess: null,
  createEducateRoundSuccess: null,
  reload: false,
});

function educatePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CREATE_EDUCATE:
      return state.set('isLoading', true).set('createEducateSuccess', null).set('reload', false);
    case CREATE_EDUCATE_SUCCESS:
      return state.set('isLoading', false).set('createEducateSuccess', true).set('reload', true);
    case CREATE_EDUCATE_FAILURE:
      return state.set('isLoading', false).set('createEducateSuccess', false).set('reload', false);
    case UPDATE_EDUCATE:
      return state.set('isLoading', true).set('updateEducateSuccess', null).set('reload', false);
    case UPDATE_EDUCATE_SUCCESS:
      return state.set('isLoading', false).set('updateEducateSuccess', true).set('reload', true);
    case UPDATE_EDUCATE_FAILURE:
      return state.set('isLoading', false).set('updateEducateSuccess', false).set('reload', false);
    case DELETE_EDUCATE:
      return state.set('isLoading', true).set('deleteEducateSuccess', null).set('reload', false);
    case DELETE_EDUCATE_SUCCESS:
      return state.set('isLoading', false).set('deleteEducateSuccess', true).set('reload', true);
    case DELETE_EDUCATE_FAILURE:
      return state.set('isLoading', false).set('deleteEducateSuccess', false).set('reload', false);

    case CREATE_EDUCATE_ROUND:
      return state.set('isLoading', true).set('createEducateRoundSuccess', null).set('reload', false);
    case CREATE_EDUCATE_ROUND_SUCCESS:
      return state.set('isLoading', false).set('createEducateRoundSuccess', true).set('reload', true);
    case CREATE_EDUCATE_ROUND_FAILURE:
      return state.set('isLoading', false).set('createEducateRoundSuccess', false).set('reload', false);
    case UPDATE_EDUCATE_ROUND:
      return state.set('isLoading', true).set('createEducateRoundSuccess', null).set('reload', false);
    case UPDATE_EDUCATE_ROUND_SUCCESS:
      return state.set('isLoading', false).set('createEducateRoundSuccess', true).set('reload', true);
    case UPDATE_EDUCATE_ROUND_FAILURE:
      return state.set('isLoading', false).set('createEducateRoundSuccess', false).set('reload', false);
    case DELETE_EDUCATE_ROUND:
      return state.set('isLoading', true).set('createEducateRoundSuccess', null).set('reload', false);
    case DELETE_EDUCATE_ROUND_SUCCESS:
      return state.set('isLoading', false).set('createEducateRoundSuccess', true).set('reload', true);
    case DELETE_EDUCATE_ROUND_FAILURE:
      return state.set('isLoading', false).set('createEducateRoundSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default educatePageReducer;
