/*
 *
 * AddEmailCampaign actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_DATA,
  GET_DATA_SUCCESS,
  POST_DATA,
  POST_DATA_SUCCESS,
  GET_DEFAULT,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
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

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(data, customers) {
  return {
    type: GET_DATA_SUCCESS,
    data,
    customers,
  };
}

export function postData(data) {
  return {
    type: POST_DATA,
    data,
  };
}
export function putData(data, id) {
  return {
    type: "PUT_DATA_CD_PAGE",
    data,
    id
  };
}
export function postDataSuccess(data) {
  return {
    type: POST_DATA_SUCCESS,
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
