/*
 *
 * ContactCenterFormPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  ADD_CONTACT_CENTER_ERROR,
  ADD_CONTACT_CENTER_SUCCESS,
  GET_CONTACT_CENTER_BY_ID,
  GET_CONTACT_CENTER_BY_ID_SUCCESS,
  GET_CONTACT_CENTER_BY_ID_ERROR,
  GET_EMPLOYEE_IDS,
  GET_EMPLOYEE_IDS_SUCCESS,
  GET_EMPLOYEE_IDS_ERROR,
  EDIT_CONTACT_CENTER_SUCCESS,
  EDIT_CONTACT_CENTER_ERROR,
} from './constants';
import { CONTACT_CENTER } from '../../config/urlConfig';

export const initialState = fromJS({});

function contactCenterFormPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CONTACT_CENTER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_CONTACT_CENTER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case ADD_CONTACT_CENTER_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case EDIT_CONTACT_CENTER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case EDIT_CONTACT_CENTER_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CONTACT_CENTER_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CONTACT_CENTER_BY_ID_SUCCESS:
      return state
        .set('contactCenter', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_CONTACT_CENTER_BY_ID_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_EMPLOYEE_IDS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_EMPLOYEE_IDS_SUCCESS:
      return state
        .set('employees', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_EMPLOYEE_IDS_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default contactCenterFormPageReducer;
