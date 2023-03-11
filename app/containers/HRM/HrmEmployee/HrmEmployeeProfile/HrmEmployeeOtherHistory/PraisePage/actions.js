/*
 *
 * PraisePage actions
 *
 */

import {
  CREATE_PRAISE,
  CREATE_PRAISE_SUCCESS,
  CREATE_PRAISE_FAILURE,
  DEFAULT_ACTION,
  UPDATE_PRAISE,
  UPDATE_PRAISE_SUCCESS,
  UPDATE_PRAISE_FAILURE,
  DELETE_PRAISE,
  DELETE_PRAISE_SUCCESS,
  DELETE_PRAISE_FAILURE,
} from './constants';

// export function defaultAction() {
//   return {
//     type: DEFAULT_ACTION,
//   };
// }

export function createPraise(data) {
  return {
    type: CREATE_PRAISE,
    data,
  };
}

export function createPraiseSuccess(data) {
  return {
    type: CREATE_PRAISE_SUCCESS,
    data,
  };
}

export function createPraiseFailure(error) {
  return {
    type: CREATE_PRAISE_FAILURE,
    error,
  };
}

export function updatePraise(hrmEmployeeId, data) {
  return {
    type: UPDATE_PRAISE,
    hrmEmployeeId,
    data,
  };
}

export function updatePraiseSuccess(data) {
  return {
    type: UPDATE_PRAISE_SUCCESS,
    data,
  };
}

export function updatePraiseFailure(error) {
  return {
    type: UPDATE_PRAISE_FAILURE,
    error,
  };
}

export function deletePraise(hrmEmployeeId, ids) {
  return {
    type: DELETE_PRAISE,
    hrmEmployeeId,
    ids
  };
}

export function deletePraiseSuccess(data) {
  return {
    type: DELETE_PRAISE_SUCCESS,
    data,
  };
}

export function deletePraiseFailure(error) {
  return {
    type: DELETE_PRAISE_FAILURE,
    error,
  };
}