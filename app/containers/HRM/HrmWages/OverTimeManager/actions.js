/*
 *
 * WagesManagement actions
 *
 */

import {
  MERGE_DATA,
  ADD_OVER_TIME_MANAGER,
  ADD_OVER_TIME_MANAGER_SUCCESS,
  ADD_OVER_TIME_MANAGER_FAILURE,
  UPDATE_OVER_TIME_MANAGER,
  UPDATE_OVER_TIME_MANAGER_SUCCESS,
  UPDATE_OVER_TIME_MANAGER_FAILURE,
  DELETE_OVER_TIME_MANAGER,
  DELETE_OVER_TIME_MANAGER_SUCCESS,
  DELETE_OVER_TIME_MANAGER_FAILURE,
  ADD_PLAN_OT_SUCCESS,
  ADD_PLAN_OT,
  ADD_PLAN_OT_FAILURE,
  UPDATE_PLAN_OT,
  UPDATE_PLAN_OT_SUCCESS,
  UPDATE_PLAN_OT_FAILURE,
  DELETE_PLAN_OT,
  DELETE_PLAN_OT_SUCCESS,
  DELETE_PLAN_OT_FAILURE,
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

export function addOverTimeManager(data) {
  return {
    type: ADD_OVER_TIME_MANAGER,
    data,
  };
}

export function addOverTimeManagerSuccess(data) {
  return {
    type: ADD_OVER_TIME_MANAGER_SUCCESS,
    data,
  };
}

export function addOverTimeManagerFailure(error) {
  return {
    type: ADD_OVER_TIME_MANAGER_FAILURE,
    error,
  };
}

export function updateOverTimeManager(data) {
  return {
    type: UPDATE_OVER_TIME_MANAGER,
    data,
  };
}

export function updateOverTimeManagerSuccess(data) {
  return {
    type: UPDATE_OVER_TIME_MANAGER_SUCCESS,
    data,
  };
}

export function updateOverTimeManagerFailure(error) {
  return {
    type: UPDATE_OVER_TIME_MANAGER_FAILURE,
    error,
  };
}

export function deleteOverTimeManager(data) {
  return {
    type: DELETE_OVER_TIME_MANAGER,
    data,
  };
}

export function deleteOverTimeManagerSuccess(data) {
  return {
    type: DELETE_OVER_TIME_MANAGER_SUCCESS,
    data,
  };
}

export function deleteOverTimeManagerFailure(error) {
  return {
    type: DELETE_OVER_TIME_MANAGER_FAILURE,
    error,
  };
}

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

export function updatePlanOverTime(data) {
  return {
    type: UPDATE_PLAN_OT,
    data
  }
}
export function updatePlanOverTimeSuccess(data) {
  return {
    type: UPDATE_PLAN_OT_SUCCESS,
    data
  }
}
export function updatePlanOverTimeFailure(error) {
  return {
    type: UPDATE_PLAN_OT_FAILURE,
    error
  }
}

export function deletePlanOverTime(data) {
  return {
    type: DELETE_PLAN_OT,
    data,
  };
}

export function deletePlanOverTimeSuccess(data) {
  return {
    type: DELETE_PLAN_OT_SUCCESS,
    data,
  };
}

export function deletePlanOverTimeFailure(error) {
  return {
    type: DELETE_PLAN_OT_FAILURE,
    error,
  };
}