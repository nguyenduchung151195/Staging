/*
 *
 * StockManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  openType: false,
  openIndustry: false,
  openTime: false,
  openDate: false,
  openDrawer: false,
});

function stockManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default stockManagerReducer;
