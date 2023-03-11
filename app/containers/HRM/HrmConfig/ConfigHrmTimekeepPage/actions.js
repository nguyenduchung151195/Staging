import {
  GET_ALL_HOLIDAY,
  GET_ALL_HOLIDAY_FAILER,
  GET_ALL_HOLIDAY_SUCCESS,
  MERGE_DATA,
  GET_ALL_TIMEKEEP_TYPE,
  GET_ALL_TIMEKEEP_TYPE_SUCCESS,
  GET_ALL_TIMEKEEP_TYPE_FAILER,
  GET_ALL_CONFIG_TIMEKEEPING,
  GET_ALL_CONFIG_TIMEKEEPING_SUCCESS,
  GET_ALL_CONFIG_TIMEKEEPING_FAILER,
  GET_ALL_SYMBOL,
  GET_ALL_SYMBOL_SUCCESS,
  GET_ALL_SYMBOL_FAILER,
  GET_EDIT_EMPLOYEES,
  GET_EDIT_EMPLOYEES_FAILER,
  GET_EDIT_EMPLOYEES_SUCCESS,
  ADD_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  ADD_HOLIDAY_FAILER,
  ADD_TIMEKEEP_TYPE,
  ADD_TIMEKEEP_TYPE_SUCCESS,
  ADD_TIMEKEEP_TYPE_FAILER,
  ADD_CONFIG_TIMEKEEPING,
  ADD_CONFIG_TIMEKEEPING_SUCCESS,
  ADD_CONFIG_TIMEKEEPING_FAILER,
  ADD_SYMBOL,
  ADD_SYMBOL_SUCCESS,
  ADD_SYMBOL_FAILER,
  ADD_EDIT_EMPLOYEES,
  ADD_EDIT_EMPLOYEES_FAILER,
  ADD_EDIT_EMPLOYEES_SUCCESS,
  DELETE_HOLIDAY,
  DELETE_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY_FAILER,
  DELETE_SYMBOL,
  DELETE_TIMEKEEP_TYPE,
  DELETE_TIMEKEEP_TYPE_FAILER,
  DELETE_TIMEKEEP_TYPE_SUCCESS,
  DELETE_CONFIG_TIMEKEEPING,
  DELETE_CONFIG_TIMEKEEPING_FAILER,
  DELETE_CONFIG_TIMEKEEPING_SUCCESS,
  DELETE_SYMBOL_SUCCESS,
  DELETE_SYMBOL_FAILER,
  DELETE_EDIT_EMPLOYEES,
  DELETE_EDIT_EMPLOYEES_FAILER,
  DELETE_EDIT_EMPLOYEES_SUCCESS,
  UPDATE_SYMBOL_FAILER,
  UPDATE_SYMBOL_SUCCESS,
  UPDATE_SYMBOL,
  UPDATE_TIMEKEEP_TYPE,
  UPDATE_TIMEKEEP_TYPE_FAILER,
  UPDATE_TIMEKEEP_TYPE_SUCCESS,
  UPDATE_CONFIG_TIMEKEEPING,
  UPDATE_CONFIG_TIMEKEEPING_FAILER,
  UPDATE_CONFIG_TIMEKEEPING_SUCCESS,
  UPDATE_HOLIDAY_SUCCESS,
  UPDATE_HOLIDAY,
  UPDATE_HOLIDAY_FAILER,
  UPDATE_EDIT_EMPLOYEES,
  UPDATE_EDIT_EMPLOYEES_FAILER,
  UPDATE_EDIT_EMPLOYEES_SUCCESS,
  GET_ALL_SHIFT,
  GET_ALL_SHIFT_SUCCESS,
  GET_ALL_SHIFT_FAILURE,
  ADD_SHIFT,
  ADD_SHIFT_SUCCESS,
  ADD_SHIFT_FAILURE,
  UPDATE_SHIFT,
  UPDATE_SHIFT_SUCCESS,
  UPDATE_SHIFT_FAILURE,
  DELETE_SHIFT,
  DELETE_SHIFT_SUCCESS,
  DELETE_SHIFT_FAILURE,
} from './constants';

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getAllHoliday() {
  return {
    type: GET_ALL_HOLIDAY,
  };
}

export function getAllHolidaySuccess(data) {
  return {
    type: GET_ALL_HOLIDAY_SUCCESS,
    data,
  };
}

export function getAllHolidayFailer(error) {
  return {
    type: GET_ALL_HOLIDAY_FAILER,
    error,
  };
}

export function getAllTimekeepType() {
  return {
    type: GET_ALL_TIMEKEEP_TYPE,
  };
}

