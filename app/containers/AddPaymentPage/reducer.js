/*
 *
 * AddPaymentPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_COMMAND,
  GET_COMMAND_SUCCESS,
  GET_COMMAND_FAILED,
  CREATE_PAYMENT_RECORD,
  CREATE_PAYMENT_RECORD_SUCCESS,
  CREATE_PAYMENT_RECORD_FAILED,
  GET_PAYMENT_RECORD_BY_ID,
  GET_PAYMENT_RECORD_BY_ID_SUCCESS,
  GET_PAYMENT_RECORD_BY_ID_FAILED,
  UPDATE_PAYMENT_RECORD,
  UPDATE_PAYMENT_RECORD_SUCCESS,
  UPDATE_PAYMENT_RECORD_FAILED,
  GET_ADVANCE_RECORD,
  GET_ADVANCE_RECORD_SUCCESS,
  GET_ADVANCE_RECORD_FAILED,
} from './constants';

export const initialState = fromJS({});

function addPaymentPageReducer(state = initialState, action) {
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
    case CREATE_PAYMENT_RECORD:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_PAYMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_PAYMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_PAYMENT_RECORD_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PAYMENT_RECORD_BY_ID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('recordSelected', action.data)
        .set('error', false);
    case GET_PAYMENT_RECORD_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_PAYMENT_RECORD:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_PAYMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_PAYMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addPaymentPageReducer;
