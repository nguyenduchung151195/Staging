/*
 *
 * TradingReport reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ITEM_BY_RANGE,
  GET_ITEM_BY_RANGE_FAILED,
  GET_ITEM_BY_RANGE_SUCCESS,
  GET_LOGS_BY_RANGE,
  GET_LOGS_BY_RANGE_FAILED,
  GET_LOGS_BY_RANGE_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function tradingReportReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_ITEM_BY_RANGE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ITEM_BY_RANGE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ITEM_BY_RANGE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('items', action.data);
    case GET_LOGS_BY_RANGE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_LOGS_BY_RANGE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_LOGS_BY_RANGE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('logs', action.data);
    default:
      return state;
  }
}

export default tradingReportReducer;
