/*
 *
 * SalesManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  openSpend: false,
  openSales: false,
  openCity: false,
  openEmployees: false,
  openEmployeesSale: false,
  openProduct: false,
  openType: false,
  openCategory: false,
  openCustomer: false,
  openItem: false,
  openTargetYear: false,
  openTargetMonth: false,
  openTotal: false,
  openDialogMonth: false,
  openComplete: false,
  openDialogYear: false,
  openProductSales: false,
  openSource: false,
  openTypeCustomer: false,
});

function salesManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default salesManagerReducer;
