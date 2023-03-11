/*
 *
 * ReportTask reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_DATA_SUCCESS, MERGE_DATA } from './constants';

export const initialState = fromJS({ data: [], taskData: [] });

function reportTaskReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_DATA_SUCCESS:
      return state.set('data', action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default reportTaskReducer;
