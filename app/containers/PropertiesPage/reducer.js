/*
 *
 * PropertiesPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  FETCH_PROPERTIES_SET,
  FETCH_PROPERTIES_SET_SUCCESS,
  FETCH_PROPERTIES_SET_FAILED,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  FETCH_PROPERTIES_GROUP_FAILED,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_FAILED,
  DELETE_PROPERTIE,
  DELETE_PROPERTIE_SUCCESS,
  DELETE_PROPERTIE_FAILED,
  DELETE_PROPERTIES_GROUP,
  DELETE_PROPERTIES_GROUP_SUCCESS,
  DELETE_PROPERTIES_GROUP_FAILED,
  DELETE_PROPERTIES_SET,
  DELETE_PROPERTIES_SET_SUCCESS,
  DELETE_PROPERTIES_SET_FAILED,
} from './constants';

export const initialState = fromJS({});

function propertiesPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('errorDelete', false)
        .set('error', false);
    case FETCH_PROPERTIES_SET:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case FETCH_PROPERTIES_SET_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('propertiesSet', action.data)
        .set('error', false);
    case FETCH_PROPERTIES_SET_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
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
    case DELETE_PROPERTIE:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('errorDelete', false);
    case DELETE_PROPERTIE_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('propertiesList', action.data)
        .set('errorDelete', false);
    case DELETE_PROPERTIE_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('errorDelete', true);
    case DELETE_PROPERTIES_GROUP:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('errorDelete', false);
    case DELETE_PROPERTIES_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('propertiesGroup', action.data)
        .set('errorDelete', false);
    case DELETE_PROPERTIES_GROUP_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('errorDelete', true);
    case DELETE_PROPERTIES_SET:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('errorDelete', false);
    case DELETE_PROPERTIES_SET_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('propertiesGroup', action.data)
        .set('errorDelete', false);
    case DELETE_PROPERTIES_SET_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('errorDelete', true);
    default:
      return state;
  }
}

export default propertiesPageReducer;
