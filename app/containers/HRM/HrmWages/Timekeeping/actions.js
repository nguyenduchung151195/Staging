/*
 *
 * WagesManagement actions
 *
 */

import {
  MERGE_DATA,
  CREATE_WAGES,
  CREATE_WAGES_SUCCESS,
  CREATE_WAGES_FAILURE,
  DEFAULT_ACTION,
  UPDATE_WAGES,
  UPDATE_WAGES_SUCCESS,
  UPDATE_WAGES_FAILURE,
  DELETE_WAGES,
  DELETE_WAGES_SUCCESS,
  DELETE_WAGES_FAILURE,
  GET_TIMEKEEPINGS,
  GET_TIMEKEEPINGS_SUCCESS,
  GET_TIMEKEEPINGS_FAILURE,
  UPDATE_TIMEKEEPING_CELL,
  UPDATE_TIMEKEEPING_CELL_SUCCESS,
  UPDATE_TIMEKEEPING_CELL_FAILURE,
  GET_ALL_TIMEKEEP_TYPE,
  GET_ALL_TIMEKEEP_TYPE_SUCCESS,
  GET_ALL_TIMEKEEP_TYPE_FAILER,
  GET_TIMEKEEP_TYPE_PAGE
} from './constants';

export function getTimekeepings(data) {
  return {
    type: GET_TIMEKEEPINGS,
    data,
  }
}

export function getTimekeepingsSuccess(data) {
  return {
    type: GET_TIMEKEEPINGS_SUCCESS,
    data
  }
}

export function getTimekeepingsFailure(error) {
  return {
    type: GET_TIMEKEEPINGS_FAILURE,
    error
  }
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data
  }
}

export function createWages(data) {
  return {
    type: CREATE_WAGES,
    data,
  };
}

export function createWagesSuccess(data) {
  return {
    type: CREATE_WAGES_SUCCESS,
    data,
  };
}

export function createWagesFailure(error) {
  return {
    type: CREATE_WAGES_FAILURE,
    error,
  };
}

export function updateWages(hrmEmployeeId, data) {
  return {
    type: UPDATE_WAGES,
    hrmEmployeeId,
    data,
  };
}

export function updateWagesSuccess(data) {
  return {
    type: UPDATE_WAGES_SUCCESS,
    data,
  };
}

export function updateWagesFailure(error) {
  return {
    type: UPDATE_WAGES_FAILURE,
    error,
  };
}

export function deleteWages(hrmEmployeeId, ids) {
  return {
    type: DELETE_WAGES,
    hrmEmployeeId,
    ids
  };
}

export function deleteWagesSuccess(data) {
  return {
    type: DELETE_WAGES_SUCCESS,
    data,
  };
}

export function deleteWagesFailure(error) {
  return {
    type: DELETE_WAGES_FAILURE,
    error,
  };
}

export function updateCellData(data) {
  return {
    type: UPDATE_TIMEKEEPING_CELL,
    data,
  };
}

export function updateCellDataSuccess(data) {
  return {
    type: UPDATE_TIMEKEEPING_CELL_SUCCESS,
    data,
  };
}

export function updateCellDataFailure(error) {
  return {
    type: UPDATE_TIMEKEEPING_CELL_FAILURE,
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

export function pagingPanel(pageData){
  return{
    type: GET_TIMEKEEP_TYPE_PAGE,
    data: pageData
  }
}