/*
 *
 * WageSalaryManagement reducer
 *
 */

import { fromJS } from 'immutable';
import { MERGE_DATA, GET_DETAIL_WAGE_SALARY, GET_DETAIL_WAGE_SALARY_SUCCESS, GET_DETAIL_WAGE_SALARY_FAILURE, GET_ALL_TEMPLATE_SUCCESS } from './constants';

export const initialState = fromJS({
  isLoading: false,
  detailWagesSalary: null,
  tab: 0,
  reload: false,
  templates: []
});

function wageSalaryReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DETAIL_WAGE_SALARY:
      return state
        .set('isLoading', true)
        .set('detailWagesSalary', [])
        .set('reload', false);
    case GET_DETAIL_WAGE_SALARY_SUCCESS:
      return state
        .set('isLoading', false)
        .set('detailWagesSalary', action.data)
        .set('reload', true);
    case GET_DETAIL_WAGE_SALARY_FAILURE:
      return state
        .set('isLoading', false)
        .set('detailWagesSalary', [])
        .set('reload', false);

    case GET_ALL_TEMPLATE_SUCCESS:
      return state.set('templates', action.data);
    default:
      return state;
  }
}

export default wageSalaryReducer;
