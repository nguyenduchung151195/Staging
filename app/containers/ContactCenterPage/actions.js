/*
 *
 * ContactCenterPage actions
 *
 */

import { DEFAULT_ACTION, GET_CONTACT_CENTER_ERROR, GET_CONTACT_CENTER_SUCCESS, GET_CONTACT_CENTER } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getContactCenterAction() {
  return {
    type: GET_CONTACT_CENTER,
  };
}
export function getContactCenterSuccessAction(data) {
  return {
    type: GET_CONTACT_CENTER_SUCCESS,
    data,
  };
}
export function getContactCenterErrorAction() {
  return {
    type: GET_CONTACT_CENTER_ERROR,
  };
}