export function getAllTimekeepTypeSuccess(data) {
  return {
    type: GET_ALL_TIMEKEEP_TYPE_SUCCESS,
    data,
  };
}

export function getAllTimekeepTypeFailer(error) {
  return {
    type: GET_ALL_TIMEKEEP_TYPE_FAILER,
    error,
  };
}

export function getAllConfigTimekeeping() {
  return {
    type: GET_ALL_CONFIG_TIMEKEEPING,
  };
}

export function getAllConfigTimekeepingSuccess(data) {
  return {
    type: GET_ALL_CONFIG_TIMEKEEPING_SUCCESS,
    data,
  };
}

export function getAllConfigTimekeepingFailer(error) {
  return {
    type: GET_ALL_CONFIG_TIMEKEEPING_FAILER,
    error,
  };
}

export function getAllSymbol() {
  return {
    type: GET_ALL_SYMBOL,
  };
}

export function getAllSymbolSuccess(data) {
  return {
    type: GET_ALL_SYMBOL_SUCCESS,
    data,
  };
}

export function getEditEmployees(data) {
  return {
    type: GET_EDIT_EMPLOYEES,
    data,
  };
}

export function getEditEmployeesSuccess(data) {
  return {
    type: GET_EDIT_EMPLOYEES_SUCCESS,
    data,
  };
}

export function getEditEmployeesFailer(data) {
  return {
    type: GET_EDIT_EMPLOYEES_FAILER,
    data,
  };
}

export function getAllSymbolFailer(error) {
  return {
    type: GET_ALL_SYMBOL_FAILER,
    error,
  };
}

export function addHoliday(data) {
  return {
    type: ADD_HOLIDAY,
    data,
  };
}

export function addHolidaySuccess(data) {
  return {
    type: ADD_HOLIDAY_SUCCESS,
    data,
  };
}

export function addHolidayFailer(error) {
  return {
    type: ADD_HOLIDAY_FAILER,
    error,
  };
}

export function addTimekeepType(data) {
  return {
    type: ADD_TIMEKEEP_TYPE,
    data,
  };
}

export function addTimekeepTypeSuccess(data) {
  return {
    type: ADD_TIMEKEEP_TYPE_SUCCESS,
    data,
  };
}

export function addTimekeepTypeFailer(error) {
  return {
    type: ADD_TIMEKEEP_TYPE_FAILER,
    error,
  };
}

export function addConfigTimekeeping(data) {
  return {
    type: ADD_CONFIG_TIMEKEEPING,
    data,
  };
}

export function addConfigTimekeepingSuccess(data) {
  return {
    type: ADD_CONFIG_TIMEKEEPING_SUCCESS,
    data,
  };
}

export function addConfigTimekeepingFailer(error) {
  return {
    type: ADD_CONFIG_TIMEKEEPING_FAILER,
    error,
  };
}

export function addSymbol(data) {
  return {
    type: ADD_SYMBOL,
    data,
  };
}

export function addSymbolSuccess(data) {
  return {
    type: ADD_SYMBOL_SUCCESS,
    data,
  };
}

export function addSymbolFailer(error) {
  return {
    type: ADD_SYMBOL_FAILER,
    error,
  };
}

export function addEditEmployees(data) {
  return {
    type: ADD_EDIT_EMPLOYEES,
    data,
  };
}

export function addEditEmployeesSuccess(data) {
  return {
    type: ADD_EDIT_EMPLOYEES_SUCCESS,
    data,
  };
}

export function addEditEmployeesFailer(data) {
  return {
    type: ADD_EDIT_EMPLOYEES_FAILER,
    data,
  };
}

// update
export function updateHoliday(data) {
  return {
    type: UPDATE_HOLIDAY,
    data,
  };
}

export function updateHolidaySuccess(data) {
  return {
    type: UPDATE_HOLIDAY_SUCCESS,
    data,
  };
}

export function updateHolidayFailer(error) {
  return {
    type: UPDATE_HOLIDAY_FAILER,
    error,
  };
}

export function updateTimekeepType(data) {
  return {
    type: UPDATE_TIMEKEEP_TYPE,
    data,
  };
}

export function updateTimekeepTypeSuccess(data) {
  return {
    type: UPDATE_TIMEKEEP_TYPE_SUCCESS,
    data,
  };
}

export function updateTimekeepTypeFailer(error) {
  return {
    type: UPDATE_TIMEKEEP_TYPE_FAILER,
    error,
  };
}

export function updateConfigTimekeeping(data) {
  return {
    type: UPDATE_CONFIG_TIMEKEEPING,
    data,
  };
}

