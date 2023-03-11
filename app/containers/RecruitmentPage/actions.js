/*
 *
 * RecruitmentPage actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA,
  POST_DATA_SUCCESS,
  GET_DATA,
  GET_DATA_SUCCESS,
  GET_DEFAULT,
  GET_CUREENT,
  GET_CUREENT_SUCCESS,
  PUT_DATA,
  PUT_DATA_SUCCESS,
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
export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(data) {
  return {
    type: GET_DATA_SUCCESS,
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
    type: GET_CUREENT,
    id,
  };
}
export function getCurrentSucess(data) {
  return {
    type: GET_CUREENT_SUCCESS,
    data,
  };
}
export function putData(id, data) {
  return {
    type: PUT_DATA,
    id,
    data,
  };
}
export function putDataSuccess(data) {
  return {
    type: PUT_DATA_SUCCESS,
    data,
  };
}
