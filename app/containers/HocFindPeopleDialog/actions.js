/*
 *
 * HocFindPeopleDialog actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_PEOPLE,
  GET_ALL_PEOPLE_SUCCESS,
  GET_ALL_PEOPLE_FAIL,
  // ADD_PEOPLE,
  // ADD_PEOPLE_FAIL,
  // ADD_PEOPLE_SUCCESS,
  // DELETE_PEOPLE,
  // DELETE_PEOPLE_FAIL,
  // DELETE_PEOPLE_SUCCESS,
  // UPDATE_PEOPLE,
  // UPDATE_PEOPLE_FAIL,
  // UPDATE_PEOPLE_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getAllPeopleAction(query) {
  return {
    type: GET_ALL_PEOPLE,
    query,
  };
}
export function getAllPeopleSuccessAction(data, message) {
  return {
    type: GET_ALL_PEOPLE_SUCCESS,
    data,
    message,
  };
}
export function getAllPeopleFailAction(err, message) {
  return {
    type: GET_ALL_PEOPLE_FAIL,
    err,
    message,
  };
}
// export function addUnitAction(body) {
//   return {
//     type: ADD_PEOPLE,
//     body,
//   };
// }
// export function addUnitSuccessAction(data, message) {
//   return {
//     type: ADD_PEOPLE_SUCCESS,
//     data,
//     message,
//   };
// }
// export function addUnitFailAction(err, message) {
//   return {
//     type: ADD_PEOPLE_FAIL,
//     err,
//     message,
//   };
// }
// export function deleteUnitsAction(body) {
//   return {
//     type: DELETE_PEOPLE,
//     body,
//   };
// }
// export function deleteUnitsSuccessAction(data, message) {
//   return {
//     type: DELETE_PEOPLE_SUCCESS,
//     data,
//     message,
//   };
// }
// export function deleteUnitsFailAction(err, message) {
//   return {
//     type: DELETE_PEOPLE_FAIL,
//     err,
//     message,
//   };
// }
// export function updateUnitsAction(body) {
//   return {
//     type: UPDATE_PEOPLE,
//     body,
//   };
// }
// export function updateUnitsSuccessAction(data, message) {
//   return {
//     type: UPDATE_PEOPLE_SUCCESS,
//     data,
//     message,
//   };
// }
// export function updateUnitsFailAction(err, message) {
//   return {
//     type: UPDATE_PEOPLE_FAIL,
//     err,
//     message,
//   };
// }
