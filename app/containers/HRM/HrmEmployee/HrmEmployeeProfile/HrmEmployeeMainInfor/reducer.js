/*
 *
 * PraisePage reducer
 *
 */

import { fromJS } from 'immutable';
import { GET_ROLE_GROUP_SUCCESS } from './constants';

export const initialState = fromJS({
  roles: []
});

function mainInforReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ROLE_GROUP_SUCCESS:
      return state.set('roles', action.data)
    default:
      return state;
  }
}

export default mainInforReducer;
