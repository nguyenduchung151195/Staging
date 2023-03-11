/*
 *
 * ProcessPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_PROCESS,
  CREATE_PROCESS_SUCCESS,
  CREATE_PROCESS_FAILURE,
  UPDATE_PROCESS,
  UPDATE_PROCESS_SUCCESS,
  UPDATE_PROCESS_FAILURE,
  DELETE_PROCESS,
  DELETE_PROCESS_SUCCESS,
  DELETE_PROCESS_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createProcessSuccess: null,
  updateProcessSuccess: null,
  deleteProcessSuccess: null,
  reload: false,
});

function processPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROCESS:
      return state.set('isLoading', true).set('createProcessSuccess', null).set('reload', false);
    case CREATE_PROCESS_SUCCESS:
      return state.set('isLoading', false).set('createProcessSuccess', true).set('reload', true);
    case CREATE_PROCESS_FAILURE:
      return state.set('isLoading', false).set('createProcessSuccess', false).set('reload', false);
    case UPDATE_PROCESS:
      return state.set('isLoading', true).set('updateProcessSuccess', null).set('reload', false);
    case UPDATE_PROCESS_SUCCESS:
      return state.set('isLoading', false).set('updateProcessSuccess', true).set('reload', true);
    case UPDATE_PROCESS_FAILURE:
      return state.set('isLoading', false).set('updateProcessSuccess', false).set('reload', false);
    case DELETE_PROCESS:
      return state.set('isLoading', true).set('deleteProcessSuccess', null).set('reload', false);
    case DELETE_PROCESS_SUCCESS:
      return state.set('isLoading', false).set('deleteProcessSuccess', true).set('reload', true);
    case DELETE_PROCESS_FAILURE:
      return state.set('isLoading', false).set('deleteProcessSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default processPageReducer;
