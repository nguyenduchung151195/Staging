/*
 *
 * WagesPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

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
  reaload: false
});

function wagesPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default wagesPageReducer;
