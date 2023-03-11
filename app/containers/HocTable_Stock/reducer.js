/*
 *
 * HocTable reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEFAULT_ACTION,
  EDIT_VIEWCONFIG_ACTION,
  EDIT_VIEWCONFIG_SUCCESS,
  EDIT_VIEWCONFIG_FAIL,
  GET_DYNAMIC_FORM_ACTION,
  GET_DYNAMIC_FORM_FAIL,
  GET_DYNAMIC_FORM_SUCCESS,
  CREATE_APPROVE,
  CREATE_APPROVE_SUCCESS,
  CREATE_APPROVE_FAILED,
} from './constants';
export const initialState = fromJS({});

function hocTableReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('successCreate', false).set('callAPIStatus', -1);
    case EDIT_VIEWCONFIG_ACTION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_VIEWCONFIG_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 1)
        .set('error', true);
    case EDIT_VIEWCONFIG_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case GET_DYNAMIC_FORM_ACTION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case GET_DYNAMIC_FORM_SUCCESS:
      // console.log(action);
      return state
        .set('loading', false)
        .set('success', false)
        .set('dynamicForms', action.data)
        .set('callAPIStatus', 1);

    case GET_DYNAMIC_FORM_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case CREATE_APPROVE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case CREATE_APPROVE_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_APPROVE_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default hocTableReducer;
