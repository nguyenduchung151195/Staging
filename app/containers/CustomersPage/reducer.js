/*
 *
 * CustomersPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  UPDATE_MULTILE_CUSTOMERS,
  UPDATE_MULTILE_CUSTOMERS_FAILURE,
  UPDATE_MULTILE_CUSTOMERS_SUCCESS,
  CHANGE_TAB,
} from './constants';

export const initialState = fromJS({ 
  valueForTabs: 0,
  list: [],
  filter: {},
  typeCustomer: [],
  introducedWay: [],
  contractOfCustomer: [],
  reload: false,
  tab: 0,
});

function customersPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_TAB:
      return state.set('tab', action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    case 'FETCH_CUSTOMER':
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case 'FETCH_CUSTOMER_SUCCESS':
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('list', action.data)
        .set('typeCustomer', action.typeCustomer)
        .set('introducedWay', action.introducedWay)
        .set('contractOfCustomer', action.contractOfCustomer)
        .set('bestRevenueCustomer', action.bestRevenueCustomer);
    case 'FETCH_FAILED':
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case 'DELETE_CUSTOMERS_FAILED':
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case 'PUT_CONFIG':
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case 'PUT_CONFIG_SUCCESS':
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case 'PUT_CONFIG_FAILED':
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case 'CHANGE_INDEX':
      return state.set('valueForTabs', action.index);
    case UPDATE_MULTILE_CUSTOMERS:
      return state
        .set('updateMultipleSuccess', false)
    case UPDATE_MULTILE_CUSTOMERS_SUCCESS:
      return state
        .set('updateMultipleSuccess', true)
    case UPDATE_MULTILE_CUSTOMERS_FAILURE:
      return state
        .set('updateMultipleSuccess', false)
    default:
      return state;
  }
}

export default customersPageReducer;
