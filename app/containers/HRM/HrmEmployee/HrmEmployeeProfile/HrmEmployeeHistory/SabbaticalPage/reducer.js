/*
 *
 * SabbaticalPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_SABBATICAL,
  CREATE_SABBATICAL_SUCCESS,
  CREATE_SABBATICAL_FAILURE,
  UPDATE_SABBATICAL,
  UPDATE_SABBATICAL_SUCCESS,
  UPDATE_SABBATICAL_FAILURE,
  DELETE_SABBATICAL,
  DELETE_SABBATICAL_SUCCESS,
  DELETE_SABBATICAL_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createSabbaticalSuccess: null,
  updateSabbaticalSuccess: null,
  deleteSabbaticalSuccess: null,
  reload: false,
});

function sabbaticalPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SABBATICAL:
      return state.set('isLoading', true).set('createSabbaticalSuccess', null).set('reload', false);
    case CREATE_SABBATICAL_SUCCESS:
      return state.set('isLoading', false).set('createSabbaticalSuccess', true).set('reload', true);
    case CREATE_SABBATICAL_FAILURE:
      return state.set('isLoading', false).set('createSabbaticalSuccess', false).set('reload', false);
    case UPDATE_SABBATICAL:
      return state.set('isLoading', true).set('updateSabbaticalSuccess', null).set('reload', false);
    case UPDATE_SABBATICAL_SUCCESS:
      return state.set('isLoading', false).set('updateSabbaticalSuccess', true).set('reload', true);
    case UPDATE_SABBATICAL_FAILURE:
      return state.set('isLoading', false).set('updateSabbaticalSuccess', false).set('reload', false);
    case DELETE_SABBATICAL:
      return state.set('isLoading', true).set('deleteSabbaticalSuccess', null).set('reload', false);
    case DELETE_SABBATICAL_SUCCESS:
      return state.set('isLoading', false).set('deleteSabbaticalSuccess', true).set('reload', true);
    case DELETE_SABBATICAL_FAILURE:
      return state.set('isLoading', false).set('deleteSabbaticalSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default sabbaticalPageReducer;
