/*
 *
 * BillsPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_BILLS,
  GET_ALL_BILLS_SUCCESS,
  GET_ALL_BILLS_FAILED,
  UPDATE_BILL_STATUS,
  UPDATE_BILL_STATUS_SUCCESS,
  UPDATE_BILL_STATUS_FAILED,
  DELETE_BILLS,
  DELETE_BILLS_SUCCESS,
  DELETE_BILLS_FAILED,
  RESET_NOTI,
  CHANGE_TAB,
} from './constants';

export const initialState = fromJS({
  tab: 0,
  reload: false,
});

function billsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', false);
    case CHANGE_TAB:
      return state.set('tab', action.data);
    case GET_ALL_BILLS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_BILLS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allBills', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_ALL_BILLS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_BILL_STATUS:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false)
        .set('reload', false);
    case UPDATE_BILL_STATUS_SUCCESS:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case UPDATE_BILL_STATUS_FAILED:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true)
        .set('reload', true);
    case DELETE_BILLS:
      return state
        .set('successDelete', false)
        .set('loading', true)
        .set('error', false);
    case DELETE_BILLS_SUCCESS:
      return state
        .set('successDelete', true)
        .set('loading', false)
        .set('error', false);
    case DELETE_BILLS_FAILED:
      return state
        .set('successDelete', false)
        .set('loading', false)
        .set('error', true);
    default:
      return state;
  }
}

export default billsPageReducer;
