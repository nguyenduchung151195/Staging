/*
 *
 * AddKpiEvaluate actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_EVALUATE,
  POST_EVALUATE_SUCCESS,
  GET_DEFAULT,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  PUT_EVALUATE,
  PUT_EVALUATE_SUCCESS,
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

export function postData(data) {
  return {
    type: POST_EVALUATE,
    data,
  };
}

export function postDataSuccess(data) {
  return {
    type: POST_EVALUATE_SUCCESS,
    data,
  };
}

export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}

export function getCurrent(id) {
  return {
    type: GET_CURRENT,
    id,
  };
}

export function getCurrentSuccess(data) {
  return {
    type: GET_CURRENT_SUCCESS,
    data,
  };
}

export function putData(id, data) {
  return {
    type: PUT_EVALUATE,
    id,
    data,
  };
}

export function putDataSuccess(data) {
  return {
    type: PUT_EVALUATE_SUCCESS,
    data,
  };
}
