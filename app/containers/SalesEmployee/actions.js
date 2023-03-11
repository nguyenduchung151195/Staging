/*
 *
 * SalesEmployee actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_DATA } from './constants';

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
