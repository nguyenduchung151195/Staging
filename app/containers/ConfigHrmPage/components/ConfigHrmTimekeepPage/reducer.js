/*
 *
 * ConfigHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_ALL_HOLIDAY,
  MERGE_DATA,
  GET_ALL_HOLIDAY_SUCCESS,
  GET_ALL_HOLIDAY_FAILER,
  GET_ALL_TIMEKEEP_TYPE,
  GET_ALL_TIMEKEEP_TYPE_FAILER,
  GET_ALL_TIMEKEEP_TYPE_SUCCESS,
  GET_ALL_SYMBOL,
  GET_ALL_SYMBOL_SUCCESS,
  GET_ALL_SYMBOL_FAILER,
  ADD_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  ADD_TIMEKEEP_TYPE_SUCCESS,
  ADD_SYMBOL_SUCCESS,
} from './constants';

export const initialState = fromJS({ tab: 0, holidays: [], timekeepTypes: [], symbols: []});

function configHrmTimekeepPageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_ALL_HOLIDAY_SUCCESS:
      return state.set('holidays', action.data);
    case GET_ALL_TIMEKEEP_TYPE_SUCCESS:
      return state.set('timekeepTypes', action.data);
    case GET_ALL_SYMBOL_SUCCESS:
      return state.set('symbols', action.data);

    // add
    case ADD_HOLIDAY_SUCCESS:
      
    case ADD_TIMEKEEP_TYPE_SUCCESS:
      return state.set('timekeepTypes', action.data);
    case ADD_SYMBOL_SUCCESS:
      return state.set('symbols', action.data);
    default:
      return state;
  }
}

export default configHrmTimekeepPageReducer;
