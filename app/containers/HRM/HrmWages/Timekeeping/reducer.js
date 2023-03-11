/*
 *
 * WagesManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  GET_TIMEKEEPINGS,
  GET_TIMEKEEPINGS_SUCCESS,
  GET_TIMEKEEPINGS_FAILURE,
  UPDATE_WAGES,
  UPDATE_WAGES_SUCCESS,
  UPDATE_WAGES_FAILURE,
  DELETE_WAGES,
  DELETE_WAGES_SUCCESS,
  DELETE_WAGES_FAILURE,
  UPDATE_TIMEKEEPING_CELL,
  UPDATE_TIMEKEEPING_CELL_SUCCESS,
  UPDATE_TIMEKEEPING_CELL_FAILURE,
  GET_ALL_TIMEKEEP_TYPE_SUCCESS,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createWagesSuccess: null,
  updateWagesSuccess: null,
  deleteWagesSuccess: null,
  tab: 0,
  reload: false,
  timekeepingData: null,
  updateCellDataSuccess: null,
  timekeepTypes: [],
});

function timekeepingPageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_TIMEKEEPINGS:
      return state.set('isLoading', true);
    case GET_TIMEKEEPINGS_SUCCESS:
      return state.set('isLoading', false).set('timekeepingData', action.data);
    case GET_TIMEKEEPINGS_FAILURE:
      return state.set('isLoading', false).set('timekeepingData', null);
    case UPDATE_WAGES:
      return state.set('isLoading', true).set('updateWagesSuccess', null).set('reload', false);
    case UPDATE_WAGES_SUCCESS:
      return state.set('isLoading', false).set('updateWagesSuccess', true).set('reload', true);
    case UPDATE_WAGES_FAILURE:
      return state.set('isLoading', false).set('updateWagesSuccess', false).set('reload', false);
    case DELETE_WAGES:
      return state.set('isLoading', true).set('deleteWagesSuccess', null).set('reload', false);
    case DELETE_WAGES_SUCCESS:
      return state.set('isLoading', false).set('deleteWagesSuccess', true).set('reload', true);
    case DELETE_WAGES_FAILURE:
      return state.set('isLoading', false).set('deleteWagesSuccess', false).set('reload', false);
    case UPDATE_TIMEKEEPING_CELL:
      return state.set('updateCellDataSuccess', null);
    case UPDATE_TIMEKEEPING_CELL_SUCCESS:
      return state.set('updateCellDataSuccess', true);
    case UPDATE_TIMEKEEPING_CELL_FAILURE:
      return state.set('updateCellDataSuccess', false);
    case GET_ALL_TIMEKEEP_TYPE_SUCCESS:
      return state.set('timekeepTypes', action.data);
    default:
      return state;
  }
}

export default timekeepingPageReducer;
