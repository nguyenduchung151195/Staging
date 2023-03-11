/*
 *
 * BoDialog reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_CONTRACT_ACTION,
  GET_CONTRACT_SUCCESS_ACTION,
  GET_CONTRACT_FALSE_ACTION,
  DELETE_CONTRACT_SUCCESS_ACTION,
  DELETE_CONTRACT_ACTION,
  DELETE_CONTRACT_FAILED_ACTION,
  UPDATE_STATUS_ACTION,
  UPDATE_STATUS_SUCCESS_ACTION,
  UPDATE_STATUS_FAILED_ACTION,
  GET_BILL_ACTION,
  GET_BILL_FALSE_ACTION,
  GET_BILL_SUCCESS_ACTION,
  GET_DATA_SUCCSESS,
  GET_DATA,
  MERGE_DATA,
  GET_LOG_ACTION,
  GET_LOG_FAILED_ACTION,
  GET_LOG_SUCCESS_ACTION,
  POST_LOG_ACTION,
  POST_LOG_FAILED_ACTION,
  POST_LOG_SUCCESS_ACTION,
  GET_CURENCY,
  GET_CURENCY_SUCCESS,
  GET_CURENCY_FAILED,
} from './constants';

export const initialState = fromJS({
  data: '',
  _id: null,
  expenses: [],
  sales: [],
  openDrawerExpenses: false,
  openDialogExpenses: false,
  openDrawerCost: false,
  anchorEl: null,
  id: 'add',
  openDrawerExpensesTable: false,
  services: [],
  service: '',
  percentageDiscount: 0,
  priceDiscount: 0,
  profile: '',
  typeCost: 1, // 1: kiểu báo giá chi tiếp, 2:tổng hợp
  customers: [],
  name: '',
  expensesId: null,
  reload: 0,
  products: [],
  stocks: [],
  code: '',
  errorCode: true,
  addCustomer: true,
});

function boDialogReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_CONTRACT_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_CONTRACT_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('contracts', action.data);
    case GET_CONTRACT_FALSE_ACTION:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case DELETE_CONTRACT_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case DELETE_CONTRACT_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case DELETE_CONTRACT_FAILED_ACTION:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case UPDATE_STATUS_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case UPDATE_STATUS_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case UPDATE_STATUS_FAILED_ACTION:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case GET_BILL_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_BILL_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('bills', action.data);
    case GET_BILL_FALSE_ACTION:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    // lay du liệu báo giá, chi phi , kho
    case GET_DATA:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_LOG_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_DATA_SUCCSESS:
      return state
        .set('expenses', action.expenses)
        .set('sales', action.sales)
        .set('services', action.services)
        .set('stocks', action.stocks)
        .set('profile', action.profile)
        .set('customers', action.customers);
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_LOG_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('logs', action.data.logs);
    case GET_LOG_FAILED_ACTION:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case POST_LOG_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case POST_LOG_FAILED_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case POST_LOG_SUCCESS_ACTION:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case GET_CURENCY:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_CURENCY_SUCCESS:
      return state
        .set('success', true)
        .set('currency', action.data)
        .set('loading', false)
        .set('error', false);
    case GET_CURENCY_FAILED:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);

    default:
      return state;
  }
}

export default boDialogReducer;
