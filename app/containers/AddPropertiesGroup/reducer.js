/*
 *
 * AddPropertiesGroup reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  FETCH_PROPERTIES_GROUP,
  FETCH_PROPERTIES_GROUP_FAILED,
  FETCH_PROPERTIES_GROUP_SUCCESS,
  RESET_NOTI,
  CRETAE_PROPERTIES_GROUP,
  CRETAE_PROPERTIES_GROUP_SUCCESS,
  CRETAE_PROPERTIES_GROUP_FAILED,
  EDIT_PROPERTIES_GROUP,
  EDIT_PROPERTIES_GROUP_SUCCESS,
  EDIT_PROPERTIES_GROUP_FAILED,
} from './constants';

export const initialState = fromJS({});

function addPropertiesGroupReducer(state = initialState, action) {
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
    case CRETAE_PROPERTIES_GROUP:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CRETAE_PROPERTIES_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CRETAE_PROPERTIES_GROUP_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case EDIT_PROPERTIES_GROUP:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case EDIT_PROPERTIES_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case EDIT_PROPERTIES_GROUP_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addPropertiesGroupReducer;