export function updateConfigTimekeepingSuccess(data) {
  return {
    type: UPDATE_CONFIG_TIMEKEEPING_SUCCESS,
    data,
  };
}

export function updateConfigTimekeepingFailer(error) {
  return {
    type: UPDATE_CONFIG_TIMEKEEPING_FAILER,
    error,
  };
}

export function updateSymbol(data) {
  return {
    type: UPDATE_SYMBOL,
    data,
  };
}

export function updateSymbolSuccess(data) {
  return {
    type: UPDATE_SYMBOL_SUCCESS,
    data,
  };
}

export function updateSymbolFailer(error) {
  return {
    type: UPDATE_SYMBOL_FAILER,
    error,
  };
}

export function updateEditEmployees(data) {
  return {
    type: UPDATE_EDIT_EMPLOYEES,
    data,
  };
}

export function updateEditEmployeesSuccess(data) {
  return {
    type: UPDATE_EDIT_EMPLOYEES_SUCCESS,
    data,
  };
}

export function updateEditEmployeesFailer(data) {
  return {
    type: UPDATE_EDIT_EMPLOYEES_FAILER,
    data,
  };
}

// delete
export function deleteHoliday(_id) {
  return {
    type: DELETE_HOLIDAY,
    _id,
  };
}

export function deleteHolidaySuccess(data) {
  return {
    type: DELETE_HOLIDAY_SUCCESS,
    data,
  };
}

export function deleteHolidayFailer(error) {
  return {
    type: DELETE_HOLIDAY_FAILER,
    error,
  };
}

export function deleteTimekeepType(_id) {
  return {
    type: DELETE_TIMEKEEP_TYPE,
    _id,
  };
}

export function deleteTimekeepTypeSuccess(data) {
  return {
    type: DELETE_TIMEKEEP_TYPE_SUCCESS,
    data,
  };
}

export function deleteTimekeepTypeFailer(error) {
  return {
    type: DELETE_TIMEKEEP_TYPE_FAILER,
    error,
  };
}

export function deleteConfigTimekeeping(_id) {
  return {
    type: DELETE_CONFIG_TIMEKEEPING,
    _id,
  };
}

export function deleteConfigTimekeepingSuccess(data) {
  return {
    type: DELETE_CONFIG_TIMEKEEPING_SUCCESS,
    data,
  };
}

export function deleteConfigTimekeepingFailer(error) {
  return {
    type: DELETE_CONFIG_TIMEKEEPING_FAILER,
    error,
  };
}

export function deleteSymbol(_id) {
  return {
    type: DELETE_SYMBOL,
    _id,
  };
}

export function deleteSymbolSuccess(data) {
  return {
    type: DELETE_SYMBOL_SUCCESS,
    data,
  };
}

export function deleteSymbolFailer(error) {
  return {
    type: DELETE_SYMBOL_FAILER,
    error,
  };
}

export function deleteEditEmployees(data) {
  return {
    type: DELETE_EDIT_EMPLOYEES,
    data,
  };
}

export function deleteEditEmployeesSuccess(data) {
  return {
    type: DELETE_EDIT_EMPLOYEES_SUCCESS,
    data,
  };
}

export function deleteEditEmployeesFailer(data) {
  return {
    type: DELETE_EDIT_EMPLOYEES_FAILER,
    data,
  };
}

// shifts
export function getAllShift() {
  return {
    type: GET_ALL_SHIFT
  }
}

export function getAllShiftSuccess(data) {
  return {
    type: GET_ALL_SHIFT_SUCCESS,
    data
  }
}

export function getAllShiftFailure(error) {
  return {
    type: GET_ALL_SHIFT_FAILURE,
    error
  }
}

export function addShift(data) {
  return {
    type: ADD_SHIFT,
    data
  }
}

export function addShiftSuccess(data) {
  return {
    type: ADD_SHIFT_SUCCESS,
    data
  }
}

export function addShiftFailure(error) {
  return {
    type: ADD_SHIFT_FAILURE,
    error
  }
}

export function updateShift(data) {
  return {
    type: UPDATE_SHIFT,
    data
  }
}

export function updateShiftSuccess(data) {
  return {
    type: UPDATE_SHIFT_SUCCESS,
    data
  }
}

export function updateShiftFailure(error) {
  return {
    type: UPDATE_SHIFT_FAILURE,
    error
  }
}

export function deleteShift(_id) {
  return {
    type: DELETE_SHIFT,
    _id
  }
}

export function deleteShiftSuccess(data) {
  return {
    type: DELETE_SHIFT_SUCCESS,
    data
  }
}

export function deleteShiftFailure(error) {
  return {
    type: DELETE_SHIFT_FAILURE,
    error
  }
}
