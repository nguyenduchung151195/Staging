/*
 *
 * AddRevenueAndExpenditurePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  CREATE_RECORD,
  CREATE_RECORD_SUCCESS,
  CREATE_RECORD_FAILED,
  RESET_NOTI,
  GET_RECORD_BY_ID,
  GET_RECORD_BY_ID_SUCCESS,
  GET_RECORD_BY_ID_FAILED,
  UPDATE_RECORD,
  UPDATE_RECORD_SUCCESS,
  UPDATE_RECORD_FAILED,
} from './constants';

export const initialState = fromJS({});

function addRevenueAndExpenditurePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false);
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
    case CREATE_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case CREATE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_RECORD_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_RECORD_BY_ID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('recordSelected', action.data)
        .set('error', false);
    case GET_RECORD_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addRevenueAndExpenditurePageReducer;
