/*
 *
 * AddBillPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_CONTRACT,
  GET_ALL_CONTRACT_SUCCESS,
  GET_ALL_CONTRACT_FAILED,
  GET_ALL_SALE_QUO,
  GET_ALL_SALE_QUO_SUCCESS,
  GET_ALL_SALE_QUO_FAILED,
  CREATE_BILL,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAILED,
  RESET_NOTI,
  GET_BILL_BY_ID,
  GET_BILL_BY_ID_SUCCESS,
  GET_BILL_BY_ID_FAILED,
  UPDATE_BILL,
  UPDATE_BILL_SUCCESS,
  UPDATE_BILL_FAILED,
  GET_ALL_PO,
  GET_ALL_PO_SUCCESS,
  GET_ALL_PO_FAILED,
} from './constants';

export const initialState = fromJS({});

function addBillPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', false);
    case GET_ALL_CONTRACT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_CONTRACT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allContract', action.data)
        .set('error', false);
    case GET_ALL_CONTRACT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_PO:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_PO_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allPO', action.data)
        .set('error', false);
    case GET_ALL_PO_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_SALE_QUO:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_SALE_QUO_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allSaleQuo', action.data)
        .set('error', false);
    case GET_ALL_SALE_QUO_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CREATE_BILL:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_BILL_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_BILL_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_BILL_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_BILL_BY_ID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('billSelected', action.data)
        .set('error', false);
    case GET_BILL_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_BILL:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_BILL_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_BILL_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addBillPageReducer;
