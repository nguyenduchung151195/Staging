/*
 *
 * EmailSms actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_TEMPLATE } from './constants';

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
export function getTemplate() {
  return {
    type: GET_TEMPLATE,
  };
}
