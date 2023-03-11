/*
 *
 * AddContractPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_CONTRACT_BY_TYPE,
  GET_ALL_CONTRACT_BY_TYPE_SUCCESS,
  GET_ALL_CONTRACT_BY_TYPE_FAILED,
  RESET_NOTI,
  GET_CRM_STATUS,
  GET_CRM_STATUS_SUCCESS,
  GET_CRM_STATUS_FAILED,
  GET_ORDER,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILED,
  SET_EMPTY,
  GET_PRODUCT,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILED,
  CREATE_CONTRACT,
  CREATE_CONTRACT_SUCCESS,
  CREATE_CONTRACT_FAILED,
  GET_CONTRACT_BY_ID,
  GET_CONTRACT_BY_ID_FAILED,
  GET_CONTRACT_BY_ID_SUCCESS,
  UPDATE_CONTRACT,
  UPDATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT_FAILED,
  GET_SALE_QUO_BYID,
  GET_SALE_QUO_BYID_SUCCESS,
  GET_SALE_QUO_BYID_FAILED,
  GET_CUSTOMER,
  GET_CUSTOMER_SUCCESS,
  GET_CUSTOMER_FAILED,
} from './constants';

export const initialState = fromJS({
  listProduct: [],
  allContract: [],
  contract: {},
  saleQuo: {},
});

function addSupplierContractReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return initialState;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('customer', {})
        .set('listProduct', [])
        .set('saleQuo', {})
        .set('error', false);
    case GET_ALL_CONTRACT_BY_TYPE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_CONTRACT_BY_TYPE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allContract', action.data)
        .set('error', false);
    case GET_ALL_CONTRACT_BY_TYPE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CRM_STATUS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CRM_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('status', action.data)
        .set('error', false);
    case GET_CRM_STATUS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ORDER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ORDER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allOrder', action.data)
        .set('error', false);
    case GET_ORDER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case SET_EMPTY:
      return state.set('listProduct', []);
    case GET_PRODUCT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PRODUCT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('listProduct', action.data)
        .set('error', false);
    case GET_PRODUCT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CUSTOMER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CUSTOMER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('customer', action.data)
        .set('error', false);
    case GET_CUSTOMER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CREATE_CONTRACT:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_CONTRACT_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_CONTRACT_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_CONTRACT_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CONTRACT_BY_ID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('contract', action.data);
    case GET_CONTRACT_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_SALE_QUO_BYID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_SALE_QUO_BYID_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('saleQuo', action.data);
    case GET_SALE_QUO_BYID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_CONTRACT:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_CONTRACT_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false)
        .set('contract', action.data);
    case UPDATE_CONTRACT_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addSupplierContractReducer;
