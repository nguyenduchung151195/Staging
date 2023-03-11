/*
 *
 * StockImportPage actions
 *
 */

import { DEFAULT_ACTION, RESET_NOTI, GET_ALL_ITEMS, GET_ALL_ITEMS_SUCCESS, GET_ALL_ITEMS_FAILED ,CHANGE_TAB} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function resetNotiAct() {
  return {
    type: RESET_NOTI,
  };
}



export function getAllItemsAct(body) {
  return {
    type: GET_ALL_ITEMS,
    body,
  };
}
export function getAllItemsSuccess(data) {
  return {
    type: GET_ALL_ITEMS_SUCCESS,
    data,
  };
}
export function getAllItemsFailed(err) {
  return {
    type: GET_ALL_ITEMS_FAILED,
    err,
  };
}

export function changeTabAct(data) {
  return {
    type: CHANGE_TAB,
    data,
  };
}
