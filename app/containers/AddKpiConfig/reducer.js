/*
 *
 * AddKpiConfig reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, POST_CONFIG_SUCCESS, GET_DEFAULT, GET_CURRENT_SUCCESS, PUT_CONFIG_SUCCESS } from './constants';

export const initialState = fromJS({
  data: '',
  module: null,
  arrayDialog: false,
  listItem: [],
  codeRef: '',
  dialogRef: false,
  name: '',
  code: '',
  compares: [{ condition: '', compare: '', value: '' }],
  formula: '',
  currentCondition: '',
  range: 1,
});

function addKpiConfigReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_CONFIG_SUCCESS:
      return state.set('data', action.data);
    case GET_DEFAULT:
      return state
        .set('module', null)
        .set('name', '')
        .set('code', '')
        .set('compares', [{ condition: '', compare: '', value: '' }])
        .set('formula', '')
        .set('range', false);
    case GET_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_CONFIG_SUCCESS:
      return state.set('data', action.data);
    default:
      return state;
  }
}

export default addKpiConfigReducer;
