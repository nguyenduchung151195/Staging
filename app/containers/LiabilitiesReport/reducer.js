/*
 *
 * LiabilitiesReport reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  filter: {},
  startDate: new Date(`${new Date().getFullYear()}-01-01`),
  endDate: new Date(),
  reports: {},
  circleColumns: [],
  openDrawer: false,
  report: {},
});

function liabilitiesReportReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state.set('reports', action.data);
    default:
      return state;
  }
}

export default liabilitiesReportReducer;
