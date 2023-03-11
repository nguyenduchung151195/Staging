/*
 *
 * AddPropertiesSet reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  FETCH_PROPERTIES_GROUP_FAILED,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_FAILED,
  FETCH_PROPERTIES_SUCCESS,
  CREATE_PROPERTIES_SET,
  CREATE_PROPERTIES_SET_SUCCESS,
  CREATE_PROPERTIES_SET_FAILED,
} from './constants';

export const initialState = fromJS({});

function addPropertiesSetReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
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
    case CREATE_PROPERTIES_SET:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_PROPERTIES_SET_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_PROPERTIES_SET_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addPropertiesSetReducer;
