import {
  GET_ALL_DATA_SALARY,
  GET_ALL_DATA_SALARY_SUCCESS,
  GET_ALL_DATA_SALARY_FAILER,
  UPDATE_DATA_SALARY,
  UPDATE_DATA_SALARY_SUCCESS,
  UPDATE_DATA_SALARY_FAILER,
  GET_ALL_SALARY_FORMULA,
  GET_ALL_SALARY_FORMULA_SUCCESS,
  GET_ALL_SALARY_FORMULA_FAILURE,
  ADD_SALARY_FORMULA,
  ADD_SALARY_FORMULA_SUCCESS,
  ADD_SALARY_FORMULA_FAILURE,
  UPDATE_SALARY_FORMULA,
  UPDATE_SALARY_FORMULA_SUCCESS,
  UPDATE_SALARY_FORMULA_FAILURE,
  DELETE_SALARY_FORMULA,
  DELETE_SALARY_FORMULA_SUCCESS,
  DELETE_SALARY_FORMULA_FAILURE,
  GET_ATTRIBUTE_FORMULA_FAILURE,
  GET_ATTRIBUTE_FORMULA_SUCCESS,
  GET_ATTRIBUTE_FORMULA,
  ADD_ATTRIBUTE_FORMULA,
  ADD_ATTRIBUTE_FORMULA_SUCCESS,
  ADD_ATTRIBUTE_FORMULA_FAILURE,
  UPDATE_ATTRIBUTE_FORMULA,
  UPDATE_ATTRIBUTE_FORMULA_SUCCESS,
  UPDATE_ATTRIBUTE_FORMULA_FAILURE,
  DELETE_ATTRIBUTE_FORMULA,
  DELETE_ATTRIBUTE_FORMULA_SUCCESS,
  DELETE_ATTRIBUTE_FORMULA_FAILURE,
  GET_LIST_ATTRIBUTE,
  GET_LIST_ATTRIBUTE_SUCCESS,
  GET_LIST_ATTRIBUTE_FAILURE,

  GET_PROJECT_BONUS,
  GET_PROJECT_BONUS_SUCCESS,
  GET_PROJECT_BONUS_FAILURE,
  ADD_PROJECT_BONUS,
  ADD_PROJECT_BONUS_SUCCESS,
  ADD_PROJECT_BONUS_FAILURE,
  UPDATE_PROJECT_BONUS,
  UPDATE_PROJECT_BONUS_SUCCESS,
  UPDATE_PROJECT_BONUS_FAILURE,
  DELETE_PROJECT_BONUS,
  DELETE_PROJECT_BONUS_SUCCESS,
  DELETE_PROJECT_BONUS_FAILURE,
  ADD_SINGLE_ATTRIBUTE_FORMULA,
  ADD_SINGLE_ATTRIBUTE_FORMULA_SUCCESS,
  ADD_SINGLE_ATTRIBUTE_FORMULA_FAILURE,
  UPDATE_SINGLE_ATTRIBUTE_FORMULA,
  UPDATE_SINGLE_ATTRIBUTE_FORMULA_SUCCESS,
  UPDATE_SINGLE_ATTRIBUTE_FORMULA_FAILURE
} from './constants';

export function getAllDataSalary() {
  return {
    type: GET_ALL_DATA_SALARY,
  };
}

export function getAllDataSalarySuccess(data) {
  return {
    type: GET_ALL_DATA_SALARY_SUCCESS,
    data,
  };
}

export function getAllDataSalaryFailer(error) {
  return {
    type: GET_ALL_DATA_SALARY_FAILER,
    error,
  };
}

export function updateDataSalary(data) {
  return {
    type: UPDATE_DATA_SALARY,
    data,
  };
}

export function updateDataSalarySuccess(data) {
  return {
    type: UPDATE_DATA_SALARY_SUCCESS,
    data,
  };
}
export function updateDataSalaryFailer(error) {
  return {
    type: UPDATE_DATA_SALARY_FAILER,
    data,
  };
}

export function getAllSalaryFormula() {
  return {
    type: GET_ALL_SALARY_FORMULA
  }
}
export function getAllSalaryFormulaSuccess(data) {
  return {
    type: GET_ALL_SALARY_FORMULA_SUCCESS,
    data
  }
}
export function getAllSalaryFormulaFailure(error) {
  return {
    type: GET_ALL_SALARY_FORMULA_FAILURE,
    error
  }
}

export function addSalaryFormula(data) {
  return {
    type: ADD_SALARY_FORMULA,
    data
  }
}
export function addSalaryFormulaSuccess(data) {
  return {
    type: ADD_SALARY_FORMULA_SUCCESS,
    data
  }
}
export function addSalaryFormulaFailure(error) {
  return {
    type: ADD_SALARY_FORMULA_FAILURE,
    error
  }
}

export function updateSalaryFormula(data) {
  return {
    type: UPDATE_SALARY_FORMULA,
    data
  }
}
export function updateSalaryFormulaSuccess(data) {
  return {
    type: UPDATE_SALARY_FORMULA_SUCCESS,
    data
  }
}
export function updateSalaryFormulaFailure(error) {
  return {
    type: UPDATE_SALARY_FORMULA_FAILURE,
    error
  }
}

