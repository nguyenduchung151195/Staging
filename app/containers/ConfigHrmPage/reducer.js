/*
 *
 * ConfigHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_CATEGORY_SUCCESS,
  UPDATE_STATUS_SUCCESS,
  GET_DEFAULT,
  ADD_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  GET_ALL_STATUS_SUCCESS,
  ADD_STATUS_SUCCESS,
  UPDATE_STATUS_INDEX_SUCCESS,
  DELETE_STATUS_SUCCESS,
  MERGE_DATA,
  ADD_HRM_STATUS_SUCCESS,
  EDIT_HRM_STATUS_SUCCESS,
  DELETE_HRM_STATUS_SUCCESS,
  ADD_HRM_CATEGORY_SUCCESS,
  EDIT_HRM_CATEGORY_SUCCESS,
  DELETE_HRM_CATEGORY_SUCCESS,
  RESET_ALL_STATUS_SUCCESS,
} from './constants';

export const initialState = fromJS({ data: '', sources: [], listSt: [], tab: 0 });

function configHrmPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_ALL_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case ADD_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case UPDATE_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case UPDATE_STATUS_INDEX_SUCCESS:
      return state.set('listSt', action.data);
    case DELETE_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case ADD_HRM_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case EDIT_HRM_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case DELETE_HRM_STATUS_SUCCESS:
      return state.set('listSt', action.data);
    case RESET_ALL_STATUS_SUCCESS:
      return state.set('listSt', action.data);

    case GET_ALL_CATEGORY_SUCCESS:
      // console.log('act', action);
      return state.set('sources', action.data);
    case GET_DEFAULT:
      return state.merge(initialState);
    case ADD_CATEGORY_SUCCESS:
      return state.set('sources', action.data);
    case UPDATE_CATEGORY_SUCCESS:
      return state.set('sources', action.data);
    case DELETE_CATEGORY_SUCCESS:
      return state.set('sources', action.data);
    case EDIT_HRM_CATEGORY_SUCCESS:
      return state.set('sources', action.data);

    default:
      return state;
  }
}

export default configHrmPageReducer;
