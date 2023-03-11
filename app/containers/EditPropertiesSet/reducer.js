/*
 *
 * EditPropertiesSet reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_FAILED,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_FAILED,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  EDIT_PROPERTIES_SET,
  EDIT_PROPERTIES_SET_FAILED,
  EDIT_PROPERTIES_SET_SUCCESS,
  GET_PROPERTIES_SET,
  GET_PROPERTIES_SET_FAILED,
  GET_PROPERTIES_SET_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function editPropertiesSetReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successEdit', false)
        .set('error', false);
    case FETCH_PROPERTIES_GROUP:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case FETCH_PROPERTIES_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('propertiesGroup', action.data)
        .set('error', false);
    case FETCH_PROPERTIES_GROUP_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case FETCH_PROPERTIES:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case FETCH_PROPERTIES_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('propertiesList', action.data)
        .set('error', false);
    case FETCH_PROPERTIES_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case EDIT_PROPERTIES_SET:
      return state
        .set('loading', true)
        .set('successEdit', false)
        .set('error', false);
    case EDIT_PROPERTIES_SET_SUCCESS:
      return state
        .set('loading', false)
        .set('successEdit', true)
        .set('error', false);
    case EDIT_PROPERTIES_SET_FAILED:
      return state
        .set('loading', false)
        .set('successEdit', false)
        .set('error', true);
    case GET_PROPERTIES_SET:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PROPERTIES_SET_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('currentSet', action.data)
        .set('error', false);
    case GET_PROPERTIES_SET_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default editPropertiesSetReducer;
