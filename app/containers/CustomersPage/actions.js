/*
 *
 * CustomersPage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, UPDATE_MULTILE_CUSTOMERS, UPDATE_MULTILE_CUSTOMERS_FAILURE, UPDATE_MULTILE_CUSTOMERS_SUCCESS,CHANGE_TAB } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const fetchAction = () => ({ type: 'FETCH_CUSTOMER' });

export const deleteCustomers = list => ({ type: 'DELETE_CUSTOMERS', list });

export const fetchSuccessAction = (data, typeCustomer, introducedWay, contractOfCustomer, bestRevenueCustomer) => ({
  type: 'FETCH_CUSTOMER_SUCCESS',
  data,
  typeCustomer,
  introducedWay,
  contractOfCustomer,
  bestRevenueCustomer,
});

export const deleteCustomersFailed = () => ({ type: 'DELETE_CUSTOMERS_FAILED' });

export const fetchFailedAction = () => ({
  type: 'FETCH_FAILED',
});

export const putConfig = columns => {
  const data = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === '002');
  data.editDisplay.type.fields.type.columns = columns.filter(item => item.name !== 'edit');
  return { type: 'PUT_CONFIG', data };
};

export const putConfigSuccess = data => {
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  data._id = data.id;
  const newData = data.editDisplay.type.fields.type.columns.filter(column => column.name !== 'edit');
  data.editDisplay.type.fields.type.columns = newData;
  const newView = viewConfig.map(item => {
    if (item._id === data._id) return { ...item, editDisplay: data.editDisplay };
    return item;
  });
  localStorage.setItem('viewConfig', JSON.stringify(newView));
  // eslint-disable-next-line no-console
  console.log('checkView>>>>');
  return { type: 'PUT_CONFIG_SUCCESS' };
};

export const putConfigFailed = () => ({ type: 'PUT_CONFIG_FAILED' });
export const changeIndex = index => ({ type: 'CHANGE_INDEX', index });
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function updateMultipleCustomers(data){
  return {
    type: UPDATE_MULTILE_CUSTOMERS,
    data,
  };
}

export function updateMultipleCustomersSuccess(data){
  return {
    type: UPDATE_MULTILE_CUSTOMERS_SUCCESS,
    data,
  };
}

export function updateMultipleCustomersFailure(err){
  return {
    type: UPDATE_MULTILE_CUSTOMERS_FAILURE,
    err,
  };
}

export function createCampaign(data) {
  return {
    type: 'CREATE_CAMPAIGN',
    data,
  }
}
export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}