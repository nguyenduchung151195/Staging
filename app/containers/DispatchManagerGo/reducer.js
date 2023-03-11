/*
 *
 * DispatchManagerGo reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MEGER_DATA } from './constants';

export const initialState = fromJS({ tab: 0 });

function dispatchManagerGoReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MEGER_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default dispatchManagerGoReducer;
