/*
 *
 * AllocationPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_ASSET,
  GET_ASSET_SUCCESS,
  GET_ASSET_FAILED,
  EDIT_ALLOCATION,
  EDIT_ALLOCATION_SUCCESS,
  EDIT_ALLOCATION_FAILED,
  CLEANUP,
  INDEX_TAB,
} from './constants';

export const initialState = fromJS({
  tabIndex: 9,
});

function allocationPageReducer(state = initialState, action) {

  switch (action.type) {
    case GET_ASSET:
      return state
        .set('loading', true)
        .set('success', false)
        .set('asset', null)
        .set('error', false);
    case GET_ASSET_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('asset', action.data)
        .set('error', false);
    case GET_ASSET_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('asset', null)
        .set('error', true);
    case EDIT_ALLOCATION:
      return state
        .set('loading', true)
        .set('isEdit', true)
        .set('successCreate', null)
        .set('error', false);
    case EDIT_ALLOCATION_SUCCESS:
      return state
        .set('loading', false)
        .set('isEdit', false)
        .set('successCreate', true)
        .set('error', false);
    case EDIT_ALLOCATION_FAILED:
      return state
        .set('loading', false)
        .set('isEdit', false)
        .set('successCreate', false)
        .set('error', true);
    case CLEANUP:
      console.log('cleanup');
      return state
        .set('loading', false)
        .set('asset', null)
        .set('successCreate', null)
        .set('error', null);
    case INDEX_TAB:
      return state
        .set('tabIndex', action.body)
    default:
      return state;
  }
}

export default allocationPageReducer;
