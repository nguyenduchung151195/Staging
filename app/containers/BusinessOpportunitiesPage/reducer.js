/*
 *
 * BusinessOpportunities reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_BOS,
  GET_ALL_BOS_FAIL,
  GET_ALL_BOS_SUCCESS,
  ADD_BO,
  ADD_BO_FAIL,
  ADD_BO_SUCCESS,
  DELETE_BOS,
  DELETE_BOS_FAIL,
  DELETE_BOS_SUCCESS,
  UPDATE_BO,
  UPDATE_BO_SUCCESS,
  UPDATE_BO_FAIL,
  CHANGE_TAB_BUS,
} from './constants';

export const initialState = fromJS({
  expenses: '',
  tab: 4,
  reload: false,
});

function businessOpportunitiesReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case CHANGE_TAB_BUS:
      return state.set('tab', action.tab);
    case GET_ALL_BOS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_BOS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_BOS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('bos', action.data.data)
        .set('pageDetail', action.data);

    case ADD_BO:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_BO_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('success', true)
        .set('error', false)
        .set('notiMessage', action.message)
        .set('bos', action.data);
    case ADD_BO_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_BO:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('reload', false);
    case UPDATE_BO_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true);
    // .set('bos', action.data);
    case UPDATE_BO_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('reload', true);
    case DELETE_BOS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_BOS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('success', true)
        .set('notiMessage', action.message)
        .set('error', false);
    // .set('bos', action.data);
    case DELETE_BOS_FAIL:
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

export default businessOpportunitiesReducer;
