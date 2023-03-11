/*
 *
 * ImportProduct reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_ORDER, GET_ORDER_SUCCESS, GET_ORDER_FAILED } from './constants';

export const initialState = fromJS({
  orders: [],
});

function importProductReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_ORDER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ORDER_SUCCESS:
      return state
        .set('loading', false)
        .set('orders', action.data)
        .set('success', true)
        .set('error', false);
    case GET_ORDER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default importProductReducer;
