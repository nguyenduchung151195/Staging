/*
 *
 * AddAdvancePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_COMMAND,
  GET_COMMAND_SUCCESS,
  GET_COMMAND_FAILED,
  CREATE_ADVANCE_RECORD,
  CREATE_ADVANCE_RECORD_SUCCESS,
  CREATE_ADVANCE_RECORD_FAILED,
  GET_ADVANCE_RECORD_BY_ID,
  GET_ADVANCE_RECORD_BY_ID_SUCCESS,
  GET_ADVANCE_RECORD_BY_ID_FAILED,
  UPDATE_ADVANCE_RECORD,
  UPDATE_ADVANCE_RECORD_SUCCESS,
  UPDATE_ADVANCE_RECORD_FAILED,
  GET_ADVANCE_RECORD,
  GET_ADVANCE_RECORD_SUCCESS,
  GET_ADVANCE_RECORD_FAILED,
} from './constants';

export const initialState = fromJS({});

function addAdvancePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', false);
    case GET_COMMAND:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_COMMAND_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allCommand', action.data)
        .set('error', false);
    case GET_COMMAND_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ADVANCE_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ADVANCE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('advanceList', action.data)
        .set('error', false);
    case GET_ADVANCE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CREATE_ADVANCE_RECORD:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_ADVANCE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_ADVANCE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_ADVANCE_RECORD_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ADVANCE_RECORD_BY_ID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('recordSelected', action.data)
        .set('error', false);
    case GET_ADVANCE_RECORD_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_ADVANCE_RECORD:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_ADVANCE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_ADVANCE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addAdvancePageReducer;
