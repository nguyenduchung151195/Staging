/*
 *
 * AddStockManager reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_STOCK,
  GET_ALL_STOCK_SUCCESS,
  GET_ALL_STOCK_FAILED,
  GET_ALL_CATEGORY,
  GET_ALL_CATEGORY_SUCCESS,
  GET_ALL_CATEGORY_FAILED,
  GET_ALL_INVENTORY,
  GET_ALL_INVENTORY_FAILED,
  GET_ALL_INVENTORY_SUCCESS,
  GET_ALL_TAGS_FAILED,
  GET_ALL_TAGS,
  GET_ALL_TAGS_SUCCESS,
  MERGE_DATA,
} from './constants';

export const initialState = fromJS({
  allStock: [],
  tab: 0,
  filter: {},
  startDate: new Date(`${new Date().getFullYear()}-01-01`),
  endDate: new Date(),
});

function addStockManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_ALL_STOCK:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_STOCK_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_STOCK_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allStock', action.data || []);
    case GET_ALL_CATEGORY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_CATEGORY_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_CATEGORY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allCategory', action.data || []);
    case GET_ALL_INVENTORY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_INVENTORY_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_INVENTORY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allInventory', action.data || []);
    case GET_ALL_TAGS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_TAGS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_TAGS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allTags', action.data || []);
    default:
      return state;
  }
}

export default addStockManagerReducer;
