/*
 *
 * ConfigTask actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CONFIG,
  GET_CONFIG_SUCCSESS,
  MERGE_DATA,
  POST_CONFIG,
  POST_CONFIG_SUCCESS,
  GET_DEFAULT,
  PUT_CONFIG,
  PUT_CONFIG_SUCCESS,
  DELETE_CONFIG,
  DELETE_CONFIG_SUCCESS,
  PUT_CONFIG_PARENT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getConfig() {
  return {
    type: GET_CONFIG,
  };
}

export function getConfigSuccess(config) {
  return {
    type: GET_CONFIG_SUCCSESS,
    config,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function postConfig(data, id) {
  return {
    type: POST_CONFIG,
    data,
    id,
  };
}
export function postConfigSuccess(data) {
  return {
    type: POST_CONFIG_SUCCESS,
    data,
  };
}
export function getDefault(data) {
  return {
    type: GET_DEFAULT,
    data,
  };
}
export function putConfig(data, id, configId) {
  return {
    type: PUT_CONFIG,
    data,
    id,
    configId,
  };
}
export function putConfigSuccess(data) {
  return {
    type: PUT_CONFIG_SUCCESS,
    data,
  };
}
export function deleteConfig(id, configId) {
  return {
    type: DELETE_CONFIG,
    id,
    configId,
  };
}
export function deleteConfigSuccess(data) {
  return {
    type: DELETE_CONFIG_SUCCESS,
    data,
  };
}

export function putConfigParent(data) {
  return {
    type: PUT_CONFIG_PARENT,
    data,
  };
}
