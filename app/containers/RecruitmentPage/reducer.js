/*
 *
 * RecruitmentPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA_SUCCESS,
  GET_DATA_SUCCESS,
  GET_DEFAULT,
  GET_CUREENT_SUCCESS,
  GET_CUREENT,
  PUT_DATA_SUCCESS,
} from './constants';

export const initialState = fromJS({
  id: 'add',
  branch: '',
  pending: '',
  part: '',
  amount: '',
  needDate: '',
  location: '',
  startDate: '',
  organizatsionUnit: '',
  position: '',
  note: '',
  file: '',
  url: '',
  data: '',
  departments: [],
  openDrawer: false,
});

function recruitmentPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data);

    case GET_DATA_SUCCESS:
      return state.set('departments', action.data);
    case GET_DEFAULT:
      return state
        .set('branch', '')
        .set('pending', '')
        .set('part', '')
        .set('amount', '')
        .set('needDate', '')
        .set('location', '')
        .set('startDate', '')
        .set('organizatsionUnit', '')
        .set('position', '')
        .set('note', '')
        .set('id', 'add')
        .set('file', '');
    case GET_CUREENT:
      return state.set('id', action.id);
    case GET_CUREENT_SUCCESS:
      return state.merge(action.data);
    case PUT_DATA_SUCCESS:
      return state.set('data', action.data);
    default:
      return state;
  }
}

export default recruitmentPageReducer;
