/*
 *
 * FluctuationsPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_INCREASES_OR_DECREASES_SUCCESS, GET_INCREASES_OR_DECREASES } from './constants';

export const initialState = fromJS({
  increasesOrDecreases: [],
  loadingChart: false,
});

function fluctuationsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_INCREASES_OR_DECREASES:
      return state.set('loadingChart', true)
    case GET_INCREASES_OR_DECREASES_SUCCESS:
      return state
        .set('increasesOrDecreases', action.data)
        .set('loadingChart', false)
    default:
      return state;
  }
}

export default fluctuationsPageReducer;
