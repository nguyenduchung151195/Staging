/*
 *
 * SocialPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_SOCIAL,
  CREATE_SOCIAL_SUCCESS,
  CREATE_SOCIAL_FAILURE,
  UPDATE_SOCIAL,
  UPDATE_SOCIAL_SUCCESS,
  UPDATE_SOCIAL_FAILURE,
  DELETE_SOCIAL,
  DELETE_SOCIAL_SUCCESS,
  DELETE_SOCIAL_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createSocialSuccess: null,
  updateSocialSuccess: null,
  deleteSocialSuccess: null,
  reload: false,
});

function socialPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SOCIAL:
      return state.set('isLoading', true).set('createSocialSuccess', null).set('reload', false);
    case CREATE_SOCIAL_SUCCESS:
      return state.set('isLoading', false).set('createSocialSuccess', true).set('reload', true);
    case CREATE_SOCIAL_FAILURE:
      return state.set('isLoading', false).set('createSocialSuccess', false).set('reload', false);
    case UPDATE_SOCIAL:
      return state.set('isLoading', true).set('updateSocialSuccess', null).set('reload', false);
    case UPDATE_SOCIAL_SUCCESS:
      return state.set('isLoading', false).set('updateSocialSuccess', true).set('reload', true);
    case UPDATE_SOCIAL_FAILURE:
      return state.set('isLoading', false).set('updateSocialSuccess', false).set('reload', false);
    case DELETE_SOCIAL:
      return state.set('isLoading', true).set('deleteSocialSuccess', null).set('reload', false);
    case DELETE_SOCIAL_SUCCESS:
      return state.set('isLoading', false).set('deleteSocialSuccess', true).set('reload', true);
    case DELETE_SOCIAL_FAILURE:
      return state.set('isLoading', false).set('deleteSocialSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default socialPageReducer;
