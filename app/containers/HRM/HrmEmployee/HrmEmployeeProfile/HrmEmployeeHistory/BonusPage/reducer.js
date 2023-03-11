/*
 *
 * BonusPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_BONUS,
  CREATE_BONUS_SUCCESS,
  CREATE_BONUS_FAILURE,
  UPDATE_BONUS,
  UPDATE_BONUS_SUCCESS,
  UPDATE_BONUS_FAILURE,
  DELETE_BONUS,
  DELETE_BONUS_SUCCESS,
  DELETE_BONUS_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createBonusSuccess: null,
  updateBonusSuccess: null,
  deleteBonusSuccess: null,
  reload: false,
});

function bonusPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_BONUS:
      return state.set('isLoading', true).set('createBonusSuccess', null).set('reload', false);
    case CREATE_BONUS_SUCCESS:
      return state.set('isLoading', false).set('createBonusSuccess', true).set('reload', true);
    case CREATE_BONUS_FAILURE:
      return state.set('isLoading', false).set('createBonusSuccess', false).set('reload', false);
    case UPDATE_BONUS:
      return state.set('isLoading', true).set('updateBonusSuccess', null).set('reload', false);
    case UPDATE_BONUS_SUCCESS:
      return state.set('isLoading', false).set('updateBonusSuccess', true).set('reload', true);
    case UPDATE_BONUS_FAILURE:
      return state.set('isLoading', false).set('updateBonusSuccess', false).set('reload', false);
    case DELETE_BONUS:
      return state.set('isLoading', true).set('deleteBonusSuccess', null).set('reload', false);
    case DELETE_BONUS_SUCCESS:
      return state.set('isLoading', false).set('deleteBonusSuccess', true).set('reload', true);
    case DELETE_BONUS_FAILURE:
      return state.set('isLoading', false).set('deleteBonusSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default bonusPageReducer;
