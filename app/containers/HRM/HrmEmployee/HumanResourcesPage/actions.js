import {
  GET_HUMAN_RESOURCE,
  GET_HUMAN_RESOURCE_FAILURE, GET_HUMAN_RESOURCE_SUCCESS,
  UPDATE_HUMAN_RESOURCE,
  UPDATE_HUMAN_RESOURCE_FAILURE, UPDATE_HUMAN_RESOURCE_SUCCESS,
  ADD_HUMAN_RESOURCE,
  ADD_HUMAN_RESOURCE_FAILURE, ADD_HUMAN_RESOURCE_SUCCESS
} from './constants';


export function getHumanResource(body) {
  return {
    type: GET_HUMAN_RESOURCE,
    body

  }
}
export function getHumanResourceSuccess(fields, data) {
  return {
    type: GET_HUMAN_RESOURCE_SUCCESS,
    fields,
    data
  }
}
export function getHumanResourceFailure(error) {
  return {
    type: GET_HUMAN_RESOURCE_FAILURE,
    error
  }
}

export function updateHumanResource(data) {
  return {
    type: UPDATE_HUMAN_RESOURCE,
    data
  }
}
export function updateHumanResourceSuccess(data) {
  return {
    type: UPDATE_HUMAN_RESOURCE_SUCCESS,
    data
  }
}
export function updateHumanResourceFailure(error) {
  return {
    type: UPDATE_HUMAN_RESOURCE_FAILURE,
    error
  }
}

export function addHumanResource(data) {
  return {
    type: ADD_HUMAN_RESOURCE,
    data
  }
}
export function addHumanResourceSuccess(data) {
  return {
    type: ADD_HUMAN_RESOURCE_SUCCESS,
    data
  }
}
export function addHumanResourceFailure(error) {
  return {
    type: ADD_HUMAN_RESOURCE_FAILURE,
    error
  }
}
