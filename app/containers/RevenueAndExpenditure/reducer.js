/*
 *
 * RevenueAndExpenditure reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ALL_RECORD,
  GET_ALL_RECORD_FAILED,
  GET_ALL_RECORD_SUCCESS,
  DELETE_RECORD,
  DELETE_RECORD_SUCCESS,
  DELETE_RECORD_FAILED,
  GET_ADVENCE_RECORD,
  GET_ADVENCE_RECORD_FAILED,
  GET_ADVENCE_RECORD_SUCCESS,
  RESET_LIST,
  DELETE_ADVENCE_RECORD,
  DELETE_ADVENCE_RECORD_SUCCESS,
  DELETE_ADVENCE_RECORD_FAILED,
  GET_REIBURSEMENT_RECORD,
  GET_REIBURSEMENT_RECORD_SUCCESS,
  GET_REIBURSEMENT_RECORD_FAILED,
  DELETE_REIBURSEMENT_RECORD,
  DELETE_REIBURSEMENT_RECORD_SUCCESS,
  DELETE_REIBURSEMENT_RECORD_FAILED,
  GET_PAYMENT_RECORD,
  GET_PAYMENT_RECORD_SUCCESS,
  GET_PAYMENT_RECORD_FAILED,
  DELETE_PAYMENT_RECORD,
  DELETE_PAYMENT_RECORD_SUCCESS,
  DELETE_PAYMENT_RECORD_FAILED,
  GET_COUNT_SUCCESS,
  UPDATE_RECORD_SUCCESS,
  UPDATE_RECORD_FAILURE,
  UPDATE_RECORD,
  UPDATE_RECORD_ADVANCE,
  UPDATE_RECORD_ADVANCE_SUCCESS,
  UPDATE_RECORD_ADVANCE_FAILURE,
  UPDATE_RECORD_REIBURSEMENT,
  UPDATE_RECORD_REIBURSEMENT_SUCCESS,
  UPDATE_RECORD_REIBURSEMENT_FAILURE,
  UPDATE_RECORD_PAYMENT,
  UPDATE_RECORD_PAYMENT_SUCCESS,
  UPDATE_RECORD_PAYMENT_FAILURE,
  MERGE_DATA,
  CHANGE_TAB,
} from './constants';

export const initialState = fromJS({
  advanceRequire: 0,
  exportCost: 0,
  importCost: 0,
  internalCost: 0,
  paymentRequire: 0,
  reimbursementRequire: 0,
  reload: false,
  tab: 0,
});

function revenueAndExpenditureReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_TAB:
      return state.set('tab', action.data);
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('error', false);
    case RESET_LIST:
      return state
        .set('recordList', [])
        .set('advanceRecordList', [])
        .set('reibursementRecordList', [])
        .set('paymentRecordList', []);
    case GET_ALL_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('recordList', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_ALL_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ADVENCE_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ADVENCE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('advanceRecordList', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_ADVENCE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_REIBURSEMENT_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_REIBURSEMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('reibursementRecordList', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_REIBURSEMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PAYMENT_RECORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PAYMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('paymentRecordList', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_PAYMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case DELETE_RECORD:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    case DELETE_ADVENCE_RECORD:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_ADVENCE_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_ADVENCE_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    case DELETE_REIBURSEMENT_RECORD:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_REIBURSEMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_REIBURSEMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    case DELETE_PAYMENT_RECORD:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_PAYMENT_RECORD_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_PAYMENT_RECORD_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    case GET_COUNT_SUCCESS:
      return state
        .set('advanceRequire', action.data.advanceRequire || 0)
        .set('exportCost', action.data.exportCost || 0)
        .set('importCost', action.data.importCost || 0)
        .set('internalCost', action.data.internalCost || 0)
        .set('paymentRequire', action.data.paymentRequire || 0)
        .set('reimbursementRequire', action.data.reimbursementRequire || 0);
    case UPDATE_RECORD:
      return state.set('reload', false);
    case UPDATE_RECORD_SUCCESS:
      return state.set('reload', true);
    case UPDATE_RECORD_FAILURE:
      return state.set('reload', false);
    case UPDATE_RECORD_ADVANCE:
      return state.set('reload', false);
    case UPDATE_RECORD_ADVANCE_SUCCESS:
      return state.set('reload', true);
    case UPDATE_RECORD_ADVANCE_FAILURE:
      return state.set('reload', false);
    case UPDATE_RECORD_REIBURSEMENT:
      return state.set('reload', false);
    case UPDATE_RECORD_REIBURSEMENT_SUCCESS:
      return state.set('reload', true);
    case UPDATE_RECORD_REIBURSEMENT_FAILURE:
      return state.set('reload', false);
    case UPDATE_RECORD_PAYMENT:
      return state.set('reload', false);
    case UPDATE_RECORD_PAYMENT_SUCCESS:
      return state.set('reload', true);
    case UPDATE_RECORD_PAYMENT_FAILURE:
      return state.set('reload', false);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default revenueAndExpenditureReducer;
