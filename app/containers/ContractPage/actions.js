/*
 *
 * Contract actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CONTRACT_ACT,
  GET_CONTRACT_SUCCESS,
  GET_CONTRACT_FALSE,
  DELETE_CONTRACT_SUCCESS,
  DELETE_CONTRACT,
  DELETE_CONTRACT_FAILED,
  UPDATE_STATUS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAILED,
  CHANGE_TAB,
  MERGE_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}
export function getContract(query) {
  return {
    type: GET_CONTRACT_ACT,
    query,
  };
}

export function getContractSuccess(data) {
  return {
    type: GET_CONTRACT_SUCCESS,
    data,
  };
}

export function getContractFalse(err) {
  return {
    type: GET_CONTRACT_FALSE,
    err,
  };
}
export function deleteContract(body) {
  return {
    type: DELETE_CONTRACT,
    body,
  };
}

export function deleteContractSuccess(data) {
  return {
    type: DELETE_CONTRACT_SUCCESS,
    data,
  };
}

export function deleteContractFailed(err) {
  return {
    type: DELETE_CONTRACT_FAILED,
    err,
  };
}

export function UpdateStatusAct(body) {
  return {
    type: UPDATE_STATUS,
    body,
  };
}

export function UpdateStatusSuccess(data) {
  return {
    type: UPDATE_STATUS_SUCCESS,
    data,
  };
}

export function UpdateStatusFailed(err) {
  return {
    type: UPDATE_STATUS_FAILED,
    err,
  };
}

export function mergeDataContract(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
