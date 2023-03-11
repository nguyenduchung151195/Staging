/*
 *
 * FluctuationsPage actions
 *
 */

import {
  DEFAULT_ACTION, GET_INCREASES_OR_DECREASES,
  GET_INCREASES_OR_DECREASES_SUCCESS,
  GET_INCREASES_OR_DECREASES_FAILURE
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getIncreasesOrDecreases() {
  return {
    type: GET_INCREASES_OR_DECREASES
  }
}
export function getIncreasesOrDecreasesSuccess(data) {
  return {
    type: GET_INCREASES_OR_DECREASES_SUCCESS,
    data
  }
}
export function getIncreasesOrDecreasesFailure(error) {
  return {
    type: GET_INCREASES_OR_DECREASES_FAILURE,
    error
  }
}