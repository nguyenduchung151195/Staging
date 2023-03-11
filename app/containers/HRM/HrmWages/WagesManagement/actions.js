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
  GET_ALL_TIMEKEEPING_EQUIPMENT,
  GET_ALL_TIMEKEEPING_EQUIPMENT_SUCCESS,
  GET_ALL_TIMEKEEPING_EQUIPMENT_FAILURE,
  GET_TIMEKEEPING_TO_EQUIPMENT,
  GET_TIMEKEEPING_TO_EQUIPMENT_SUCCESS,
  GET_TIMEKEEPING_TO_EQUIPMENT_FAILURE,
  IMPORT_TIMEKEEPING_FAILURE,
  IMPORT_TIMEKEEPING_SUCCESS,
  IMPORT_TIMEKEEPING,
  ADD_TAKE_LEAVE_MANAGER,
  ADD_TAKE_LEAVE_MANAGER_SUCCESS,
  ADD_TAKE_LEAVE_MANAGER_FAILURE,
  UPDATE_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER_SUCCESS,
  UPDATE_TAKE_LEAVE_MANAGER_FAILURE,
  DELETE_TAKE_LEAVE_MANAGER,
  DELETE_TAKE_LEAVE_MANAGER_SUCCESS,
  DELETE_TAKE_LEAVE_MANAGER_FAILURE,
  GET_ALL_VACATION_MODE,
  GET_ALL_VACATION_MODE_SUCCESS,
  GET_ALL_VACATION_MODE_FAILURE,
  // ADD_OVER_TIME_MANAGER,
  // ADD_OVER_TIME_MANAGER_SUCCESS,
  // ADD_OVER_TIME_MANAGER_FAILURE,
  // UPDATE_OVER_TIME_MANAGER,
  // UPDATE_OVER_TIME_MANAGER_SUCCESS,
  // UPDATE_OVER_TIME_MANAGER_FAILURE,
  // DELETE_OVER_TIME_MANAGER,
  // DELETE_OVER_TIME_MANAGER_SUCCESS,
  // DELETE_OVER_TIME_MANAGER_FAILURE,
  ADD_PLAN_OT_SUCCESS,
  ADD_PLAN_OT,
  ADD_PLAN_OT_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
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
    ids,
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

export function getAllTimekeepingEquipment() {
  return {
    type: GET_ALL_TIMEKEEPING_EQUIPMENT,
  };
}
export function getAllTimekeepingEquipmentSuccess(data) {
  return {
    type: GET_ALL_TIMEKEEPING_EQUIPMENT_SUCCESS,
    data,
  };
}
export function getAllTimekeepingEquipmentFailure(error) {
  return {
    type: GET_ALL_TIMEKEEPING_EQUIPMENT_FAILURE,
    error,
  };
}

export function getTimekeepingToEquipment(_id) {
  return {
    type: GET_TIMEKEEPING_TO_EQUIPMENT,
    _id,
  };
}
export function getTimekeepingToEquipmentSuccess(data) {
  return {
    type: GET_TIMEKEEPING_TO_EQUIPMENT_SUCCESS,
    data,
  };
}
export function getTimekeepingToEquipmentFailure(error) {
  return {
    type: GET_TIMEKEEPING_TO_EQUIPMENT_FAILURE,
    error,
  };
}

export function importTimeKeeping(data) {
  return {
    type: IMPORT_TIMEKEEPING,
    data,
  };
}

export function importTimeKeepingSuccess(data) {
  return {
    type: IMPORT_TIMEKEEPING_SUCCESS,
    data,
  };
}

export function importTimeKeepingFailure(error) {
  return {
    type: IMPORT_TIMEKEEPING_FAILURE,
    error,
  };
}

// quan ly ngay nghi phep
export function addTakeLeaveManager(data) {
  return {
    type: ADD_TAKE_LEAVE_MANAGER,
    data,
  };
}

export function addTakeLeaveManagerSuccess(data) {
  return {
    type: ADD_TAKE_LEAVE_MANAGER_SUCCESS,
    data,
  };
}

export function addTakeLeaveManagerFailure(error) {
  return {
    type: ADD_TAKE_LEAVE_MANAGER_FAILURE,
    error,
  };
}

export function updateTakeLeaveManager(data) {
  return {
    type: UPDATE_TAKE_LEAVE_MANAGER,
    data,
  };
}

export function updateTakeLeaveManagerSuccess(data) {
  return {
    type: UPDATE_TAKE_LEAVE_MANAGER_SUCCESS,
    data,
  };
}

export function updateTakeLeaveManagerFailure(error) {
  return {
    type: UPDATE_TAKE_LEAVE_MANAGER_FAILURE,
    error,
  };
}

export function deleteTakeLeaveManager(ids) {
  return {
    type: DELETE_TAKE_LEAVE_MANAGER,
    ids,
  };
}

export function deleteTakeLeaveManagerSuccess(data) {
  return {
    type: DELETE_TAKE_LEAVE_MANAGER_SUCCESS,
    data,
  };
}

export function deleteTakeLeaveManagerFailure(error) {
  return {
    type: DELETE_TAKE_LEAVE_MANAGER_FAILURE,
    error,
  };
}

// chế độ nghỉ
export function getAllVacationMode() {
  return {
    type: GET_ALL_VACATION_MODE,
  };
}
export function getAllVacationModeSuccess(data) {
  return {
    type: GET_ALL_VACATION_MODE_SUCCESS,
    data,
  };
}
export function getAllVacationModeFailure(error) {
  return {
    type: GET_ALL_VACATION_MODE_FAILURE,
    error,
  };
}

// ke hoach OT
export function addPlanOverTime(data) {
  return {
    type: ADD_PLAN_OT,
    data
  }
}
export function addPlanOverTimeSuccess(data) {
  return {
    type: ADD_PLAN_OT_SUCCESS,
    data
  }
}
export function addPlanOverTimeFailure(error) {
  return {
    type: ADD_PLAN_OT_FAILURE,
    error
  }
}