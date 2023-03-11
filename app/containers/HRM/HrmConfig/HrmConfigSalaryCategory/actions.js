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
  DELETE_SALARY_CATEGORY_SUCCESS,
  RESET_SALARY_CATEGORY,
  RESET_SALARY_CATEGORY_SUCCESS,
  RESET_SALARY_CATEGORY_FAILURE
} from "./contants"

// get all
export function getAllSalaryCategory() {
  return {
    type: GET_ALL_SALARY_CATEGORY,
  }
}
export function getAllSalaryCategorySuccess(data) {
  return {
    type: GET_ALL_SALARY_CATEGORY_SUCCESS,
    data
  }
}
export function getAllSalaryCategoryFailure(error) {
  return {
    type: GET_ALL_SALARY_CATEGORY_FAILURE,
    error
  }
}

// add
export function addSalaryCategory(data) {
  return {
    type: ADD_SALARY_CATEGORY,
    data
  }
}
export function addSalaryCategorySuccess(data) {
  return {
    type: ADD_SALARY_CATEGORY_SUCCESS,
    data
  }
}
export function addSalaryCategoryFailure(error) {
  return {
    type: ADD_SALARY_CATEGORY_FAILURE,
    error
  }
}

// update
export function updateSalaryCategory(data, typeChild) {
  return {
    type: UPDATE_SALARY_CATEGORY,
    typeChild,
    data
  }
}
export function updateSalaryCategorySuccess(data) {
  return {
    type: UPDATE_SALARY_CATEGORY_SUCCESS,
    data
  }
}
export function updateSalaryCategoryFailure(error) {
  return {
    type: UPDATE_SALARY_CATEGORY_FAILURE,
    error
  }
}

// delete
export function deleteSalaryCategory(data) {
  return {
    type: DELETE_SALARY_CATEGORY,
    data
  }
}
export function deleteSalaryCategorySuccess(data) {
  return {
    type: DELETE_SALARY_CATEGORY_SUCCESS,
    data
  }
}
export function deleteSalaryCategoryFailure(error) {
  return {
    type: DELETE_SALARY_CATEGORY_FAILURE,
    error
  }
}

// reset
export function resetSalaryCategory() {
  return {
    type: RESET_SALARY_CATEGORY,
  }
}
export function resetSalaryCategorySuccess(data) {
  return {
    type: RESET_SALARY_CATEGORY_SUCCESS,
    data
  }
}
export function resetSalaryCategoryFailure(error) {
  return {
    type: RESET_SALARY_CATEGORY_FAILURE,
    error
  }
}