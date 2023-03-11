/*
 *
 * WorkingSchedule reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({ reload: 1, mettings: [] });

function workingScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_DATA_SUCCESS:
      return state.set('mettings', action.mettings);
    default:
      return state;
  }
}

export default workingScheduleReducer;
