/*
 *
 * AddPersonnelPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_ALL_USER_SUCCESS,
  GET_CONFIG_SUCCESS,
  UPDATE_BILL_STATUS,
  UPDATE_BILL_STATUS_SUCCESS,
  UPDATE_BILL_STATUS_FAILED,
  UPDATE_GET_CONFIG_SUCCESS,
  GET_LIST_DEPARTMENT_SUCCESS,
  RESET_NOTI,
} from './constants';

export const initialState = fromJS({ openDrawer: false, id: 'add' });

function addPersonnelPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case RESET_NOTI:
      return state;
    case GET_ALL_USER_SUCCESS:
      return state
        .set('arrUser', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit);
    case GET_CONFIG_SUCCESS:
      return state.set('config', action.config);
    case UPDATE_BILL_STATUS:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false)
        .set('reload', false);
    case UPDATE_BILL_STATUS_SUCCESS:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case UPDATE_BILL_STATUS_FAILED:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true)
        .set('reload', true);
    case UPDATE_GET_CONFIG_SUCCESS:
      return state.set('config', action.data);

    case GET_LIST_DEPARTMENT_SUCCESS:
      return state.set('arrDepartment', action.data);
    default:
      return state;
  }
}
export default addPersonnelPageReducer;
