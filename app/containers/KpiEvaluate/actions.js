/*
 *
 * KpiEvaluate actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_PROCESS,
  POST_PROCESS_SUCCESS,
  GET_PROCESS_CURRENT,
  GET_PROCESS_CURRENT_SUCCESS,
  PUT_PROCESS,
  PUT_PROCESS_SUCCESS,
  GET_DEFAULT,
  POST_EVALUATE,
  POST_EVALUATE_SUCCESS,
  GET_EVALUATE_CURRENT,
  GET_EVALUATE_CURRENT_SUCCESS,
  PUT_EVALUATE,
  PUT_EVALUATE_SUCCESS,
  POST_PROCESS_GROUP,
  POST_PROCESS_GROUP_SUCCESS,
  GET_PROCESS_GROUP_CURRENT,
  GET_PROCESS_GROUP_CURRENT_SUCCESS,
  PUT_PROCESS_GROUP,
  PUT_PROCESS_GROUP_SUCCESS,
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

export function postProcess(data) {
  return {
    type: POST_PROCESS,
    data,
  };
}
export function postProcessSuccess(data) {
  return {
    type: POST_PROCESS_SUCCESS,
    data,
  };
}

export function getProcessCurrent(id) {
  return {
    type: GET_PROCESS_CURRENT,
    id,
  };
}
export function getProcessCurrentSuccess(data) {
  return {
    type: GET_PROCESS_CURRENT_SUCCESS,
    data,
  };
}

export function putProcess(data, id) {
  return {
    type: PUT_PROCESS,
    data,
    id,
  };
}
export function putProcessSuccess(data) {
  return {
    type: PUT_PROCESS_SUCCESS,
    data,
  };
}

export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}

export function postEvaluate(data) {
  return {
    type: POST_EVALUATE,
    data,
  };
}
export function postEvaluateSuccess(data) {
  return {
    type: POST_EVALUATE_SUCCESS,
    data,
  };
}

export function getEvaluateCurrent(id) {
  return {
    type: GET_EVALUATE_CURRENT,
    id,
  };
}
export function getEvaluateCurrentSuccess(data) {
  return {
    type: GET_EVALUATE_CURRENT_SUCCESS,
    data,
  };
}

export function putEvaluate(data, id) {
  return {
    type: PUT_EVALUATE,
    data,
    id,
  };
}
export function putEvaluateSuccess(data) {
  return {
    type: PUT_EVALUATE_SUCCESS,
    data,
  };
}

export function postProcessGroup(data) {
  return {
    type: POST_PROCESS_GROUP,
    data,
  };
}
export function postProcessGroupSuccess(data) {
  return {
    type: POST_PROCESS_GROUP_SUCCESS,
    data,
  };
}

export function getProcessGroupCurrent(id) {
  return {
    type: GET_PROCESS_GROUP_CURRENT,
    id,
  };
}
export function getProcessGroupCurrentSuccess(data) {
  return {
    type: GET_PROCESS_GROUP_CURRENT_SUCCESS,
    data,
  };
}

export function putProcessGroup(data, id) {
  return {
    type: PUT_PROCESS_GROUP,
    data,
    id,
  };
}
export function putProcessGroupSuccess(data) {
  return {
    type: PUT_PROCESS_GROUP_SUCCESS,
    data,
  };
}
