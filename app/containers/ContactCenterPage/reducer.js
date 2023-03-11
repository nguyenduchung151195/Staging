/*
 *
 * ContactCenterPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_CONTACT_CENTER, GET_CONTACT_CENTER_SUCCESS, GET_CONTACT_CENTER_ERROR } from './constants';

export const initialState = fromJS({});

function contactCenterPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_CONTACT_CENTER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CONTACT_CENTER_SUCCESS:
      return state
        .set('contactCenters', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_CONTACT_CENTER_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default contactCenterPageReducer;
