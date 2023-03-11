/*
 *
 * BonusPage actions
 *
 */

import {
  CREATE_BONUS,
  CREATE_BONUS_SUCCESS,
  CREATE_BONUS_FAILURE,
  UPDATE_BONUS,
  UPDATE_BONUS_SUCCESS,
  UPDATE_BONUS_FAILURE,
  DELETE_BONUS,
  DELETE_BONUS_SUCCESS,
  DELETE_BONUS_FAILURE,
} from './constants';

export function createBonus(data) {
  return {
    type: CREATE_BONUS,
    data,
  };
}

export function createBonusSuccess(data) {
  return {
    type: CREATE_BONUS_SUCCESS,
    data,
  };
}

export function createBonusFailure(error) {
  return {
    type: CREATE_BONUS_FAILURE,
    error,
  };
}

export function updateBonus(hrmEmployeeId, data) {
  return {
    type: UPDATE_BONUS,
    hrmEmployeeId,
    data,
  };
}

export function updateBonusSuccess(data) {
  return {
    type: UPDATE_BONUS_SUCCESS,
    data,
  };
}

export function updateBonusFailure(error) {
  return {
    type: UPDATE_BONUS_FAILURE,
    error,
  };
}

export function deleteBonus(hrmEmployeeId, ids) {
  return {
    type: DELETE_BONUS,
    hrmEmployeeId,
    ids
  };
}

export function deleteBonusSuccess(data) {
  return {
    type: DELETE_BONUS_SUCCESS,
    data,
  };
}

export function deleteBonusFailure(error) {
  return {
    type: DELETE_BONUS_FAILURE,
    error,
  };
}