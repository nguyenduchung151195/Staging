/*
 *
 * PraisePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_PRAISE,
  CREATE_PRAISE_SUCCESS,
  CREATE_PRAISE_FAILURE,
  UPDATE_PRAISE,
  UPDATE_PRAISE_SUCCESS,
  UPDATE_PRAISE_FAILURE,
  DELETE_PRAISE,
  DELETE_PRAISE_SUCCESS,
  DELETE_PRAISE_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createPraiseSuccess: null,
  updatePraiseSuccess: null,
  deletePraiseSuccess: null,
  reload: false,
});

function PraisePageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_PRAISE:
      return state.set('isLoading', true).set('createPraiseSuccess', null).set('reload', false);
    case CREATE_PRAISE_SUCCESS:
      return state.set('isLoading', false).set('createPraiseSuccess', true).set('reload', true);
    case CREATE_PRAISE_FAILURE:
      return state.set('isLoading', false).set('createPraiseSuccess', false).set('reload', false);
    case UPDATE_PRAISE:
      return state.set('isLoading', true).set('updatePraiseSuccess', null).set('reload', false);
    case UPDATE_PRAISE_SUCCESS:
      return state.set('isLoading', false).set('updatePraiseSuccess', true).set('reload', true);
    case UPDATE_PRAISE_FAILURE:
      return state.set('isLoading', false).set('updatePraiseSuccess', false).set('reload', false);
    case DELETE_PRAISE:
      return state.set('isLoading', true).set('deletePraiseSuccess', null).set('reload', false);
    case DELETE_PRAISE_SUCCESS:
      return state.set('isLoading', false).set('deletePraiseSuccess', true).set('reload', true);
    case DELETE_PRAISE_FAILURE:
      return state.set('isLoading', false).set('deletePraiseSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default PraisePageReducer;
