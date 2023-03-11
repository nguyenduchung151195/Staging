/*
 *
 * KpiExchange reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, PUT_EXCHANGE_SUCCESS, GET_CURRENT_EXCHANGE_SUCCESS } from './constants';

export const initialState = fromJS({
  data: '',
  frequency: 1,
  unit: 1,
  coefficient: 1,
  tendency: [{ name: '', direction: '', priority: '' }],
  points: [{ to: '', point: '', trend: '' }],
  _id: null,
});

function kpiExchangeReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case PUT_EXCHANGE_SUCCESS:
      return state.set('data', action.data);
    case GET_CURRENT_EXCHANGE_SUCCESS:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default kpiExchangeReducer;
