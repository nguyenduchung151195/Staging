/*
 *
 * AddExpensesPage actions
 *
 */

import {
  DEFAULT_ACTION,
  HANDLE_CHANGE,
  GET_SUCCESS,
  GET_DEFAULT_SUCCESS,
  ADD_PRODUCT,
  TOOGLE_DRAWER,
  HANDLE_DISCOUNT,
  MERGE_DATA,
  GET_EXPENSE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const handleChangeIndex = index => ({
  type: 'CHANGE_TAB',
  tab: index,
});

export const getExpense = (id, customerBoDialog, addCustomer, customerItem, data) => ({
  type: GET_EXPENSE,
  id,
  customerBoDialog,
  addCustomer,
  customerItem,
  data,
});
export function getExpenseSuccess(data, products, businessOpportunities, inventory) {
  return {
    type: GET_SUCCESS,
    data,
    products,
    businessOpportunities,
    inventory,
  };
}

export const getExpenseDefaultSuccess = (profile, businessOpportunities, inventory) => ({
  type: GET_DEFAULT_SUCCESS,
  profile,
  businessOpportunities,
  inventory,
});

export const putExpense = (id, data) => ({
  type: 'PUT_EXPENSE',
  id,
  data,
});

export const postExpense = data => ({
  type: 'POST_EXPENSE',
  data,
});

export const putExpenseSuccess = (data, products) => ({
  type: 'PUT_EXPENSE_SUCCESS',
  data,
  products,
});

export const getDefault = () => ({
  type: 'GET_EXPENSE_DEFAULT',
});

export const changeExpense = value => ({
  type: 'CHANGE_EXPENSE',
  value,
});

export const handleChangeNameExpense = (a, b) => ({
  type: 'CHANGE_EXPENSE_VALUE',
  data: { name: a, value: b },
});

export const saveRow = (a, b) => ({
  type: 'SAVE_EXPENSE_ROW',
  a,
  b,
});

export const handleChange = (name, data) => ({
  type: HANDLE_CHANGE,
  name,
  data,
});

export const addProduct = data => ({
  type: ADD_PRODUCT,
  data: {
    productId: data._id,
    name: data.name,
    code: data.code,
    amount: 1,
    unit: data.unit.name,
    sourcePrice: data.pricePolicy.sourcePrice,
    costPrice: data.pricePolicy.costPrice,
  },
});

export const toggleDrawer = data => ({
  type: TOOGLE_DRAWER,
  data,
});

export const handleDiscount = (checked, data) => ({
  type: HANDLE_DISCOUNT,
  checked,
  data,
});

export const mergeData = data => ({
  type: MERGE_DATA,
  data,
});
