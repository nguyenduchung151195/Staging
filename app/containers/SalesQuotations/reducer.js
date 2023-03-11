/*
 *
 * SalesQuotations reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_SALES_SUCCESS, SET_STATE, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  tab: 0,
  openDrawerStock: false,
  id: 'add',
  typeContract: 1,
  sales: [],
  sale: '',
  openDrawerContract: false,
  data: '',
  name: '',
  approvesId: null,
  templateId: null,
  openDrawerDelivery: false,
  dynamicForm: null,
  groupInfo: [
    {
      order: 0,
      approve: 0,
      reason: '',
    },
  ],
  templateError: false,
  itemSales: '',
  addDialog: false,
  addData: {},
  reload: 0,
  businessData: [],
  exchangingData: [],
  openDrawerPO: false,
  OriginItem: '',
  filter: { isProject: true },
});

function salesQuotationsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_SALES_SUCCESS:
      return state.set('sales', action.sales);
    case SET_STATE:
      return state.set(action.name, action.value);
    case GET_DATA_SUCCESS:
      return state.set('businessData', action.businessData).set('exchangingData', action.exchangingData);
    default:
      return state;
  }
}

export default salesQuotationsReducer;
