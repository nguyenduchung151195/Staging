/*
 *
 * AddKpiEvaluate reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DEFAULT, GET_CURRENT_SUCCESS, POST_DATA_SUCCESS, PUT_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  tab: 1,
  employee: [],
  processType: '',
  process: '',
  time: 2,
  startDate: new Date().toISOString().substring(0, 10),
  endDate: '',
  finishDate: '',
  data: '',
});

function addKpiEvaluateReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data);
    case GET_DEFAULT:
      return state.merge(initialState);
    case GET_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_DATA_SUCCESS:
      return state.set('data', action.data);
    default:
      return state;
  }
}

export default addKpiEvaluateReducer;
