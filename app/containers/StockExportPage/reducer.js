/*
 *
 * StockExportPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_ITEMS,
  GET_ALL_ITEMS_SUCCESS,
  GET_ALL_ITEMS_FAILED,
  UPDATE_ITEMS,
  UPDATE_ITEMS_SUCCESS,
  UPDATE_ITEMS_FAILED,
  GET_PRODUCT,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILED,
  RESET_NOTIC,
  MERGE_DATA,
} from './constants';

export const initialState = fromJS({
  successUpdate: false,
});

function stockExportPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTIC:
      return state
        .set('loading', false)
        .set('successUpdate', false)
        .set('success', false)
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
    case UPDATE_ITEMS:
      return state
        .set('loading', true)
        .set('successUpdate', false)
        .set('error', false);
    case UPDATE_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('successUpdate', true)
        .set('error', false);
    case UPDATE_ITEMS_FAILED:
      return state
        .set('loading', false)
        .set('successUpdate', false)
        .set('error', true);
    case GET_PRODUCT:
      return state
        .set('productListById', [])
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PRODUCT_SUCCESS:
      return state
        .set('productListById', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_PRODUCT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default stockExportPageReducer;
