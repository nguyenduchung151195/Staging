import {
  GET_ALL_HOLIDAY,
  GET_ALL_HOLIDAY_FAILER,
  GET_ALL_HOLIDAY_SUCCESS,
  MERGE_DATA,
  GET_ALL_TIMEKEEP_TYPE,
  GET_ALL_TIMEKEEP_TYPE_SUCCESS,
  GET_ALL_TIMEKEEP_TYPE_FAILER,
  GET_ALL_SYMBOL,
  GET_ALL_SYMBOL_SUCCESS,
  GET_ALL_SYMBOL_FAILER,
  ADD_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  ADD_HOLIDAY_FAILER,
  ADD_TIMEKEEP_TYPE,
  ADD_TIMEKEEP_TYPE_SUCCESS,
  ADD_TIMEKEEP_TYPE_FAILER,
  ADD_SYMBOL,
  ADD_SYMBOL_SUCCESS,
  ADD_SYMBOL_FAILER,
  DELETE_HOLIDAY,
  DELETE_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY_FAILER,
  DELETE_SYMBOL,
  DELETE_TIMEKEEP_TYPE_FAILER,
  DELETE_TIMEKEEP_TYPE,
  DELETE_TIMEKEEP_TYPE_SUCCESS,
  DELETE_SYMBOL_SUCCESS,
  DELETE_SYMBOL_FAILER,
  UPDATE_SYMBOL_FAILER,
  UPDATE_SYMBOL_SUCCESS,
  UPDATE_SYMBOL,
  UPDATE_TIMEKEEP_TYPE_FAILER,
  UPDATE_TIMEKEEP_TYPE_SUCCESS,
  UPDATE_HOLIDAY_SUCCESS,
  UPDATE_HOLIDAY,
  UPDATE_HOLIDAY_FAILER,
  UPDATE_TIMEKEEP_TYPE,
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
