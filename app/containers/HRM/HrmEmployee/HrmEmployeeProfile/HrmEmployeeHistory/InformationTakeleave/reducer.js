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
});

function salaryPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SALARY:
      return state.set('isLoading', true).set('createSalarySuccess', null);
    case CREATE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('createSalarySuccess', true);
    case CREATE_SALARY_FAILURE:
      return state.set('isLoading', false).set('createSalarySuccess', false);
    case UPDATE_SALARY:
      return state.set('isLoading', true).set('updateSalarySuccess', null);
    case UPDATE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('updateSalarySuccess', true);
    case UPDATE_SALARY_FAILURE:
      return state.set('isLoading', false).set('updateSalarySuccess', false);
    case DELETE_SALARY:
      return state.set('isLoading', true).set('deleteSalarySuccess', null);
    case DELETE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('deleteSalarySuccess', true);
    case DELETE_SALARY_FAILURE:
      return state.set('isLoading', false).set('deleteSalarySuccess', false);
    default:
      return state;
  }
}

export default salaryPageReducer;
