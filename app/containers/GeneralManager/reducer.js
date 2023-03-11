/*
 *
 * GeneralManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  openPrice: false,

  openOrder: false,
  openCost: false,
  openInventory: false,
  openItem: false,
  openBusiness: false,
  openProfit: false,
});

function generalManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default generalManagerReducer;
