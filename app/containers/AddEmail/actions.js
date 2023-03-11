/*
 *
 * AddEmail actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA } from './constants';

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
export const getTemplate = (id, getTem) => ({
  type: 'GET_TEMPLATE',
  id,
  getTem,
});
export const getTemplateSuccess = (data, id) => ({
  type: 'GET_TEMPLATE_SUCCESS',
  data,
  id,
});
export const postTemplate = data => ({
  type: 'POST_TEMPLATE',
  data,
});
export const postTemplateSuccess = data => ({
  type: 'POST_TEMPLATE_SUCCESS',
  data,
});
export const putTemplate = (data, id) => ({
  type: 'PUT_TEMPLATE',
  data,
  id,
});
export const putTemplateSuccess = data => ({
  type: 'PUT_TEMPLATE_SUCCESS',
  data,
});
