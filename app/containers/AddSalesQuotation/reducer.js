/*
 *
 * AddSalesQuotation reducer
 *
 */

import { fromJS } from 'immutable';

import { DEFAULT_ACTION, SET_STATE, MERGE_DATA } from './constants';

export const initialState = fromJS({
  businessOpportunities: null,
  openDrawer: false,
  listProduct: [],
  customers: [],
  employees: [],
  crmSource: [],
  paymentAmount: [],
  currentPayment: 0,
  expiredDate: null,
  // name: '',
  code: '',
  currentCrmStatus: 1,
  percentageDiscount: 0,
  unit: 0,
  priceDiscount: 0,
  typeOfSalesQuotation: 1,
  paymentType: 1,
  deliveryDate: null,
  billDate: null,
  totalPrice: 12,
  salesDate: null,
  isChangeSalesDate: false,
  note: '',
  commissionGroup: [],
  customer: null,
  service: '',
  services: [],
  salesman: {
    _id: null,
    name: '',
    code: '',
  },
  countProduct: 12,
  totalProduct: 1,
  products: [],
  labors: [],
  transports: [],
  commissions: [],
  snackbar: {
    message: '',
    variant: 'warning',
    status: false,
  },
  templates: [],
  template: '',
  complete: false,
  templateError: false,
  salePoint: null,
  errorCode: true,
  description: '',
  openDrawerCustomer: false,
  order: 1,
  expensess: [],
  expenses: '',
  listMerge: [],
  others: {},
  dialogMerge: false,
  groupName: '',
  rate: 1,
  typeOfTask: 0
});

function addSalesQuotationReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_STATE:
      return state.set(action.name, action.value);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default addSalesQuotationReducer;
