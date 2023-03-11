/*
 *
 * SocialPage actions
 *
 */

import {
  CREATE_SOCIAL,
  CREATE_SOCIAL_SUCCESS,
  CREATE_SOCIAL_FAILURE,
  UPDATE_SOCIAL,
  UPDATE_SOCIAL_SUCCESS,
  UPDATE_SOCIAL_FAILURE,
  DELETE_SOCIAL,
  DELETE_SOCIAL_SUCCESS,
  DELETE_SOCIAL_FAILURE,
} from './constants';

export function createSocial(data) {
  return {
    type: CREATE_SOCIAL,
    data,
  };
}

export function createSocialSuccess(data) {
  return {
    type: CREATE_SOCIAL_SUCCESS,
    data,
  };
}

export function createSocialFailure(error) {
  return {
    type: CREATE_SOCIAL_FAILURE,
    error,
  };
}

export function updateSocial(hrmEmployeeId, data) {
  return {
    type: UPDATE_SOCIAL,
    hrmEmployeeId,
    data,
  };
}

export function updateSocialSuccess(data) {
  return {
    type: UPDATE_SOCIAL_SUCCESS,
    data,
  };
}

export function updateSocialFailure(error) {
  return {
    type: UPDATE_SOCIAL_FAILURE,
    error,
  };
}

export function deleteSocial(hrmEmployeeId, ids) {
  return {
    type: DELETE_SOCIAL,
    hrmEmployeeId,
    ids,
  };
}

export function deleteSocialSuccess(data) {
  return {
    type: DELETE_SOCIAL_SUCCESS,
    data,
  };
}

export function deleteSocialFailure(error) {
  return {
    type: DELETE_SOCIAL_FAILURE,
    error,
  };
}
