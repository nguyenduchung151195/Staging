/*
 *
 * LoginPage actions
 *
 */

import { DEFAULT_ACTION, LOGIN, LOGIN_SUCCESS, RESET_NOTI, LOGIN_FALSE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetNoti(body) {
  return {
    type: RESET_NOTI,
    body,
  };
}

export function loginAction(body) {
  return {
    type: LOGIN,
    body,
  };
}
export function loginSuccessAction(data) {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
}
export function loginFalseAction() {
  return {
    type: LOGIN_FALSE,
  };
}
