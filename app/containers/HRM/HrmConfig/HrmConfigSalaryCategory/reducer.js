/*
 *
 * SocialInsurancePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_ALL_SALARY_CATEGORY, GET_ALL_SALARY_CATEGORY_FAILURE, GET_ALL_SALARY_CATEGORY_SUCCESS,
  ADD_SALARY_CATEGORY,
  ADD_SALARY_CATEGORY_SUCCESS,
  ADD_SALARY_CATEGORY_FAILURE,
  UPDATE_SALARY_CATEGORY,
  UPDATE_SALARY_CATEGORY_SUCCESS,
  UPDATE_SALARY_CATEGORY_FAILURE,
  DELETE_SALARY_CATEGORY,
  DELETE_SALARY_CATEGORY_FAILURE,
  DELETE_SALARY_CATEGORY_SUCCESS
} from './contants'

export const initialState = fromJS({
  salaryCategory: [],
  addSalaryCategorySuccess: false,
  updateSalaryCategorySuccess: false,
  deleteSalaryCategorySuccess: false,
});

function configHrmSalaryCategoryReducer(state = initialState, action) {
  switch (action.type) {
    // get all
    case GET_ALL_SALARY_CATEGORY_SUCCESS:
      return state.set('salaryCategory', action.data).set('addSalaryCategorySuccess', false).set('updateSalaryCategorySuccess', false);

    // add
    case ADD_SALARY_CATEGORY_SUCCESS:
      return state.set('addSalaryCategorySuccess', true);
    case ADD_SALARY_CATEGORY_FAILURE:
      return state.set('addSalaryCategorySuccess', false);
    // update 
    case UPDATE_SALARY_CATEGORY_SUCCESS:
      return state.set('updateSalaryCategorySuccess', true);
    case UPDATE_SALARY_CATEGORY_FAILURE:
      return state.set('updateSalaryCategorySuccess', false);
    // delete
    case DELETE_SALARY_CATEGORY_SUCCESS:
      return state.set('deleteSalaryCategorySuccess', true);
    case DELETE_SALARY_CATEGORY_FAILURE:
      return state.set('deleteSalaryCategorySuccess', false);

    default:
      return state;
  }
}

export default configHrmSalaryCategoryReducer;
