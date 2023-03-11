/*
 *
 * StockImportPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, RESET_NOTI, GET_ALL_ITEMS, GET_ALL_ITEMS_SUCCESS, GET_ALL_ITEMS_FAILED,CHANGE_TAB, } from './constants';

export const initialState = fromJS({
  tab: 0,
});

function stockImportPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('error', false);
    case GET_ALL_ITEMS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('itemsList', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_ALL_ITEMS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CHANGE_TAB:
      return state.set('tab', action.data);
    default:
      return state;
  }
}

export default stockImportPageReducer;
