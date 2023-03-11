/*
 *
 * DispatchManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, RESET_NOTI, CHANGE_TAB, GET_ALL_DISPATCH, GET_ALL_DISPATCH_SUCCESS, GET_ALL_DISPATCH_FAILED } from './constants';

export const initialState = fromJS({
  tab: 0,
});

function dispatchManagerReducer(state = initialState, action) {
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
    case GET_ALL_DISPATCH:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_DISPATCH_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('data', action.data)
        .set('data', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_ALL_DISPATCH_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);

    default:
      return state;
  }
}

export default dispatchManagerReducer;
