/*
 *
 * AddWorkingSchedule actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA,
  POST_DATA_SUCCESS,
  GET_DEFAULT,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  PUT_DATA,
  PUT_DATA_SUCCESS,
  GET_DATA,
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
    type: POST_DATA,
    data,
  };
}

export function postDataSuccess(data) {
  return {
    type: POST_DATA_SUCCESS,
    data,
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

export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}

export function putData(data, id) {
  return {
    type: PUT_DATA,
    data,
    id,
  };
}

export function putDataSuccess(data) {
  return {
    type: PUT_DATA_SUCCESS,
    data,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}
