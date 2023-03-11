/*
 *
 * MaternityPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_MATERNITY,
  CREATE_MATERNITY_SUCCESS,
  CREATE_MATERNITY_FAILURE,
  UPDATE_MATERNITY,
  UPDATE_MATERNITY_SUCCESS,
  UPDATE_MATERNITY_FAILURE,
  DELETE_MATERNITY,
  DELETE_MATERNITY_SUCCESS,
  DELETE_MATERNITY_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createMaternitySuccess: null,
  updateMaternitySuccess: null,
  deleteMaternitySuccess: null,
  reload: false,
});

function maternityPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_MATERNITY:
      return state.set('isLoading', true).set('createMaternitySuccess', null).set('reload', false);
    case CREATE_MATERNITY_SUCCESS:
      return state.set('isLoading', false).set('createMaternitySuccess', true).set('reload', true);
    case CREATE_MATERNITY_FAILURE:
      return state.set('isLoading', false).set('createMaternitySuccess', false).set('reload', false);
    case UPDATE_MATERNITY:
      return state.set('isLoading', true).set('updateMaternitySuccess', null).set('reload', false);
    case UPDATE_MATERNITY_SUCCESS:
      return state.set('isLoading', false).set('updateMaternitySuccess', true).set('reload', true);
    case UPDATE_MATERNITY_FAILURE:
      return state.set('isLoading', false).set('updateMaternitySuccess', false).set('reload', false);
    case DELETE_MATERNITY:
      return state.set('isLoading', true).set('deleteMaternitySuccess', null).set('reload', false);
    case DELETE_MATERNITY_SUCCESS:
      return state.set('isLoading', false).set('deleteMaternitySuccess', true).set('reload', true);
    case DELETE_MATERNITY_FAILURE:
      return state.set('isLoading', false).set('deleteMaternitySuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default maternityPageReducer;
