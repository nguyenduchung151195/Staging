/*
 *
 * RecruitmentManagementPage actions
 *
 */

import {
  MERGE_DATA,
  CREATE_RECRUITMENTMANAGEMENT,
  CREATE_RECRUITMENTMANAGEMENT_SUCCESS,
  CREATE_RECRUITMENTMANAGEMENT_FAILURE,
  DEFAULT_ACTION,
  UPDATE_RECRUITMENTMANAGEMENT,
  UPDATE_RECRUITMENTMANAGEMENT_SUCCESS,
  UPDATE_RECRUITMENTMANAGEMENT_FAILURE,
  DELETE_RECRUITMENTMANAGEMENT,
  DELETE_RECRUITMENTMANAGEMENT_SUCCESS,
  DELETE_RECRUITMENTMANAGEMENT_FAILURE,
  GET_HUMAN_RESOURCE,
  GET_HUMAN_RESOURCE_SUCCESS,
  GET_HUMAN_RESOURCE_FAILURE,
  GET_COUNT_HRM_BY_ROLE,
  GET_COUNT_HRM_BY_ROLE_SUCCESS,
  GET_COUNT_HRM_BY_ROLE_FAILURE,
  GET_POSITION_VACATION,
  GET_POSITION_VACATION_SUCCESS,
  GET_POSITION_VACATION_FAILURE,
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

export function createRecruitmentManagement(data) {
  return {
    type: CREATE_RECRUITMENTMANAGEMENT,
    data,
  };
}

export function createRecruitmentManagementSuccess(data) {
  return {
    type: CREATE_RECRUITMENTMANAGEMENT_SUCCESS,
    data,
  };
}

export function createRecruitmentManagementFailure(error) {
  return {
    type: CREATE_RECRUITMENTMANAGEMENT_FAILURE,
    error,
  };
}

export function updateRecruitmentManagement(hrmEmployeeId, data) {
  return {
    type: UPDATE_RECRUITMENTMANAGEMENT,
    hrmEmployeeId,
    data,
  };
}

export function updateRecruitmentManagementSuccess(data) {
  return {
    type: UPDATE_RECRUITMENTMANAGEMENT_SUCCESS,
    data,
  };
}

export function updateRecruitmentManagementFailure(error) {
  return {
    type: UPDATE_RECRUITMENTMANAGEMENT_FAILURE,
    error,
  };
}

export function deleteRecruitmentManagement(hrmEmployeeId, ids) {
  return {
    type: DELETE_RECRUITMENTMANAGEMENT,
    hrmEmployeeId,
    ids,
  };
}

export function deleteRecruitmentManagementSuccess(data) {
  return {
    type: DELETE_RECRUITMENTMANAGEMENT_SUCCESS,
    data,
  };
}

export function deleteRecruitmentManagementFailure(error) {
  return {
    type: DELETE_RECRUITMENTMANAGEMENT_FAILURE,
    error,
  };
}

// lay don vi phon ban tuy dung
export function getHumanResource() {
  return {
    type: GET_HUMAN_RESOURCE
  }
}

export function getHumanResourceSuccess(fields, data) {
  return {
    type: GET_HUMAN_RESOURCE_SUCCESS,
    data,
    fields,
  }
}

export function getHumanResourceFailure(error) {
  return {
    type: GET_HUMAN_RESOURCE_FAILURE,
    error
  }
}

export function getCountHrmByRole(roleCode, organizationUnit) {
  return {
    type: GET_COUNT_HRM_BY_ROLE,
    roleCode,
    organizationUnit
  }
}
export function getCountHrmByRoleSuccess(data) {
  return {
    type: GET_COUNT_HRM_BY_ROLE_SUCCESS,
    data
  }
}
export function getCountHrmByRoleFailure(error) {
  return {
    type: GET_COUNT_HRM_BY_ROLE_FAILURE,
    error
  }
}

export function getPositionVacation(roleCode) {
  return {
    type: GET_POSITION_VACATION,
    roleCode,
  }
}
export function getPositionVacationSuccess(data) {
  return {
    type: GET_POSITION_VACATION_SUCCESS,
    data
  }
}
export function getPositionVacationFailure(error) {
  return {
    type: GET_POSITION_VACATION_FAILURE,
    error
  }
}