/*
 *
 * SuppliersPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({ rows: [], openDrawer: false, id: 'add', suppliers: {} });

function suppliersPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'GET_SUPPLIERS_SUCCESS':
      return state.set('rows', action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default suppliersPageReducer;
