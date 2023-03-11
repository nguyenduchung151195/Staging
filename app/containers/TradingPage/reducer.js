/*
 *
 * BusinessOpportunities reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_TRADINGS,
  GET_ALL_TRADINGS_FAIL,
  GET_ALL_TRADINGS_SUCCESS,
  ADD_TRADING,
  ADD_TRADING_FAIL,
  ADD_TRADING_SUCCESS,
  DELETE_TRADINGS,
  DELETE_TRADINGS_FAIL,
  DELETE_TRADINGS_SUCCESS,
  UPDATE_TRADING,
  UPDATE_TRADING_SUCCESS,
  UPDATE_TRADING_FAIL,
  CHANGE_TAB_TRADING,
} from './constants';

export const initialState = fromJS({
  tab: 4,
  reload: false,
});

function businessOpportunitiesReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case CHANGE_TAB_TRADING:
      return state.set('tab', action.tab);
    case GET_ALL_TRADINGS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_TRADINGS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_TRADINGS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('bos', action.data);
    case ADD_TRADING:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_TRADING_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('success', true);
    // .set('notiMessage', action.message)
    // .set('bos', action.data);
    case ADD_TRADING_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_TRADING:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('onChangeKanban', null)
        .set('reload', false);
    case UPDATE_TRADING_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('onChangeKanban', false)
        .set('success', true);
    // .set('bos', action.data);
    case UPDATE_TRADING_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('reload', true)
        .set('onChangeKanban', true)
        .set('notiMessage', action.message);
    case DELETE_TRADINGS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_TRADINGS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false);
    // .set('bos', action.data);
    case DELETE_TRADINGS_FAIL:
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
