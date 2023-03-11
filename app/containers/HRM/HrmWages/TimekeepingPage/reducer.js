/*
 *
 * WagesManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  CREATE_WAGES,
  CREATE_WAGES_SUCCESS,
  CREATE_WAGES_FAILURE,
  UPDATE_WAGES,
  UPDATE_WAGES_SUCCESS,
  UPDATE_WAGES_FAILURE,
  DELETE_WAGES,
  DELETE_WAGES_SUCCESS,
  DELETE_WAGES_FAILURE,
  GET_ALL_TIMEKEEPING_EQUIPMENT_SUCCESS,
  GET_TIMEKEEPING_TO_EQUIPMENT_SUCCESS,
  IMPORT_TIMEKEEPING_SUCCESS,
  ADD_TAKE_LEAVE_MANAGER_FAILURE,
  ADD_TAKE_LEAVE_MANAGER_SUCCESS,
  ADD_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER_SUCCESS,
  UPDATE_TAKE_LEAVE_MANAGER_FAILURE,
  DELETE_TAKE_LEAVE_MANAGER_SUCCESS,
  DELETE_TAKE_LEAVE_MANAGER_FAILURE,
  DELETE_TAKE_LEAVE_MANAGER
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createWagesSuccess: null,
  updateWagesSuccess: null,
  deleteWagesSuccess: null,
  tab: 0,
  reload: false,
  timekeepingEquipment: [],
  hrm2equipment: [],
  addTakeleaveManagerSuccess: false,
  deleteTakeleaveManagerSuccess: false,
});

function wagesPageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case CREATE_WAGES:
      return state.set('isLoading', true).set('createWagesSuccess', null).set('reload', false);
    case CREATE_WAGES_SUCCESS:
      return state.set('isLoading', false).set('createWagesSuccess', true).set('reload', true);
    case CREATE_WAGES_FAILURE:
      return state.set('isLoading', false).set('createWagesSuccess', false).set('reload', false);
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
    case GET_ALL_TIMEKEEPING_EQUIPMENT_SUCCESS:
      return state.set('timekeepingEquipment', action.data);
    case GET_TIMEKEEPING_TO_EQUIPMENT_SUCCESS:
      return state.set('hrm2equipment', action.data);
    case IMPORT_TIMEKEEPING_SUCCESS:
      return state.set('importTimekeeping', action.data);

    // 
    case ADD_TAKE_LEAVE_MANAGER:
      return state.set('addUpdateTakeleaveManagerSuccess', false).set('reload', false);
    case ADD_TAKE_LEAVE_MANAGER_SUCCESS:
      return state.set('addUpdateTakeleaveManagerSuccess', true).set('reload', true);
    case ADD_TAKE_LEAVE_MANAGER_FAILURE:
      return state.set('addUpdateTakeleaveManagerSuccess', false).set('reload', false);

    case UPDATE_TAKE_LEAVE_MANAGER:
      return state.set('addUpdateTakeleaveManagerSuccess', false).set('reload', false);
    case UPDATE_TAKE_LEAVE_MANAGER_SUCCESS:
      return state.set('addUpdateTakeleaveManagerSuccess', true).set('reload', true);
    case UPDATE_TAKE_LEAVE_MANAGER_FAILURE:
      return state.set('addUpdateTakeleaveManagerSuccess', false).set('reload', false);

    case DELETE_TAKE_LEAVE_MANAGER:
      return state.set('reload', false);
    case DELETE_TAKE_LEAVE_MANAGER_SUCCESS:
      return state.set('reload', true);
    case DELETE_TAKE_LEAVE_MANAGER_FAILURE:
      return state.set('reload', false);
    default:
      return state;
  }
}

export default wagesPageReducer;
