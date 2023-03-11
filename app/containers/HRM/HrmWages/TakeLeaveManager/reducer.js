import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  ADD_TAKE_LEAVE_MANAGER_FAILURE,
  ADD_TAKE_LEAVE_MANAGER_SUCCESS,
  ADD_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER_SUCCESS,
  UPDATE_TAKE_LEAVE_MANAGER_FAILURE,
  DELETE_TAKE_LEAVE_MANAGER_SUCCESS,
  DELETE_TAKE_LEAVE_MANAGER_FAILURE,
  DELETE_TAKE_LEAVE_MANAGER,
  GET_ALL_VACATION_MODE_SUCCESS,
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

function takeLeaveManagementReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);

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

    case GET_ALL_VACATION_MODE_SUCCESS:
      return state.set('vacationMode', action.data);

    default:
      return state;
  }
}

export default takeLeaveManagementReducer;
