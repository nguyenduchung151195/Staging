/*
 *
 * BoDialog actions
 *
 */

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
  GET_DATA,
  GET_DATA_SUCCSESS,
  MERGE_DATA,
  GET_LOG_ACTION,
  GET_LOG_SUCCESS_ACTION,
  GET_LOG_FAILED_ACTION,
  POST_LOG_ACTION,
  POST_LOG_SUCCESS_ACTION,
  POST_LOG_FAILED_ACTION,
  POST_SALE,
  CREATE_TRADING,
  CREATE_TRADING_FAIL_ACTION,
  CREATE_TRADING_SUCCESS_ACTION,
  CREATE_REMINDER,
  CREATE_MEETING,
  CREATE_VISIT,
  GET_CURENCY,
  GET_CURENCY_SUCCESS,
  GET_CURENCY_FAILED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getBill(query) {
  return {
    type: GET_BILL_ACTION,
    query,
  };
}
export function getBillSuccess(data) {
  return {
    type: GET_BILL_SUCCESS_ACTION,
    data,
  };
}

export function getBillFalse(err) {
  return {
    type: GET_BILL_FALSE_ACTION,
    err,
  };
}
export function getContract(query) {
  return {
    type: GET_CONTRACT_ACTION,
    query,
  };
}

export function getContractSuccess(data) {
  return {
    type: GET_CONTRACT_SUCCESS_ACTION,
    data,
  };
}

export function getContractFalse(err) {
  return {
    type: GET_CONTRACT_FALSE_ACTION,
    err,
  };
}
export function deleteContract(body) {
  return {
    type: DELETE_CONTRACT_ACTION,
    body,
  };
}

export function deleteContractSuccess(data) {
  return {
    type: DELETE_CONTRACT_SUCCESS_ACTION,
    data,
  };
}

export function deleteContractFailed(err) {
  return {
    type: DELETE_CONTRACT_FAILED_ACTION,
    err,
  };
}

export function UpdateStatusAct(body) {
  return {
    type: UPDATE_STATUS_ACTION,
    body,
  };
}

export function UpdateStatusSuccess(data) {
  return {
    type: UPDATE_STATUS_SUCCESS_ACTION,
    data,
  };
}

export function UpdateStatusFailed(err) {
  return {
    type: UPDATE_STATUS_FAILED_ACTION,
    err,
  };
}
export function getData(id, isTrading, isEditting) {
  return {
    type: GET_DATA,
    id,
    isTrading,
    isEditting,
  };
}
export function getTaskSuccess(expenses, sales, services, stocks, profile, customers) {
  return {
    type: GET_DATA_SUCCSESS,
    expenses,
    sales,
    services,
    stocks,
    profile,
    customers,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function postSales(data) {
  return {
    type: POST_SALE,
    data,
  };
}

export function postLogAct(body) {
  return {
    type: POST_LOG_ACTION,
    body,
  };
}

export function postLogSuccessAct(data) {
  return {
    type: POST_LOG_SUCCESS_ACTION,
    data,
  };
}

export function postLogFailedAct(err) {
  return {
    type: POST_LOG_FAILED_ACTION,
    err,
  };
}
export function getLogAct(query) {
  return {
    type: GET_LOG_ACTION,
    query,
  };
}

export function getLogSuccessAct(data) {
  return {
    type: GET_LOG_SUCCESS_ACTION,
    data,
  };
}

export function getLogFailedAct(err) {
  return {
    type: GET_LOG_FAILED_ACTION,
    err,
  };
}
export function createTrading(data) {
  // console.log(data);
  return {
    type: CREATE_TRADING,
    data,
  };
}
export function createTradingSuccess() {
  // console.log(data);
  return {
    type: CREATE_TRADING_SUCCESS_ACTION,
    // data,
  };
}

export function createTradingFail() {
  return {
    type: CREATE_TRADING_FAIL_ACTION,
  };
}
export function createReminderAction(reminder, id) {
  return {
    type: CREATE_REMINDER,
    reminder,
    id,
  };
}
export function createMeetingAction(meeting, id, clearInput) {
  return {
    type: CREATE_MEETING,
    meeting,
    id,
    clearInput
  };
}
export function createVisitAction(visit, id) {
  return {
    type: CREATE_VISIT,
    visit,
    id,
  };
}
export function getCurencyAct(query) {
  return {
    type: GET_CURENCY,
    query,
  };
}

export function getCurencySuccess(data) {
  return {
    type: GET_CURENCY_SUCCESS,
    data,
  };
}

export function getCurencyFailed(err) {
  return {
    type: GET_CURENCY_FAILED,
    err,
  };
}
