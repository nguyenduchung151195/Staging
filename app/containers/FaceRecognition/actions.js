import {
  GET_INFO,
  GET_INFO_SUCCESS,
  GET_INFO_FAILURE,
  GET_FACE_INFO,
  GET_FACE_INFO_SUCCESS,
  GET_FACE_INFO_FAILURE,
  TIMEKEENGPING,
  TIMEKEENGPING_SUCCESS,
  TIMEKEENGPING_FAILURE,
} from './constant';

// req : [], {} , '' , number, bool
export function getInfo() {
  return {
    type: GET_INFO,
  };
}

export function getInfoSuccess(data) {
  return {
    type: GET_INFO_SUCCESS,
    data,
  };
}

export function getInfoFailure() {
  return {
    type: GET_INFO_FAILURE,
  };
}

export function getFaceInfo() {
  return {
    type: GET_FACE_INFO,
  };
}

export function getFaceInfoSuccess(data) {
  return {
    type: GET_FACE_INFO_SUCCESS,
    data,
  };
}

export function getFaceInfoFailure() {
  return {
    type: GET_FACE_INFO_FAILURE,
  };
}

export function timeKeeping(data) {
  return {
    type: TIMEKEENGPING,
    data,
  };
}

export function timeKeepingSuccess(data) {
  return {
    type: TIMEKEENGPING_SUCCESS,
    data,
  };
}

export function timeKeepingFailure() {
  return {
    type: TIMEKEENGPING_FAILURE,
  };
}
