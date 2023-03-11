/*
 *
 * WageSalaryManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  CREATE_WAGE_SALARY,
  CREATE_WAGE_SALARY_SUCCESS,
  CREATE_WAGE_SALARY_FAILURE,
  UPDATE_WAGE_SALARY,
  UPDATE_WAGE_SALARY_SUCCESS,
  UPDATE_WAGE_SALARY_FAILURE,
  DELETE_WAGE_SALARY,
  DELETE_WAGE_SALARY_SUCCESS,
  DELETE_WAGE_SALARY_FAILURE,
  GET_ALL_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_FAILURE,
  GET_SALARY_FORMULA_ATTRIBUTES_SUCCESS,
  GET_SALARY_FORMULA_ATTRIBUTES_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createWageSalarySuccess: null,
  updateWageSalarySuccess: null,
  deleteWageSalarySuccess: null,
  tab: 0,
  reload: false,
  salaryFormula: [],
});

function wagesSalaryReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case CREATE_WAGE_SALARY:
      return state.set('isLoading', true).set('createWageSalarySuccess', null).set('reload', false);
    case CREATE_WAGE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('createWageSalarySuccess', true).set('reload', true);
    case CREATE_WAGE_SALARY_FAILURE:
      return state.set('isLoading', false).set('createWageSalarySuccess', false).set('reload', false);
    case UPDATE_WAGE_SALARY:
      return state.set('isLoading', true).set('updateWageSalarySuccess', null).set('reload', false);
    case UPDATE_WAGE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('updateWageSalarySuccess', true).set('reload', true);
    case UPDATE_WAGE_SALARY_FAILURE:
      return state.set('isLoading', false).set('updateWageSalarySuccess', false).set('reload', false);
    case DELETE_WAGE_SALARY:
      return state.set('isLoading', true).set('deleteWageSalarySuccess', null).set('reload', false);
    case DELETE_WAGE_SALARY_SUCCESS:
      return state.set('isLoading', false).set('deleteWageSalarySuccess', true).set('reload', true);
    case DELETE_WAGE_SALARY_FAILURE:
      return state.set('isLoading', false).set('deleteWageSalarySuccess', false).set('reload', false);
    case GET_ALL_SALARY_FORMULA_SUCCESS:
      return state.set('salaryFormula', action.data)
    case GET_ALL_SALARY_FORMULA_FAILURE:
      return state.set('salaryFormula', []);
    case GET_SALARY_FORMULA_ATTRIBUTES_SUCCESS:
      return state.set('formulaAttributes', action.data)
    case GET_SALARY_FORMULA_ATTRIBUTES_FAILURE:
      return state.set('formulaAttributes', []);
    default:
      return state;
  }
}

export default wagesSalaryReducer;
