/*
 *
 * ConfigHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_ALL_DATA_SALARY,
  GET_ALL_DATA_SALARY_SUCCESS,
  GET_ALL_DATA_SALARY_FAILER,
  UPDATE_DATA_SALARY_SUCCESS,
  UPDATE_DATA_SALARY_FAILER,
  ADD_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_FAILURE,
  GET_ATTRIBUTE_FORMULA_FAILURE,
  GET_ATTRIBUTE_FORMULA_SUCCESS,
  ADD_SALARY_FORMULA_FAILURE,
  ADD_SALARY_FORMULA,
  UPDATE_SALARY_FORMULA,
  UPDATE_SALARY_FORMULA_SUCCESS,
  UPDATE_SALARY_FORMULA_FAILURE,
  DELETE_SALARY_FORMULA,
  DELETE_SALARY_FORMULA_SUCCESS,
  DELETE_SALARY_FORMULA_FAILURE,
  ADD_ATTRIBUTE_FORMULA,
  ADD_ATTRIBUTE_FORMULA_SUCCESS,
  ADD_ATTRIBUTE_FORMULA_FAILURE,
  GET_LIST_ATTRIBUTE_SUCCESS,
  GET_LIST_ATTRIBUTE_FAILURE,
  GET_PROJECT_BONUS_SUCCESS,
  ADD_SINGLE_ATTRIBUTE_FORMULA_SUCCESS,
  UPDATE_SINGLE_ATTRIBUTE_FORMULA_SUCCESS,
} from './constants';

export const initialState = fromJS({
  tab: 0, dataSalary: [], salaryFormula: [], addSalaryFormulaSuccess: false,
  listAttributeFormula: [],
  projectBonus: [],
  updateSalaryFormulaSuccess: false,
  deleteSalaryFormulaSuccess: false,
  addAttributeFormulaSuccess: false
});

function configSalaryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_DATA_SALARY:
      return state.set('data', action.data);
    case GET_ALL_DATA_SALARY_SUCCESS:
      return state.set('dataSalary', action.data);
    case GET_ALL_DATA_SALARY_FAILER:
      return state.set('dataSalaryFailer', action.data);

    case UPDATE_DATA_SALARY_SUCCESS:
    // return state.set('dataSalary', action.data);
    case UPDATE_DATA_SALARY_FAILER:
      return state.set('dataSalaryFailer', action.data);

    case GET_ALL_SALARY_FORMULA_SUCCESS:
      return state.set('salaryFormula', action.data)
    case GET_ALL_SALARY_FORMULA_FAILURE:
      return state.set('salaryFormula', []);

    case ADD_SALARY_FORMULA:
      return state.set('addSalaryFormulaSuccess', false);
    case ADD_SALARY_FORMULA_SUCCESS:
      return state.set('addSalaryFormulaSuccess', true);
    case ADD_SALARY_FORMULA_FAILURE:
      return state.set('addSalaryFormulaSuccess', false);

    case UPDATE_SALARY_FORMULA:
      return state.set('updateSalaryFormulaSuccess', false);
    case UPDATE_SALARY_FORMULA_SUCCESS:
      return state.set('updateSalaryFormulaSuccess', true);
    case UPDATE_SALARY_FORMULA_FAILURE:
      return state.set('updateSalaryFormulaSuccess', false);

    case DELETE_SALARY_FORMULA:
      return state.set('deleteSalaryFormulaSuccess', false);
    case DELETE_SALARY_FORMULA_SUCCESS:
      return state.set('deleteSalaryFormulaSuccess', true);
    case DELETE_SALARY_FORMULA_FAILURE:
      return state.set('deleteSalaryFormulaSuccess', false);

    case GET_ATTRIBUTE_FORMULA_SUCCESS:
      return state.set('attributeFormula', action.data);
    case GET_ATTRIBUTE_FORMULA_FAILURE:
      return state.set('attributeFormula', []);

    case ADD_ATTRIBUTE_FORMULA:
      return state.set('addAttributeFormulaSuccess', false);
    case ADD_ATTRIBUTE_FORMULA_SUCCESS:
      return state.set('addAttributeFormulaSuccess', true);
    case ADD_ATTRIBUTE_FORMULA_FAILURE:
      return state.set('addAttributeFormulaSuccess', false);

    case GET_LIST_ATTRIBUTE_SUCCESS:
      return state.set('listAttributeFormula', action.data);
    case GET_LIST_ATTRIBUTE_FAILURE:
      return state.set('listAttributeFormula', []);

    // thuong du an
    case GET_PROJECT_BONUS_SUCCESS:
      return state.set('projectBonus', action.data);

    //
    case ADD_SINGLE_ATTRIBUTE_FORMULA_SUCCESS:
      return state.set('addSingleSuccess', true);
    case UPDATE_SINGLE_ATTRIBUTE_FORMULA_SUCCESS:
      return state.set('addSingleSuccess', true);
    default:
      return state;
  }
}

export default configSalaryReducer;
