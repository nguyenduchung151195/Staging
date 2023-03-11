/*
 *
 * DeliveryPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_TASK,
  GET_TASK_SUCCESS,
  GET_TASK_FAILED,
  GET_CONTRACT_AC,
  GET_CONTRACT_SUCCESS,
  GET_CONTRACT_FAILED,
  CHANGE_TAB,
  GET_ITEM_DELIVERY,
  GET_ITEM_DELIVERY_SUCCESS,
  GET_ITEM_DELIVERY_FAILED,
  UPDATE_DELIVERY,
  UPDATE_DELIVERY_SUCCESS,
  UPDATE_DELIVERY_FAILED,
  RESET,
} from './constants';

export const initialState = fromJS({
  taskList: [],
  tab: 0,
  successUpdate: false,
  reload: false,
});

function deliveryPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_TAB:
      return state.set('tab', action.val);
    case RESET:
      return state.set('successUpdate', false);
    case GET_TASK:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_TASK_SUCCESS:
      return state
        .set('taskList', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_TASK_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CONTRACT_AC:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CONTRACT_SUCCESS:
      return state
        .set('contractList', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_CONTRACT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ITEM_DELIVERY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ITEM_DELIVERY_SUCCESS:
      return state
        .set('deliveryItems', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_ITEM_DELIVERY_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_DELIVERY:
      return state
        .set('loading', true)
        .set('successUpdate', false)
        .set('error', false)
        .set('reload', false);
    case UPDATE_DELIVERY_SUCCESS:
      return state
        .set('loading', false)
        .set('successUpdate', true)
        .set('error', false);
    case UPDATE_DELIVERY_FAILED:
      return state
        .set('loading', false)
        .set('successUpdate', false)
        .set('error', true)
        .set('reload', true);
    default:
      return state;
  }
}

export default deliveryPageReducer;
