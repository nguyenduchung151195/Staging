/*
 *
 * SalaryPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_SALARY,
  CREATE_SALARY_SUCCESS,
  CREATE_SALARY_FAILURE,
  UPDATE_SALARY,
  UPDATE_SALARY_SUCCESS,
  UPDATE_SALARY_FAILURE,
  DELETE_SALARY,
  DELETE_SALARY_SUCCESS,
  DELETE_SALARY_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createSalarySuccess: null,
  updateSalarySuccess: null,
  deleteSalarySuccess: null,
  reload: false,
});

function salaryPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SALARY:
      return state.set('isLoading', true).set('createSalarySuccess', null).set('reload', false);
    case CREATE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('createSalarySuccess', true).set('reload', true);
    case CREATE_SALARY_FAILURE:
      return state.set('isLoading', false).set('createSalarySuccess', false).set('reload', false);
    case UPDATE_SALARY:
      return state.set('isLoading', true).set('updateSalarySuccess', null).set('reload', false);
    case UPDATE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('updateSalarySuccess', true).set('reload', true);
    case UPDATE_SALARY_FAILURE:
      return state.set('isLoading', false).set('updateSalarySuccess', false).set('reload', false);
    case DELETE_SALARY:
      return state.set('isLoading', true).set('deleteSalarySuccess', null).set('reload', false);
    case DELETE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('deleteSalarySuccess', true).set('reload', true);
    case DELETE_SALARY_FAILURE:
      return state.set('isLoading', false).set('deleteSalarySuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default salaryPageReducer;
