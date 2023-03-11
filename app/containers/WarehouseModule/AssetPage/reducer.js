/*
 *
 * AssetPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_TAGS,
  GET_TAGS_SUCCESS,
  GET_TAGS_FAILED,
  GET_ASSET_TYPE,
  GET_ASSET_TYPE_SUCCESS,
  GET_ASSET_TYPE_FAILED,
  GET_SUPPLIER,
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_FAILED,
  GET_PROPERTIES_SET,
  GET_PROPERTIES_SET_SUCCESS,
  GET_PROPERTIES_SET_FAILED,
  GET_CALCULATE_UNIT,
  GET_CALCULATE_UNIT_SUCCESS,
  GET_CALCULATE_UNIT_FAILED,
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_AGENCY_LEVEL,
  GET_AGENCY_LEVEL_SUCCESS,
  GET_AGENCY_LEVEL_FAILED,
  GET_DEPARTMENT,
  GET_DEPARTMENT_SUCCESS,
  GET_DEPARTMENT_FAILED,
  GET_ORIGIN,
  GET_ORIGIN_SUCCESS,
  GET_ORIGIN_FAILED,
  GET_ASSET,
  GET_ASSET_SUCCESS,
  GET_ASSET_FAILED,
  EDIT_ASSET,
  EDIT_ASSET_SUCCESS,
  EDIT_ASSET_FAILED,
  CLEANUP,
  SET_TAB_INDEX,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  isEdit: false,
  asset: null,
  successCreate: null,
  tabIndex: -1,
});

function assetPageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TAGS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_TAGS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('tagsList', action.data)
        .set('error', false);
    case GET_TAGS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ASSET_TYPE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ASSET_TYPE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('assetTypes', action.data)
        .set('error', false);
    case GET_ASSET_TYPE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_SUPPLIER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_SUPPLIER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('suppliersList', action.data)
        .set('error', false);
    case GET_SUPPLIER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PROPERTIES_SET:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PROPERTIES_SET_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('propertiesSet', action.data)
        .set('error', false);
    case GET_PROPERTIES_SET_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CALCULATE_UNIT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CALCULATE_UNIT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('calculateUnitList', action.data)
        .set('error', false);
    case GET_CALCULATE_UNIT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CATEGORY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CATEGORY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('categoryList', action.data)
        .set('error', false);
    case GET_CATEGORY_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_AGENCY_LEVEL:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_AGENCY_LEVEL_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('agency', action.data)
        .set('error', false);
    case GET_AGENCY_LEVEL_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_DEPARTMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('department', action.data)
        .set('error', false);
    case GET_DEPARTMENT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ORIGIN:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ORIGIN_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('originList', action.data)
        .set('error', false);
    case GET_ORIGIN_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
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
    case EDIT_ASSET:
      return state
        .set('loading', true)
        .set('isEdit', true)
        .set('successCreate', null)
        .set('error', false);
    case EDIT_ASSET_SUCCESS:
      return state
        .set('loading', false)
        .set('isEdit', false)
        .set('successCreate', true)
        .set('error', false);
    case EDIT_ASSET_FAILED:
      return state
        .set('loading', false)
        .set('isEdit', false)
        .set('successCreate', false)
        .set('error', true);
    case SET_TAB_INDEX:
      return state
        .set('tabIndex', action.data)
    case CLEANUP:
      return state
        .set('loading', false)
        .set('asset', null)
        .set('successCreate', null)
        .set('error', null);
    default:
      return state;
  }
}

export default assetPageReducer;
