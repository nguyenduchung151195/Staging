/*
 *
 * AddCustomerPage actions
 *
 */

import { DEFAULT_ACTION } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getInfo(id) {
  return {
    type: 'GET_INFO',
    id,
  };
}

export function getInfoSuccess(data, attributes, listAtt, users, resource) {
  return {
    type: 'GET_INFO_SUCCESS',
    data,
    attributes,
    listAtt,
    users,
    resource,
  };
}

export function getInfoFailed() {
  return {
    type: 'GET_INFO_FAILED',
  };
}

export function postCustomer(data) {
  return {
    type: 'POST_CUSTOMER',
    data,
  };
}

export function postCustomerSuccess() {
  return {
    type: 'POST_CUSTOMER_SUCCESS',
  };
}

export function postCustomerFailed() {
  return { type: 'POST_CUSTOMER_FAILED' };
}

export const putCustomer = (id, data) => ({
  type: 'PUT_CUSTOMER',
  id,
  data,
});

export const handleChangeName = data => ({
  type: 'CHANGE_NAME',
  data,
});

export const handleChangeLastName = data => ({
  type: 'CHANGE_NAME',
  data,
});

export const handleChangeNickName = data => ({
  type: 'CHANGE_NAME',
  data,
});

export const snackbar = data => ({ type: 'SNACKBAR', data });
export const putCustomerSuccess = data => ({ type: 'PUT_CUSTOMER_SUCCESS', data });
export const putCustomerFailed = () => ({ type: 'PUT_CUSTOMER_FAILED' });
export const uploadFailed = () => ({ type: 'UPLOAD_FAILED' });
export const changeSelect = value => ({ type: 'CHANGE_SELECT', value });
export const getAttribute = () => ({ type: 'GET_ATTRIBUTE' });
export const changeExpanded = id => ({ type: 'CHANGE_EXPANDED', id });
export const getAttributeSuccess = (attributes, listAtt, users, resource) => ({
  type: 'GET_ATTRIBUTE_SUCCESS',
  attributes,
  listAtt,
  users,
  resource,
});
export const handleChangeAtt = data => ({ type: 'CHANGE_ATT', data });
