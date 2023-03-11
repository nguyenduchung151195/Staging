/*
 *
 * RelationPage actions
 *
 */

import {
  CREATE_RELATION,
  CREATE_RELATION_SUCCESS,
  CREATE_RELATION_FAILURE,
  UPDATE_RELATION,
  UPDATE_RELATION_SUCCESS,
  UPDATE_RELATION_FAILURE,
  DELETE_RELATION,
  DELETE_RELATION_SUCCESS,
  DELETE_RELATION_FAILURE,
} from './constants';

export function createRelation(data) {
  return {
    type: CREATE_RELATION,
    data,
  };
}

export function createRelationSuccess(data) {
  return {
    type: CREATE_RELATION_SUCCESS,
    data,
  };
}

export function createRelationFailure(error) {
  return {
    type: CREATE_RELATION_FAILURE,
    error,
  };
}

export function updateRelation(hrmEmployeeId, data) {
  return {
    type: UPDATE_RELATION,
    hrmEmployeeId,
    data,
  };
}

export function updateRelationSuccess(data) {
  return {
    type: UPDATE_RELATION_SUCCESS,
    data,
  };
}

export function updateRelationFailure(error) {
  return {
    type: UPDATE_RELATION_FAILURE,
    error,
  };
}

export function deleteRelation(hrmEmployeeId, ids) {
  return {
    type: DELETE_RELATION,
    hrmEmployeeId,
    ids,
  };
}

export function deleteRelationSuccess(data) {
  return {
    type: DELETE_RELATION_SUCCESS,
    data,
  };
}

export function deleteRelationFailure(error) {
  return {
    type: DELETE_RELATION_FAILURE,
    error,
  };
}
