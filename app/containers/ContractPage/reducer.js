/*
 *
 * Contract reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_CONTRACT_ACT,
  GET_CONTRACT_SUCCESS,
  GET_CONTRACT_FALSE,
  DELETE_CONTRACT_SUCCESS,
  DELETE_CONTRACT_FAILED,
  DELETE_CONTRACT,
  UPDATE_STATUS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAILED,
  CHANGE_TAB,
  MERGE_DATA,
} from './constants';

export const initialState = fromJS({
  reload: false,
  success: false,
  error: false,
  loading: false,
  contracts: [],
  tab: 0,
  contractCount: 0,
  cycleCount: 0,
  contractExpireCount: 0,
  dashboard: 0,
  contractDashboard: [],
});

function contractReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_TAB:
      return state.set('tab', action.data);
    case GET_CONTRACT_ACT:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_CONTRACT_SUCCESS:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('count', action.data.contracts.count)
        .set('skip', action.data.contracts.skip)
        .set('limit', action.data.contracts.limit)
        .set('contractCount', action.data.contractCount)
        .set('contractExpireCount', action.data.contractExpireCount)
        .set('cycleCount', action.data.cycleCount)
        .set('contracts', action.data.contracts.data);
    case GET_CONTRACT_FALSE:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case DELETE_CONTRACT:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case DELETE_CONTRACT_SUCCESS:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case DELETE_CONTRACT_FAILED:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true);
    case UPDATE_STATUS:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false)
        .set('reload', false);
    case UPDATE_STATUS_SUCCESS:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case UPDATE_STATUS_FAILED:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true)
        .set('reload', true);

    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default contractReducer;
