/*
 *
 * AddPayManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS, GET_REPORT_PAY_MANAGER_SUCCESS } from './constants';

export const initialState = fromJS({
  tab: 3,
  filter: {},
  startDate: new Date(`${new Date().getFullYear()}-01-01`),
  endDate: new Date(),
  reports: [],
  circleColumns: [],
});

function addPayManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state.set('reports', action.data);
    case GET_REPORT_PAY_MANAGER_SUCCESS:
      const { data: { path, data } } = action;
      return state.set(path, data);
    default:
      return state;
  }
}

export default addPayManagerReducer;
