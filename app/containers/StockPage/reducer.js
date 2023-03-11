/*
 *
 * StockPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_PRODUCT,
  GET_ALL_PRODUCT_SUCCESS,
  GET_ALL_PRODUCT_FAILED,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILED,
  RESET_NOTI,
  GET_ALL_STOCK,
  GGET_ALL_STOCK_SUCCESS,
  GET_ALL_STOCK_FAILED,
  GET_PRODUCT_BY_STOCK,
  GET_PRODUCT_BY_STOCK_SUCCESS,
  GET_PRODUCT_BY_STOCK_FAILED,
  EDIT_PRODUCT,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILED,
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_ALL_UPPER_LIMIT_PRODUCT,
  GET_ALL_UPPER_LIMIT_PRODUCT_SUCCESS,
  GET_ALL_UPPER_LIMIT_PRODUCT_FAILED,
  GET_ALL_LOWER_LIMIT_PRODUCT,
  GET_ALL_LOWER_LIMIT_PRODUCT_SUCCESS,
  GET_ALL_LOWER_LIMIT_PRODUCT_FAILED,
} from './constants';

export const initialState = fromJS({});

function stockPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('error', false);
    case GET_ALL_PRODUCT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_PRODUCT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allProduct', action.data || {});
    case GET_ALL_PRODUCT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PRODUCT_BY_STOCK:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PRODUCT_BY_STOCK_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allProduct', action.data || {});
    case GET_PRODUCT_BY_STOCK_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_STOCK:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GGET_ALL_STOCK_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allStock', action.data || {});
    case GET_ALL_STOCK_FAILED:
      return state
        .set('loading', true)
        .set('successUpdate', false)
        .set('error', false);
    case DELETE_PRODUCT:
      return state
        .set('loading', true)
        .set('isEdit', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_PRODUCT_SUCCESS:
      return state
        .set('loading', false)
        .set('isEdit', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_PRODUCT_FAILED:
      return state
        .set('loading', false)
        .set('isEdit', false)
        .set('successDelete', false)
        .set('error', true);
    case GET_CATEGORY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CATEGORY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('categoryList', action.data)
        .set('error', false);
    case GET_CATEGORY_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case EDIT_PRODUCT:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case EDIT_PRODUCT_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case EDIT_PRODUCT_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    // case GET_ALL_UPPER_LIMIT_PRODUCT:
    //   return state
    //     .set('loading', true)
    //     .set('success', false)
    //     .set('error', false);
    case GET_ALL_UPPER_LIMIT_PRODUCT_SUCCESS:
      return state
        .set('allUpperLimitProduct', action.data || []);
    case GET_ALL_UPPER_LIMIT_PRODUCT_FAILED:
      return state
        .set('allUpperLimitProduct', []);
    // case GET_ALL_LOWER_LIMIT_PRODUCT:
    //   return state
    //     .set('loading', true)
    //     .set('success', false)
    //     .set('error', false);
    case GET_ALL_LOWER_LIMIT_PRODUCT_SUCCESS:
      return state
        .set('allLowerLimitProduct', action.data || []);
    case GET_ALL_LOWER_LIMIT_PRODUCT_FAILED:
      return state
        .set('allLowerLimitProduct', []);
    default:
      return state;
  }
}

export default stockPageReducer;
