/*
 *
 * SalesEmployee reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  employee: null,
  filter: {},
  startDate: new Date(`${new Date().getFullYear()}-01-01`),
  endDate: new Date(),
  reload: 0,
  tabCus: 0,
  tab1: 1,
  departments: [],
});

function salesEmployeeReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default salesEmployeeReducer;
