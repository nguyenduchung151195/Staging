/*
 *
 * AddPropertie reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  CREATE_PROPERTIE,
  CREATE_PROPERTIE_FAILED,
  CREATE_PROPERTIE_SUCCESS,
  EDIT_PROPERTIE,
  EDIT_PROPERTIE_FAILED,
  EDIT_PROPERTIE_SUCCESS,
  FETCH_PROPERTIES,
  FETCH_PROPERTIES_FAILED,
  FETCH_PROPERTIES_SUCCESS,
  RESET_NOTI,
} from './constants';

export const initialState = fromJS({});

function addPropertieReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false);
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
    case CREATE_PROPERTIE:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_PROPERTIE_SUCCESS:
      return (
        state
          .set('loading', false)
          .set('successCreate', true)
          // .set('propertiesList', action.data)
          .set('error', false)
      );
    case CREATE_PROPERTIE_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case EDIT_PROPERTIE:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case EDIT_PROPERTIE_SUCCESS:
      return (
        state
          .set('loading', false)
          .set('successCreate', true)
          // .set('propertiesList', action.data)
          .set('error', false)
      );
    case EDIT_PROPERTIE_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addPropertieReducer;