export function deleteSalaryFormula(_id) {
  return {
    type: DELETE_SALARY_FORMULA,
    _id
  }
}
export function deleteSalaryFormulaSuccess(data) {
  return {
    type: DELETE_SALARY_FORMULA_SUCCESS,
    data
  }
}
export function deleteSalaryFormulaFailure(error) {
  return {
    type: DELETE_SALARY_FORMULA_FAILURE,
    error
  }
}

// lay 1 ban ghi cua con thuc tinh luong
export function getAttributeFormula(_id) {
  return {
    type: GET_ATTRIBUTE_FORMULA,
    _id
  }
}
export function getAttributeFormulaSuccess(data) {
  return {
    type: GET_ATTRIBUTE_FORMULA_SUCCESS,
    data
  }
}
export function getAttributeFormulaFailure(error) {
  return {
    type: GET_ATTRIBUTE_FORMULA_FAILURE,
    error
  }
}

export function addAttributeFormula(data, _id) {
  return {
    type: ADD_ATTRIBUTE_FORMULA,
    data,
    _id
  }
}

export function addAttributeFormulaSuccess(data) {
  return {
    type: ADD_ATTRIBUTE_FORMULA_SUCCESS,
    data
  }
}

export function addAttributeFormulaFailure(error) {
  return {
    type: ADD_ATTRIBUTE_FORMULA_FAILURE,
    error
  }
}

export function updateAttributeFormula(data) {
  return {
    type: UPDATE_ATTRIBUTE_FORMULA,
    data
  }
}

export function updateAttributeFormulaSuccess(data) {
  return {
    type: UPDATE_ATTRIBUTE_FORMULA_SUCCESS,
    data
  }
}

export function updateAttributeFormulaFailure(error) {
  return {
    type: UPDATE_ATTRIBUTE_FORMULA_FAILURE,
    error
  }
}

export function deleteAttributeFormula(_id) {
  return {
    type: DELETE_ATTRIBUTE_FORMULA,
    _id
  }
}

export function deleteAttributeFormulaSuccess(data) {
  return {
    type: DELETE_ATTRIBUTE_FORMULA_SUCCESS,
    data
  }
}

export function deleteAttributeFormulaFailure(error) {
  return {
    type: DELETE_ATTRIBUTE_FORMULA_FAILURE,
    error
  }
}


export function getListAttributeFormula(_id) {
  return {
    type: GET_LIST_ATTRIBUTE,
    _id
  }
}

export function getListAttributeFormulaSuccess(data) {
  return {
    type: GET_LIST_ATTRIBUTE_SUCCESS,
    data
  }
}

export function getListAttributeFormulaFailure(error) {
  return {
    type: GET_LIST_ATTRIBUTE_FAILURE,
    error
  }
}

// thuong du an

export function getProjectBonus() {
  return {
    type: GET_PROJECT_BONUS
  }
}
export function getProjectBonusSuccess(data) {
  return {
    type: GET_PROJECT_BONUS_SUCCESS,
    data
  }
}
export function getProjectBonusFailure(error) {
  return {
    type: GET_PROJECT_BONUS_FAILURE,
    error
  }
}

export function addProjectBonus() {
  return {
    type: ADD_PROJECT_BONUS
  }
}
export function addProjectBonusSuccess(data) {
  return {
    type: ADD_PROJECT_BONUS_SUCCESS,
    data
  }
}
export function addProjectBonusFailure(error) {
  return {
    type: ADD_PROJECT_BONUS_FAILURE,
    error
  }
}

export function updateProjectBonus() {
  return {
    type: UPDATE_PROJECT_BONUS
  }
}
export function updateProjectBonusSuccess(data) {
  return {
    type: UPDATE_PROJECT_BONUS_SUCCESS,
    data
  }
}
export function updateProjectBonusFailure(error) {
  return {
    type: UPDATE_PROJECT_BONUS_FAILURE,
    error
  }
}

export function deleteProjectBonus() {
  return {
    type: DELETE_PROJECT_BONUS
  }
}
export function deleteProjectBonusSuccess(data) {
  return {
    type: DELETE_PROJECT_BONUS_SUCCESS,
    data
  }
}
export function deleteProjectBonusFailure(error) {
  return {
    type: DELETE_PROJECT_BONUS_FAILURE,
    error
  }
}

// them cong thuc tinh don le
export function addSingleAttributeFormula(data) {
  return {
    type: ADD_SINGLE_ATTRIBUTE_FORMULA,
    data
  }
}

export function addSingleAttributeFormulaSuccess(data) {
  return {
    type: ADD_SINGLE_ATTRIBUTE_FORMULA_SUCCESS,
    data
  }
}

export function addSingleAttributeFormulaFailure(error) {
  return {
    type: ADD_SINGLE_ATTRIBUTE_FORMULA_FAILURE,
    error
  }
}

export function updateSingleAttributeFormula(data) {
  return {
    type: UPDATE_SINGLE_ATTRIBUTE_FORMULA,
    data
  }
}

export function updateSingleAttributeFormulaSuccess(data) {
  return {
    type: UPDATE_SINGLE_ATTRIBUTE_FORMULA_SUCCESS,
    data
  }
}

export function updateSingleAttributeFormulaFailure(error) {
  return {
    type: UPDATE_SINGLE_ATTRIBUTE_FORMULA_FAILURE,
    error
  }
}