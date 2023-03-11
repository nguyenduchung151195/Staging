/*
 *
 * TakeLeaveManagePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  CREATE_TAKE_LEAVE,
  CREATE_TAKE_LEAVE_SUCCESS,
  CREATE_TAKE_LEAVE_FAILURE,
  UPDATE_TAKE_LEAVE,
  UPDATE_TAKE_LEAVE_SUCCESS,
  UPDATE_TAKE_LEAVE_FAILURE,
  DELETE_TAKE_LEAVE,
  DELETE_TAKE_LEAVE_SUCCESS,
  DELETE_TAKE_LEAVE_FAILURE,
} from './constants';

export const initialState = fromJS({
  createTakeLeaveSuccess: null,
  updateTakeLeaveSuccess: null,
  deleteTakeLeaveSuccess: null,
  reload: false,
  isLoading: false,
});

function takeLeaveManagePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CREATE_TAKE_LEAVE:
      return state.set('createWagesSuccess', null).set('reload', false);
    case CREATE_TAKE_LEAVE_SUCCESS:
      return state.set('isLoading', false).set('createTakeLeaveSuccess', true).set('reload', true);
    case CREATE_TAKE_LEAVE_FAILURE:
      return state.set('isLoading', false).set('createTakeLeaveSuccess', false).set('reload', false);
    case UPDATE_TAKE_LEAVE:
      return state.set('isLoading', true).set('updateTakeLeaveSuccess', null).set('reload', false);
    case UPDATE_TAKE_LEAVE_SUCCESS:
      return state.set('isLoading', false).set('updateTakeLeaveSuccess', true).set('reload', true);
    case UPDATE_TAKE_LEAVE_FAILURE:
      return state.set('isLoading', false).set('updateTakeLeaveSuccess', false).set('reload', false);
    case DELETE_TAKE_LEAVE:
      return state.set('isLoading', true).set('deleteTakeLeaveSuccess', null).set('reload', false);
    case DELETE_TAKE_LEAVE_SUCCESS:
      return state.set('isLoading', false).set('deleteTakeLeaveSuccess', true).set('reload', true);
    case DELETE_TAKE_LEAVE_FAILURE:
      return state.set('isLoading', false).set('deleteTakeLeaveSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default takeLeaveManagePageReducer;
