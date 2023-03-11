/*
 *
 * RelationPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_RELATION,
  CREATE_RELATION_SUCCESS,
  CREATE_RELATION_FAILURE,
  UPDATE_RELATION,
  UPDATE_RELATION_SUCCESS,
  UPDATE_RELATION_FAILURE,
  DELETE_RELATION,
  DELETE_RELATION_SUCCESS,
  DELETE_RELATION_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createRelationSuccess: null,
  updateRelationSuccess: null,
  deleteRelationSuccess: null,
  reload: false,
});

function relationPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_RELATION:
      return state.set('isLoading', true).set('createRelationSuccess', null).set('reload', false);
    case CREATE_RELATION_SUCCESS:
      return state.set('isLoading', false).set('createRelationSuccess', true).set('reload', true);
    case CREATE_RELATION_FAILURE:
      return state.set('isLoading', false).set('createRelationSuccess', false).set('reload', false);
    case UPDATE_RELATION:
      return state.set('isLoading', true).set('updateRelationSuccess', null).set('reload', false);
    case UPDATE_RELATION_SUCCESS:
      return state.set('isLoading', false).set('updateRelationSuccess', true).set('reload', true);
    case UPDATE_RELATION_FAILURE:
      return state.set('isLoading', false).set('updateRelationSuccess', false).set('reload', false);
    case DELETE_RELATION:
      return state.set('isLoading', true).set('deleteRelationSuccess', null).set('reload', false);
    case DELETE_RELATION_SUCCESS:
      return state.set('isLoading', false).set('deleteRelationSuccess', true).set('reload', true);
    case DELETE_RELATION_FAILURE:
      return state.set('isLoading', false).set('deleteRelationSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default relationPageReducer;
