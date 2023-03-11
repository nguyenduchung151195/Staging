/*
 *
 * AddWages reducer
 *
 */

import { fromJS } from 'immutable';
import { 
  DEFAULT_ACTION,
  GET_ALL_SALARY_FORMULA,
  GET_ALL_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_FAILURE,
} from './constants';

export const initialState = fromJS({
  salaryFormula: []
});

function addWagesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SALARY_FORMULA:
      return state.set('salaryFormula', action.data)
    case GET_ALL_SALARY_FORMULA_SUCCESS:
      return state.set('salaryFormula', action.data)
    case GET_ALL_SALARY_FORMULA_FAILURE:
      return state.set('salaryFormula', []);
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default addWagesReducer;
