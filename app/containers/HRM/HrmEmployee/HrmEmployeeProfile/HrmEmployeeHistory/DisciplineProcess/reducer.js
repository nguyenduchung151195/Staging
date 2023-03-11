/*
 *
 * DisciplinePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_DISCIPLINE,
  CREATE_DISCIPLINE_SUCCESS,
  CREATE_DISCIPLINE_FAILURE,
  UPDATE_DISCIPLINE,
  UPDATE_DISCIPLINE_SUCCESS,
  UPDATE_DISCIPLINE_FAILURE,
  DELETE_DISCIPLINE,
  DELETE_DISCIPLINE_SUCCESS,
  DELETE_DISCIPLINE_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createDisciplineSuccess: null,
  updateDisciplineSuccess: null,
  deleteDisciplineSuccess: null,
  reload: false,
});

function disciplinePageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_DISCIPLINE:
      return state.set('isLoading', true).set('createDisciplineSuccess', null).set('reload', false);
    case CREATE_DISCIPLINE_SUCCESS:
      return state.set('isLoading', false).set('createDisciplineSuccess', true).set('reload', true);
    case CREATE_DISCIPLINE_FAILURE:
      return state.set('isLoading', false).set('createDisciplineSuccess', false).set('reload', false);
    case UPDATE_DISCIPLINE:
      return state.set('isLoading', true).set('updateDisciplineSuccess', null).set('reload', false);
    case UPDATE_DISCIPLINE_SUCCESS:
      return state.set('isLoading', false).set('updateDisciplineSuccess', true).set('reload', true);
    case UPDATE_DISCIPLINE_FAILURE:
      return state.set('isLoading', false).set('updateDisciplineSuccess', false).set('reload', false);
    case DELETE_DISCIPLINE:
      return state.set('isLoading', true).set('deleteDisciplineSuccess', null).set('reload', false);
    case DELETE_DISCIPLINE_SUCCESS:
      return state.set('isLoading', false).set('deleteDisciplineSuccess', true).set('reload', true);
    case DELETE_DISCIPLINE_FAILURE:
      return state.set('isLoading', false).set('deleteDisciplineSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default disciplinePageReducer;
