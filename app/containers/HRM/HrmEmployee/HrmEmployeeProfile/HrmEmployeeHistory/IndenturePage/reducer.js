/*
 *
 * IndenturePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_INDENTURE,
  CREATE_INDENTURE_SUCCESS,
  CREATE_INDENTURE_FAILURE,
  UPDATE_INDENTURE,
  UPDATE_INDENTURE_SUCCESS,
  UPDATE_INDENTURE_FAILURE,
  DELETE_INDENTURE,
  DELETE_INDENTURE_SUCCESS,
  DELETE_INDENTURE_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createIndentureSuccess: null,
  updateIndentureSuccess: null,
  deleteIndentureSuccess: null,
  reload: false,
});

function indenturePageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_INDENTURE:
      return state.set('isLoading', true).set('createIndentureSuccess', null).set('reload', false);
    case CREATE_INDENTURE_SUCCESS:
      return state.set('isLoading', false).set('createIndentureSuccess', true).set('reload', true);
    case CREATE_INDENTURE_FAILURE:
      return state.set('isLoading', false).set('createIndentureSuccess', false).set('reload', false);
    case UPDATE_INDENTURE:
      return state.set('isLoading', true).set('updateIndentureSuccess', null).set('reload', false);
    case UPDATE_INDENTURE_SUCCESS:
      return state.set('isLoading', false).set('updateIndentureSuccess', true).set('reload', true);
    case UPDATE_INDENTURE_FAILURE:
      return state.set('isLoading', false).set('updateIndentureSuccess', false).set('reload', false);
    case DELETE_INDENTURE:
      return state.set('isLoading', true).set('deleteIndentureSuccess', null).set('reload', false);
    case DELETE_INDENTURE_SUCCESS:
      return state.set('isLoading', false).set('deleteIndentureSuccess', true).set('reload', true);
    case DELETE_INDENTURE_FAILURE:
      return state.set('isLoading', false).set('deleteIndentureSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default indenturePageReducer;
