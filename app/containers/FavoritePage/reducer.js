/*
 *
 * FavoritePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SHOW_DRAWER_SCREEN } from './constants';

export const initialState = fromJS({
  openDrawer: false,
  openRevenue: false,
  openRevenueValue: false,
  openSale: false,
  openArea: false,
  openSales: false,
  openEmployeesDetail: false,
  openCost: false,
  openItem: false,
  openPart: false,
  openCosts: false,
  openProduct: false,
  openEmployees: false,
  openCity: false,
});

function favoritePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    // TT - item nào được click - thì TRUE    // item nào KO được click - thì FALSE
    case SHOW_DRAWER_SCREEN:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default favoritePageReducer;
