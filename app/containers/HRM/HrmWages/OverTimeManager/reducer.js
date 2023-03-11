/*
 *
 * WagesManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  ADD_OVER_TIME_MANAGER,
  ADD_OVER_TIME_MANAGER_SUCCESS,
  ADD_OVER_TIME_MANAGER_FAILURE,
  UPDATE_OVER_TIME_MANAGER,
  UPDATE_OVER_TIME_MANAGER_SUCCESS,
  UPDATE_OVER_TIME_MANAGER_FAILURE,
  DELETE_OVER_TIME_MANAGER,
  DELETE_OVER_TIME_MANAGER_SUCCESS,
  DELETE_OVER_TIME_MANAGER_FAILURE,
  ADD_PLAN_OT,
  ADD_PLAN_OT_SUCCESS,
  ADD_PLAN_OT_FAILURE,
  UPDATE_PLAN_OT,
  UPDATE_PLAN_OT_SUCCESS,
  UPDATE_PLAN_OT_FAILURE,
  DELETE_PLAN_OT,
  DELETE_PLAN_OT_SUCCESS,
  DELETE_PLAN_OT_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  tab: 0,
  reload: false,
  addUpdateOverTimeManagerSuccess: false,
  addUpdatePlantOverTimeSuccess: false
});

function overTimeManagerReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);

    case ADD_OVER_TIME_MANAGER:
      return state.set('addUpdateOverTimeManagerSuccess', false).set('reload', false);
    case ADD_OVER_TIME_MANAGER_SUCCESS:
      return state.set('addUpdateOverTimeManagerSuccess', true).set('reload', true);
    case ADD_OVER_TIME_MANAGER_FAILURE:
      return state.set('addUpdateOverTimeManagerSuccess', false).set('reload', false);

    case UPDATE_OVER_TIME_MANAGER:
      return state.set('addUpdateOverTimeManagerSuccess', false).set('reload', false);
    case UPDATE_OVER_TIME_MANAGER_SUCCESS:
      return state.set('addUpdateOverTimeManagerSuccess', true).set('reload', true);
    case UPDATE_OVER_TIME_MANAGER_FAILURE:
      return state.set('addUpdateOverTimeManagerSuccess', false).set('reload', false);

    case DELETE_OVER_TIME_MANAGER:
      return state.set('reload', false);
    case DELETE_OVER_TIME_MANAGER_SUCCESS:
      return state.set('reload', true);
    case DELETE_OVER_TIME_MANAGER_FAILURE:
      return state.set('reload', false);

    // plan ot
    case ADD_PLAN_OT:
      return state.set('addUpdatePlantOverTimeSuccess', false).set('reload', false);
    case ADD_PLAN_OT_SUCCESS:
      return state.set('addUpdatePlantOverTimeSuccess', true).set('reload', true);
    case ADD_PLAN_OT_FAILURE:
      return state.set('addUpdatePlantOverTimeSuccess', false).set('reload', false);

    case UPDATE_PLAN_OT:
      return state.set('addUpdatePlantOverTimeSuccess', false).set('reload', false);
    case UPDATE_PLAN_OT_SUCCESS:
      return state.set('addUpdatePlantOverTimeSuccess', true).set('reload', true);
    case UPDATE_PLAN_OT_FAILURE:
      return state.set('addUpdatePlantOverTimeSuccess', false).set('reload', false);

      case DELETE_PLAN_OT:
      return state.set('reload', false);
    case DELETE_PLAN_OT_SUCCESS:
      return state.set('reload', true);
    case DELETE_PLAN_OT_FAILURE:
      return state.set('reload', false);

    default:
      return state;
  }
}

export default overTimeManagerReducer;
