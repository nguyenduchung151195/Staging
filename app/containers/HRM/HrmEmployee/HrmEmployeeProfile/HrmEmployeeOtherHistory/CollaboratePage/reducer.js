/*
 *
 * CollaboratePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_COLLABORATE,
  CREATE_COLLABORATE_SUCCESS,
  CREATE_COLLABORATE_FAILURE,
  UPDATE_COLLABORATE,
  UPDATE_COLLABORATE_SUCCESS,
  UPDATE_COLLABORATE_FAILURE,
  DELETE_COLLABORATE,
  DELETE_COLLABORATE_SUCCESS,
  DELETE_COLLABORATE_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createCollaborateSuccess: null,
  updateCollaborateSuccess: null,
  deleteCollaborateSuccess: null,
  reload: false,
});

function CollaboratePageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_COLLABORATE:
      return state.set('isLoading', true).set('createCollaborateSuccess', null).set('reload', false);
    case CREATE_COLLABORATE_SUCCESS:
      return state.set('isLoading', false).set('createCollaborateSuccess', true).set('reload', true);
    case CREATE_COLLABORATE_FAILURE:
      return state.set('isLoading', false).set('createCollaborateSuccess', false).set('reload', false);
    case UPDATE_COLLABORATE:
      return state.set('isLoading', true).set('updateCollaborateSuccess', null).set('reload', false);
    case UPDATE_COLLABORATE_SUCCESS:
      return state.set('isLoading', false).set('updateCollaborateSuccess', true).set('reload', true);
    case UPDATE_COLLABORATE_FAILURE:
      return state.set('isLoading', false).set('updateCollaborateSuccess', false).set('reload', false);
    case DELETE_COLLABORATE:
      return state.set('isLoading', true).set('deleteCollaborateSuccess', null).set('reload', false);
    case DELETE_COLLABORATE_SUCCESS:
      return state.set('isLoading', false).set('deleteCollaborateSuccess', true).set('reload', true);
    case DELETE_COLLABORATE_FAILURE:
      return state.set('isLoading', false).set('deleteCollaborateSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default CollaboratePageReducer;
