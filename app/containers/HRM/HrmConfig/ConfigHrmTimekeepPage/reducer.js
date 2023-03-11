/*
 *
 * ConfigHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  ADD_CONFIG_TIMEKEEPING_SUCCESS,
  ADD_EDIT_EMPLOYEES_SUCCESS,
  ADD_HOLIDAY_SUCCESS,
  ADD_SHIFT,
  ADD_SHIFT_FAILURE,
  ADD_SHIFT_SUCCESS,
  ADD_SYMBOL_SUCCESS,
  ADD_CONFIG_TIMEKEEPING,
  ADD_CONFIG_TIMEKEEPING_FAILER,
  ADD_TIMEKEEP_TYPE_SUCCESS,
  ADD_TIMEKEEP_TYPE_FAILER,
  DELETE_CONFIG_TIMEKEEPING,
  DELETE_CONFIG_TIMEKEEPING_SUCCESS,
  DELETE_CONFIG_TIMEKEEPING_FAILER,
  DELETE_EDIT_EMPLOYEES_SUCCESS,
  DELETE_SHIFT,
  DELETE_SHIFT_FAILURE,
  DELETE_SHIFT_SUCCESS,
  GET_ALL_CONFIG_TIMEKEEPING_SUCCESS,
  GET_ALL_HOLIDAY_SUCCESS,
  GET_ALL_SHIFT_SUCCESS,
  GET_ALL_SYMBOL_SUCCESS,
  GET_ALL_TIMEKEEP_TYPE_SUCCESS,
  GET_EDIT_EMPLOYEES_SUCCESS,
  MERGE_DATA,
  UPDATE_CONFIG_TIMEKEEPING,
  UPDATE_CONFIG_TIMEKEEPING_SUCCESS,
  UPDATE_CONFIG_TIMEKEEPING_FAILER,
  UPDATE_EDIT_EMPLOYEES_SUCCESS,
  UPDATE_SHIFT,
  UPDATE_SHIFT_FAILURE,
  UPDATE_SHIFT_SUCCESS,
} from './constants';

export const initialState = fromJS({
  tab: 0,
  holidays: [],
  timekeepTypes: [],
  configTimekeeping: [],
  symbols: [],
  editEmployees: [],
  shifts: [],
  addShiftSuccess: false,
  updateShiftSuccess: false,
  deleteShiftSuccess: false,
  updateConfigTimekeeping: false,
  addConfigTimekeeping: false,
  reload: false,
});

function configHrmTimekeepPageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_ALL_HOLIDAY_SUCCESS:
      return state.set('holidays', action.data);
    case GET_ALL_TIMEKEEP_TYPE_SUCCESS:
      return state.set('timekeepTypes', action.data);
    case GET_ALL_CONFIG_TIMEKEEPING_SUCCESS:
      return state.set('configTimekeeping', action.data);
    case GET_ALL_SYMBOL_SUCCESS:
      return state.set('symbols', action.data);
    case GET_EDIT_EMPLOYEES_SUCCESS:
      return state.set('editEmployees', action.data);

    // add
    case ADD_HOLIDAY_SUCCESS:

    case ADD_TIMEKEEP_TYPE_SUCCESS:
      return state.set('timekeepTypes', action.data);

    case ADD_CONFIG_TIMEKEEPING:
      return state.set('reload', false);
    case ADD_CONFIG_TIMEKEEPING_SUCCESS:
      return state.set('configTimekeeping', action.data).set('reload', true);
    case ADD_CONFIG_TIMEKEEPING_FAILER:
      return state.set('reload', false);

    case ADD_SYMBOL_SUCCESS:
      return state.set('symbols', action.data);
    case ADD_EDIT_EMPLOYEES_SUCCESS:
      return state.set('editEmployees', action.data);

    // update
    case UPDATE_CONFIG_TIMEKEEPING:
      return state.set('reload', false);
    case UPDATE_CONFIG_TIMEKEEPING_SUCCESS:
      return state.set('configTimekeeping', action.data).set('reload', true);
      case UPDATE_CONFIG_TIMEKEEPING_FAILER:
      return state.set('reload', false);
    case UPDATE_EDIT_EMPLOYEES_SUCCESS:
      return state.set('editEmployees', action.data);

    //delete
    case DELETE_CONFIG_TIMEKEEPING:
      return state.set('reload', false);
      case DELETE_CONFIG_TIMEKEEPING_SUCCESS:
      return state.set('configTimekeeping', action.data).set('reload', true);
      case DELETE_CONFIG_TIMEKEEPING_FAILER:
      return state.set('reload', false);
    case DELETE_EDIT_EMPLOYEES_SUCCESS:
      return state.set('editEmployees', action.data);

    case GET_ALL_SHIFT_SUCCESS:
      return state.set('shifts', action.data);

    case ADD_SHIFT:
      return state.set('addShiftSuccess', false)
    case ADD_SHIFT_SUCCESS:
      return state.set('addShiftSuccess', true);
    case ADD_SHIFT_FAILURE:
      return state.set('addShiftSuccess', false)

    case UPDATE_SHIFT:
      return state.set('updateShiftSuccess', false)
    case UPDATE_SHIFT_SUCCESS:
      return state.set('updateShiftSuccess', true)
    case UPDATE_SHIFT_FAILURE:
      return state.set('updateShiftSuccess', false);

    case DELETE_SHIFT:
      return state.set('deleteShiftSuccess', false);
    case DELETE_SHIFT_SUCCESS:
      return state.set('deleteShiftSuccess', true);
    case DELETE_SHIFT_FAILURE:
      return state.set('deleteShiftSuccess', false);
    default:
      return state;
  }
}

export default configHrmTimekeepPageReducer;
