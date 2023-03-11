/*
 *
 * AddKpiConfig actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_CONFIG,
  POST_CONFIG_SUCCESS,
  GET_DEFAULT,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  PUT_CONFIG,
  PUT_CONFIG_SUCCESS,
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

export function postConfig(data) {
  return {
    type: POST_CONFIG,
    data,
  };
}

export function postConfigSuccess(data) {
  return {
    type: POST_CONFIG_SUCCESS,
    data,
  };
}

export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}

export function getCurrentConfig(id) {
  return {
    type: GET_CURRENT,
    id,
  };
}

export function getCurrentConfigSuccess(data) {
  return {
    type: GET_CURRENT_SUCCESS,
    data,
  };
}

export function putConfig(data, id) {
  return {
    type: PUT_CONFIG,
    data,
    id,
  };
}

export function putConfigSuccess(data) {
  return {
    type: PUT_CONFIG_SUCCESS,
    data,
  };
}
