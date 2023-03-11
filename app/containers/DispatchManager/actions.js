/*
 *
 * DispatchManager actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ALL_DISPATCH,
  GET_ALL_DISPATCH_SUCCESS,
  GET_ALL_DISPATCH_FAILED,
  CHANGE_TAB,
  DELETE_DISPATCHS,
  DELETE_DISPATCHS_FAIL,
  DELETE_DISPATCHS_SUCCESS,
  UPDATE_DISPATCH,
  UPDATE_DISPATCH_FAIL,
  UPDATE_DISPATCH_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function resetNoti() {
  return {
    type: RESET_NOTI,
  };
}
export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}

export function getAllDispatchAct(query) {
  return {
    type: GET_ALL_DISPATCH,
    query,
  };
}
export function getAllDispatchSuccess(data) {
  return {
    type: GET_ALL_DISPATCH_SUCCESS,
    data,
  };
}
export function getAllDispatchFailed(err) {
  return {
    type: GET_ALL_DISPATCH_FAILED,
    err,
  };
}

export function deleteDispatchAct(data) {
  return {
    type: DELETE_DISPATCHS,
    data,
  };
}
export function deleteDispatchSuccessAct() {
  return {
    type: DELETE_DISPATCHS_SUCCESS,
  };
}
export function deleteDispatchFailedAct() {
  return {
    type: DELETE_DISPATCHS_FAIL,
  };
}
export function updateDispatchAction(dispatch) {
  return {
    type: UPDATE_DISPATCH,

    dispatch,
  };
}
export function updateDispatchSuccessAction() {
  return {
    type: UPDATE_DISPATCH_SUCCESS,
  };
}
export function updateDispatchFailAction() {
  return {
    type: UPDATE_DISPATCH_FAIL,
  };
}
