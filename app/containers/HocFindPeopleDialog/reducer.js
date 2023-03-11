/*
 *
 * HocFindPeopleDialog reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_ALL_PEOPLE, GET_ALL_PEOPLE_SUCCESS, GET_ALL_PEOPLE_FAIL } from './constants';

export const initialState = fromJS({});

function hocFindPeopleDialogReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_ALL_PEOPLE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_PEOPLE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_PEOPLE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('people', action.data);
    default:
      return state;
  }
}

export default hocFindPeopleDialogReducer;
