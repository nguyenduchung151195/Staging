/*
 *
 * AddReimbursementRequirePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ADVANCE,
  GET_ADVANCE_SUCCESS,
  GET_ADVANCE_FAILED,
  CREATE_REIMBURSEMENT_RECORD,
  CREATE_REIMBURSEMENT_RECORD_SUCCESS,
  CREATE_REIMBURSEMENT_RECORD_FAILED,
  GET_REIMBURSEMENT_RECORD_BY_ID,
  GET_REIMBURSEMENT_RECORD_BY_ID_SUCCESS,
  GET_REIMBURSEMENT_RECORD_BY_ID_FAILED,
  UPDATE_REIMBURSEMENT_RECORD,
  UPDATE_REIMBURSEMENT_RECORD_SUCCESS,
  UPDATE_REIMBURSEMENT_RECORD_FAILED,
} from './constants';

export const initialState = fromJS({});

function addReimbursementRequirePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false);
    case GET_ADVANCE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ADVANCE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allAdvance', action.data)
        .set('error', false);
    case GET_ADVANCE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CREATE_REIMBURSEMENT_RECORD:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_REIMBURSEMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_REIMBURSEMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_REIMBURSEMENT_RECORD_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_REIMBURSEMENT_RECORD_BY_ID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('reibursementSelected', action.data)
        .set('error', false);
    case GET_REIMBURSEMENT_RECORD_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_REIMBURSEMENT_RECORD:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_REIMBURSEMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_REIMBURSEMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addReimbursementRequirePageReducer;
