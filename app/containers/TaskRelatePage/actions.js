/*
 *
 * TaskRelatePage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, SET_STATE, GET_TASK_RELATE, GET_TASK_RELATE_SUCCESS, POST_TASK, POST_TASK_SUCCESS } from './constants';

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
export function getTaskRelatePage() {
  return {
    type: GET_TASK_RELATE,
  };
}
export function getTaskRelatePageSuccess(profile, tasks, users) {
  return {
    type: GET_TASK_RELATE_SUCCESS,
    profile,
    tasks,
    users,
  };
}

export const handleChange = (name, value) => ({ type: SET_STATE, name, value });

export function postTask(data, id) {
  return {
    type: POST_TASK,
    data,
    id,
  };
}
export function postTaskSuccess(
  taskSelect,
  inChargeSelect,
  viewableSelect,
  stopSelect,
  cancelSelect,
  doingSelect,
  progressSelect,
  completeSelect,
  completeSlowSelect,
) {
  return {
    type: POST_TASK_SUCCESS,
    taskSelect,
    inChargeSelect,
    viewableSelect,
    stopSelect,
    cancelSelect,
    doingSelect,
    progressSelect,
    completeSelect,
    completeSlowSelect,
  };
}
