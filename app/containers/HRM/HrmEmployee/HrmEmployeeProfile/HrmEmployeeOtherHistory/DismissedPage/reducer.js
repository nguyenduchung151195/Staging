/*
 *
 * DismissedPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_DISMISSED,
  CREATE_DISMISSED_SUCCESS,
  CREATE_DISMISSED_FAILURE,
  UPDATE_DISMISSED,
  UPDATE_DISMISSED_SUCCESS,
  UPDATE_DISMISSED_FAILURE,
  DELETE_DISMISSED,
  DELETE_DISMISSED_SUCCESS,
  DELETE_DISMISSED_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createDismissedSuccess: null,
  updateDismissedSuccess: null,
  deleteDismissedSuccess: null,
  reload: false,
});

function dismissedPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_DISMISSED:
      return state.set('isLoading', true).set('createDismissedSuccess', null).set('reload', false);
    case CREATE_DISMISSED_SUCCESS:
      return state.set('isLoading', false).set('createDismissedSuccess', true).set('reload', true);
    case CREATE_DISMISSED_FAILURE:
      return state.set('isLoading', false).set('createDismissedSuccess', false).set('reload', false);
    case UPDATE_DISMISSED:
      return state.set('isLoading', true).set('updateDismissedSuccess', null).set('reload', false);
    case UPDATE_DISMISSED_SUCCESS:
      return state.set('isLoading', false).set('updateDismissedSuccess', true).set('reload', true);
    case UPDATE_DISMISSED_FAILURE:
      return state.set('isLoading', false).set('updateDismissedSuccess', false).set('reload', false);
    case DELETE_DISMISSED:
      return state.set('isLoading', true).set('deleteDismissedSuccess', null).set('reload', false);
    case DELETE_DISMISSED_SUCCESS:
      return state.set('isLoading', false).set('deleteDismissedSuccess', true).set('reload', true);
    case DELETE_DISMISSED_FAILURE:
      return state.set('isLoading', false).set('deleteDismissedSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default dismissedPageReducer;
