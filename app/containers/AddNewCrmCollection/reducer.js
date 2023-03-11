/*
 *
 * AddNewCrmCollection reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_COLLECTION,
  GET_ALL_COLLECTION_SUCCESS,
  GET_ALL_COLLECTION_FALSE,
  ADD_NEW_COLLECTION_FALSE,
  ADD_NEW_COLLECTION_SUCCESS,
  ADD_NEW_COLLECTION,
  EDIT_COLLECTION_SUCCESS,
  EDIT_COLLECTION_FALSE,
  EDIT_COLLECTION,
  DELETE_COLLECTION,
  DELETE_COLLECTION_FALSE,
  DELETE_COLLECTION_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function addNewCrmCollectionReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    // .set('addSuccess', false)
    // .set('addError', false);
    case GET_ALL_COLLECTION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_COLLECTION_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allCRMCollection', action.data);
    case GET_ALL_COLLECTION_FALSE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case ADD_NEW_COLLECTION:
      return state
        .set('addLoading', true)
        .set('addSuccess', false)
        .set('addError', false);
    case ADD_NEW_COLLECTION_SUCCESS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false);
    case ADD_NEW_COLLECTION_FALSE:
      return state
        .set('addLoading', false)
        .set('addSuccess', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('addError', true);
    case EDIT_COLLECTION:
      return state
        .set('loading', true)
        .set('addSuccess', false)
        .set('addError', false);
    case EDIT_COLLECTION_SUCCESS:
      return state
        .set('loading', false)
        .set('addSuccess', true)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('addError', false);
    case EDIT_COLLECTION_FALSE:
      return state
        .set('loading', false)
        .set('addSuccess', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('addError', true);
    case DELETE_COLLECTION:
      return state
        .set('addLoading', true)
        .set('addSuccess', false)
        .set('addError', false);
    case DELETE_COLLECTION_SUCCESS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false);
    case DELETE_COLLECTION_FALSE:
      return state
        .set('addLoading', false)
        .set('addSuccess', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('addError', true);
    default:
      return state;
  }
}

export default addNewCrmCollectionReducer;
