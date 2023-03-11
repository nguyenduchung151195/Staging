/*
 *
 * AddExpenseManage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_REPORT_EXPENSE_SUCCESS, MERGE_DATA } from './constants';

export const initialState = fromJS({ expense: 0 });

function addExpenseManageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_REPORT_EXPENSE_SUCCESS:
      const { data: { path, data } } = action;
      return state.set(path, data);
    default:
      return state;
  }
}

export default addExpenseManageReducer;
