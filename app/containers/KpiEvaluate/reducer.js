/*
 *
 * KpiEvaluate reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_PROCESS_SUCCESS,
  GET_PROCESS_CURRENT_SUCCESS,
  GET_PROCESS_CURRENT,
  PUT_PROCESS_SUCCESS,
  GET_DEFAULT,
  POST_EVALUATE_SUCCESS,
  GET_EVALUATE_CURRENT_SUCCESS,
  GET_EVALUATE_CURRENT,
  PUT_EVALUATE_SUCCESS,
  POST_PROCESS_GROUP_SUCCESS,
  GET_PROCESS_GROUP_CURRENT_SUCCESS,
  GET_PROCESS_GROUP_CURRENT,
  PUT_PROCESS_GROUP_SUCCESS,
} from './constants';

export const initialState = fromJS({
  tab: 0,
  openDrawerGroup: false,
  code: '',
  nameTA: '',
  name: '',
  evaluate: false,
  active: false,
  target: false,
  openDrawerProcess: false,
  method: 1,
  openDrawerType: false,
  process: [{ evaluate: '' }],
  evaluateTable: '',
  reload: 0,
  id: null,
  processType: '',
  startDate: new Date().toISOString().substring(0, 10),
  endDate: '',
  startDateDetail: new Date().toISOString().substring(0, 10),
  endDateDetail: '',
});

function kpiEvaluateReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_PROCESS_SUCCESS:
      return state.set('data', action.data);
    case GET_PROCESS_CURRENT:
      return state.set('id', action.id);
    case GET_PROCESS_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_PROCESS_SUCCESS:
      return state.set('data', action.data);
    case GET_DEFAULT:
      return state
        .set('name', '')
        .set('code', '')
        .set('process', [{ evaluate: '' }])
        .set('id', null)
        .set('startDate', new Date().toISOString().substring(0, 10))
        .set('endDate', '')
        .set('startDateDetail', new Date().toISOString().substring(0, 10))
        .set('endDateDetail', '')
        .set('nameTA', '')
        .set('processType', '');
    case POST_EVALUATE_SUCCESS:
      return state.set('data', action.data);
    case GET_EVALUATE_CURRENT:
      return state.set('id', action.id);
    case GET_EVALUATE_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_EVALUATE_SUCCESS:
      return state.set('data', action.data);
    case POST_PROCESS_GROUP_SUCCESS:
      return state.set('data', action.data);
    case GET_PROCESS_GROUP_CURRENT:
      return state.set('id', action.id);
    case GET_PROCESS_GROUP_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_PROCESS_GROUP_SUCCESS:
      return state.set('data', action.data);
    default:
      return state;
  }
}

export default kpiEvaluateReducer;
