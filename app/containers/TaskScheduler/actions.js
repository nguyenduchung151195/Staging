/*
 *
 * TaskScheduler actions
 *
 */

import { DEFAULT_ACTION, GET_TASKS, MERGE_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getTasks() {
  return {
    type: GET_TASKS,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
