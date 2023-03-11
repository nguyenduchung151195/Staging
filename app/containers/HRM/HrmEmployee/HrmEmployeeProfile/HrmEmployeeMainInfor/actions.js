import {
  GET_ROLE_GROUP,
  GET_ROLE_GROUP_SUCCESS,
  GET_ROLE_GROUP_FAILURE
} from './constants';

export function getRoleGroup() {
  return {
    type: GET_ROLE_GROUP
  }
}
export function getRoleGroupSuccess(data) {
  return {
    type: GET_ROLE_GROUP_SUCCESS,
    data
  }
}
export function getRoleGroupFailure(error) {
  return {
    type: GET_ROLE_GROUP_FAILURE,
    error
  }
}