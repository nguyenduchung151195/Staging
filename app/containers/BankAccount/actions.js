import {
    CREATE_ACCOUNT_REQUESTED,
    CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
    CREATE_ACCOUNT_REQUESTED_FAILED,
    MERGE_DATA,
  } from './constants';
  
  export function createAccountRequest(data) {
    return {
      type: CREATE_ACCOUNT_REQUESTED,
      data,
    };
  }
  
  export function createAccountRequestSuccess(data) {
    return {
      type: CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
      data,
    };
  }
  
  export function createAccountRequestFailed(error) {
    return {
      type: CREATE_ACCOUNT_REQUESTED_FAILED,
      error,
    };
  }
  
  export function mergeAccountRequest(data) {
    return {
      type: MERGE_DATA,
      data,
    };
  }