/*
 *
 * SocialInsurancePage actions
 *
 */

import {
  MERGE_DATA,
  CREATE_SOCIALINSURANCE,
  CREATE_SOCIALINSURANCE_SUCCESS,
  CREATE_SOCIALINSURANCE_FAILURE,
  DEFAULT_ACTION,
  UPDATE_SOCIALINSURANCE,
  UPDATE_SOCIALINSURANCE_SUCCESS,
  UPDATE_SOCIALINSURANCE_FAILURE,
  DELETE_SOCIALINSURANCE,
  DELETE_SOCIALINSURANCE_SUCCESS,
  DELETE_SOCIALINSURANCE_FAILURE,
  SHARE_INSURANCE_REQUEST,
  SHARE_INSURANCE_SUCCESS,
  SHARE_INSURANCE_FAILED,
  GET_INSURANCE_DATA_REQUEST,
  GET_INSURANCE_DATA_SUCCESS,
  GET_INSURANCE_DATA_FAILED
} from './constants';

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

export function createSocialInsurance(data) {
  return {
    type: CREATE_SOCIALINSURANCE,
    data,
  };
}

export function createSocialInsuranceSuccess(data) {
  return {
    type: CREATE_SOCIALINSURANCE_SUCCESS,
    data,
  };
}

export function createSocialInsuranceFailure(error) {
  return {
    type: CREATE_SOCIALINSURANCE_FAILURE,
    error,
  };
}

export function updateSocialInsurance(hrmEmployeeId, data) {
  return {
    type: UPDATE_SOCIALINSURANCE,
    hrmEmployeeId,
    data,
  };
}

export function updateSocialInsuranceSuccess(data) {
  return {
    type: UPDATE_SOCIALINSURANCE_SUCCESS,
    data,
  };
}

export function updateSocialInsuranceFailure(error) {
  return {
    type: UPDATE_SOCIALINSURANCE_FAILURE,
    error,
  };
}

export function deleteSocialInsurance(hrmEmployeeId, ids) {
  return {
    type: DELETE_SOCIALINSURANCE,
    hrmEmployeeId,
    ids,
  };
}

export function deleteSocialInsuranceSuccess(data) {
  return {
    type: DELETE_SOCIALINSURANCE_SUCCESS,
    data,
  };
}

export function deleteSocialInsuranceFailure(error) {
  return {
    type: DELETE_SOCIALINSURANCE_FAILURE,
    error,
  };
}

export function shareInsurance(data) {
  return {
    type: SHARE_INSURANCE_REQUEST,
    data,
  };
}

export function shareInsuranceSuccess(data) {
  return {
    type: SHARE_INSURANCE_SUCCESS,
    data,
  };
}

export function shareInsuranceFailed(error) {
  return {
    type: SHARE_INSURANCE_FAILED,
    error,
  };
}

export function getInsuranceData(data) {
  return {
    type: GET_INSURANCE_DATA_REQUEST,
    data,
  };
}

export function getInsuranceDataSuccess(data) {
  return {
    type: GET_INSURANCE_DATA_SUCCESS,
    data,
  };
}

export function getInsuranceDataFailed(error) {
  return {
    type: GET_INSURANCE_DATA_FAILED,
    error,
  };
}
