/*
 *
 * AddSalesManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_SALE_MANAGER_SUCCESS, MERGE_DATA } from './constants';

export const initialState = fromJS({
  sale: '',
  filter: {},
  startDate: new Date(`${new Date().getFullYear()}-01-01`),
  endDate: new Date(),
  filterDetail: {},
  productId: null,
  circleColumns: [],
  openSalesEmployee: false,
});

function addSalesManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_SALE_MANAGER_SUCCESS:
      const { data: { path, data } } = action;
      return state.set(path, data);
    default:
      return state;
  }
}

export default addSalesManagerReducer;
