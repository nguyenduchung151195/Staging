/*
 *
 * SocialInsurancePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  CREATE_SOCIALINSURANCE,
  CREATE_SOCIALINSURANCE_SUCCESS,
  CREATE_SOCIALINSURANCE_FAILURE,
  UPDATE_SOCIALINSURANCE,
  UPDATE_SOCIALINSURANCE_SUCCESS,
  UPDATE_SOCIALINSURANCE_FAILURE,
  DELETE_SOCIALINSURANCE,
  DELETE_SOCIALINSURANCE_SUCCESS,
  DELETE_SOCIALINSURANCE_FAILURE,
  SHARE_INSURANCE_REQUEST,
  SHARE_INSURANCE_FAILED,
  SHARE_INSURANCE_SUCCESS,
  GET_INSURANCE_DATA_REQUEST,
  GET_INSURANCE_DATA_SUCCESS,
  GET_INSURANCE_DATA_FAILED,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createSocialInsuranceSuccess: null,
  updateSocialInsuranceSuccess: null,
  deleteSocialInsuranceSuccess: null,
  shareInsuranceSuccess: null,
  tab: 0,
  reload: false,
  data: null
});

function socialInsurancePageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case CREATE_SOCIALINSURANCE:
      return state
        .set('isLoading', true)
        .set('createSocialInsuranceSuccess', null)
        .set('reload', false);
    case CREATE_SOCIALINSURANCE_SUCCESS:
      return state
        .set('isLoading', false)
        .set('createSocialInsuranceSuccess', true)
        .set('reload', true);
    case CREATE_SOCIALINSURANCE_FAILURE:
      return state
        .set('isLoading', false)
        .set('createSocialInsuranceSuccess', false)
        .set('reload', false);
    case UPDATE_SOCIALINSURANCE:
      return state
        .set('isLoading', true)
        .set('updateSocialInsuranceSuccess', null)
        .set('reload', false);
    case UPDATE_SOCIALINSURANCE_SUCCESS:
      return state
        .set('isLoading', false)
        .set('updateSocialInsuranceSuccess', true)
        .set('reload', true);
    case UPDATE_SOCIALINSURANCE_FAILURE:
      return state
        .set('isLoading', false)
        .set('updateSocialInsuranceSuccess', false)
        .set('reload', false);

    case SHARE_INSURANCE_REQUEST:
      return state
        .set('isLoading', true)
        .set('shareInsuranceSuccess', null)
        .set('reload', false);
    case SHARE_INSURANCE_SUCCESS:
      return state
        .set('isLoading', false)
        .set('shareInsuranceSuccess', true)
        .set('reload', true);
    case SHARE_INSURANCE_FAILED:
      return state
        .set('isLoading', false)
        .set('shareInsuranceSuccess', false)
        .set('reload', false);

    case GET_INSURANCE_DATA_REQUEST:
      return state
        .set('isLoading', true)
        .set('getInsuranceDataSuccess', null)
        .set('reload', false);
    case GET_INSURANCE_DATA_SUCCESS:
      return state
        .set('isLoading', false)
        .set('getInsuranceDataSuccess', true)
        .set('reload', true);
    case GET_INSURANCE_DATA_FAILED:
      return state
        .set('isLoading', false)
        .set('getInsuranceDatSuccess', false)
        .set('reload', false);

    case DELETE_SOCIALINSURANCE:
      return state
        .set('isLoading', true)
        .set('deleteSocialInsuranceSuccess', null)
        .set('reload', false);
    case DELETE_SOCIALINSURANCE_SUCCESS:
      return state
        .set('isLoading', false)
        .set('deleteSocialInsuranceSuccess', true)
        .set('reload', true);
    case DELETE_SOCIALINSURANCE_FAILURE:
      return state
        .set('isLoading', false)
        .set('deleteSocialInsuranceSuccess', false)
        .set('reload', false);
    default:
      return state;
  }
}

export default socialInsurancePageReducer;
