/*
 *
 * AllocationPage actions
 *
 */

import {
  GET_ASSET,
  GET_ASSET_SUCCESS,
  GET_ASSET_FAILED,
  EDIT_ALLOCATION,
  EDIT_ALLOCATION_SUCCESS,
  EDIT_ALLOCATION_FAILED,
  CLEANUP,
  INDEX_TAB
} from './constants';

export function getAssetAct(body) {
  return {
    type: GET_ASSET,
    body,
  };
}
export function changeTab(body) {
  return {
    type: INDEX_TAB,
    body,
  };
}
export function getAssetSuccess(data) {
  return {
    type: GET_ASSET_SUCCESS,
    data,
  };
}
export function getAssetFailed(err) {
  return {
    type: GET_ASSET_FAILED,
    err,
  };
}

// edit product
export function editAllocationAct(body) {
  return {
    type: EDIT_ALLOCATION,
    body,
  };
}
export function editAllocationSuccess(data) {
  return {
    type: EDIT_ALLOCATION_SUCCESS,
    data,
  };
}
export function editAllocationFailed(err) {
  return {
    type: EDIT_ALLOCATION_FAILED,
    err,
  };
}

export function cleanup() {
  return {
    type: CLEANUP,
  };
}