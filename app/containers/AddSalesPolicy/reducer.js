/*
 *
 * AddSalesPolicy reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_SALES_POLICY_SUCCESS,
  GET_DEFAULT,
  GET_SALES_POLICY_CURRENT_SUCCESS,
  GET_SALES_POLICY_CURRENT,
} from './constants';

export const initialState = fromJS({
  _id: '',
  data: '',
  products: '',
  product: [],
  categorys: [],
  category: '',
  labels: [],
  label: '',
  rule: 1,
  name: '',
  description: '',
  startDate: new Date().toISOString().substring(0, 10),
  endDate: '',
  discount: false,
  codeSale: '',
  percentageDiscount: 0,
  priceDiscount: 0,
  maxSale: 0,
  unlimited: true,
  active: false,
  buyAmount: 0,
  receivedAmount: 0,
  expense: 0,
  splitPrice: [{ quantity: '', discountItem: '', discountRatioItem: '' }],
  errorName: true,
  errorEndDate: true,
  errorStartDate: true,
  errorbuyAmount: true,
  errorreceivedAmount: true,
  errorExpense: true,
  errorProduct: true,
  condition: 1,
  sale: 1,
  sources: [
    { name: 'Khách hàng', type: 1, conditionType: 1, value: 'customers', data: [], condition: 1 },
    { name: 'Số tiền bán hàng', type: 3, conditionType: 3, value: 'amount', data: [], condition: 1 },
  ],
  source: '',
  compare: 1,
  conditions: [{ type: 1, value: 'customers', conditionType: 0, data: null }],
  customers: [],
  isEdit: false,
});

function addSalesPolicyReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_SALES_POLICY_SUCCESS:
      return state
        .set('products', action.products)
        .set('categorys', action.categorys)
        .set('labels', action.labels)
        .set('sources', action.sources.concat(initialState.toJS().sources));
    case GET_DEFAULT:
      return state.merge(initialState);
    case GET_SALES_POLICY_CURRENT:
      return state.set('_id', action.id);
    case GET_SALES_POLICY_CURRENT_SUCCESS:
      return state.merge({
        ...action.data,
        errorName: false,
        errorEndDate: false,
        errorStartDate: false,
        errorbuyAmount: false,
        errorreceiveAmount: false,
        errorExpense: false,
        errorProduct: false,
      });
    default:
      return state;
  }
}

export default addSalesPolicyReducer;
