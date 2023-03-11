/*
 *
 * CrmCollection actions
 *
 */

import { DEFAULT_ACTION, GET_ALL_COLLECTION, GET_ALL_COLLECTION_SUCCESS, GET_ALL_COLLECTION_FALSE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAllCollection() {
  return {
    type: GET_ALL_COLLECTION,
  };
}
export function getAllCRMCollectionSuccess(data) {
  return {
    type: GET_ALL_COLLECTION_SUCCESS,
    data,
  };
}
export function getAllCRMCollectionFalse(err) {
  return {
    type: GET_ALL_COLLECTION_FALSE,
    err,
  };
}
