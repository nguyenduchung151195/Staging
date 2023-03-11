/*
 *
 * ApprovePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  UPDATE_APPROVE,
  UPDATE_APPROVE_FAIL,
  UPDATE_APPROVE_SUCCESS,
  // ADD_APPROVE,
  // ADD_APPROVE_FAIL,
  // ADD_APPROVE_SUCCESS,
  GET_APPROVE,
  GET_APPROVE_FAILED,
  GET_APPROVE_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function approvePageReducer(state = initialState, action) {
  // console.log(action);
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_APPROVE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_APPROVE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_APPROVE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('approveRequest', action.data)
        .set('currentUser', action.currentUser);
    case UPDATE_APPROVE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_APPROVE_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('success', true)
        .set('approveGroups', action.data);
    case UPDATE_APPROVE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    default:
      return state;
  }
}

export default approvePageReducer;
