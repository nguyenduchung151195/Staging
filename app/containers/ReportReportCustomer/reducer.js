/*
 *
 * ReportReportCustomer reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_REPORT_CUSTOMER_SUCCESS, GET_ALL_BOS, GET_ALL_BOS_SUCCESS, GET_ALL_BOS_FAIL } from './constants';

export const initialState = fromJS({
  customers: [],
  tasks: [],
  task: '',
  customer: '',
  openAddTask: false,
  id: 'add',
  isDisPlay: '',
  progress: '',
  taskStatus: '',
  openDialog: false,
  openSale: false,
  isEditting: false,
  openSalesEmployee: false,
  employee: '',
  filter: {},
  startDate: new Date(`${new Date().getFullYear()}-01-01`),
  endDate: new Date(),
  reload: 0,
});

function reportReportCustomerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_REPORT_CUSTOMER_SUCCESS:
      return state.set('customers', action.customers);
    case GET_ALL_BOS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_BOS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('bos', action.data.data)
        .set('pageDetail', action.data);
    case GET_ALL_BOS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default reportReportCustomerReducer;
