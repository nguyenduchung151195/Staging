/*
 *
 * DispatchManagerGo actions
 *
 */

import { DEFAULT_ACTION, MEGER_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData(data) {
  return {
    type: MEGER_DATA,
    data,
  };
}
