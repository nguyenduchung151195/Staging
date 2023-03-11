/*
 *
 * EducatePage actions
 *
 */

import {
  DEFAULT_ACTION,
  CREATE_EDUCATE,
  CREATE_EDUCATE_SUCCESS,
  CREATE_EDUCATE_FAILURE,
  UPDATE_EDUCATE,
  UPDATE_EDUCATE_SUCCESS,
  UPDATE_EDUCATE_FAILURE,
  DELETE_EDUCATE,
  DELETE_EDUCATE_SUCCESS,
  DELETE_EDUCATE_FAILURE,
  CREATE_EDUCATE_ROUND,
  CREATE_EDUCATE_ROUND_SUCCESS,
  CREATE_EDUCATE_ROUND_FAILURE,
  UPDATE_EDUCATE_ROUND_FAILURE,
  UPDATE_EDUCATE_ROUND_SUCCESS,
  UPDATE_EDUCATE_ROUND,
  DELETE_EDUCATE_ROUND,
  DELETE_EDUCATE_ROUND_SUCCESS,
  DELETE_EDUCATE_ROUND_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function createEducate(data) {
  return {
    type: CREATE_EDUCATE,
    data,
  };
}

export function createEducateSuccess(data) {
  return {
    type: CREATE_EDUCATE_SUCCESS,
    data,
  };
}

export function createEducateFailure(error) {
  return {
    type: CREATE_EDUCATE_FAILURE,
    error,
  };
}

export function updateEducate(id, data) {
  return {
    type: UPDATE_EDUCATE,
    id,
    data,
  };
}

export function updateEducateSuccess(data) {
  return {
    type: UPDATE_EDUCATE_SUCCESS,
    data,
  };
}

export function updateEducateFailure(error) {
  return {
    type: UPDATE_EDUCATE_FAILURE,
    error,
  };
}

export function deleteEducate(ids) {
  return {
    type: DELETE_EDUCATE,
    ids
  };
}

export function deleteEducateSuccess(data) {
  return {
    type: DELETE_EDUCATE_SUCCESS,
    data,
  };
}

export function deleteEducateFailure(error) {
  return {
    type: DELETE_EDUCATE_FAILURE,
    error,
  };
}


// khóa đào tạo
export function createEducateRound(data) {
  return {
    type: CREATE_EDUCATE_ROUND,
    data,
  };
}

export function createEducateRoundSuccess(data) {
  return {
    type: CREATE_EDUCATE_ROUND_SUCCESS,
    data,
  };
}

export function createEducateRoundFailure(error) {
  return {
    type: CREATE_EDUCATE_ROUND_FAILURE,
    error,
  };
}


export function updateEducateRound(id, data) {
  return {
    type: UPDATE_EDUCATE_ROUND,
    id,
    data,
  };
}

export function updateEducateRoundSuccess(data) {
  return {
    type: UPDATE_EDUCATE_ROUND_SUCCESS,
    data,
  };
}

export function updateEducateRoundFailure(error) {
  return {
    type: UPDATE_EDUCATE_ROUND_FAILURE,
    error,
  };
}

export function deleteEducateRound(ids) {
  return {
    type: DELETE_EDUCATE_ROUND,
    ids
  };
}

export function deleteEducateRoundSuccess(data) {
  return {
    type: DELETE_EDUCATE_ROUND_SUCCESS,
    data,
  };
}

export function deleteEducateRoundFailure(error) {
  return {
    type: DELETE_EDUCATE_ROUND_FAILURE,
    error,
  };
}