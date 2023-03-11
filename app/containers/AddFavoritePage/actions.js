/*
 *
 * AddFavoritePage actions
 *
 */

import {
  DEFAULT_ACTION, CHANGE_MENU_ITEM_IN_FAVORITE,
  GET_DATA_CHART_IN_FAVORITE,
  GET_DATA_CHART_IN_FAVORITE_SUCCESS,
  GET_DATA_CHART_IN_FAVORITE_FAILURE
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeMenuItemInFavorite(data) {
  return {
    type: CHANGE_MENU_ITEM_IN_FAVORITE,
    data,
  };
}

export function getDataChartInFavorite(path, name) {
  return {
    type: GET_DATA_CHART_IN_FAVORITE,
    path,
    name
  }
}
export function getDataChartInFavoriteSuccess(data) {
  return {
    type: GET_DATA_CHART_IN_FAVORITE_SUCCESS,
    data
  }
}
export function getDataChartInFavoriteFailure(error) {
  return {
    type: GET_DATA_CHART_IN_FAVORITE_FAILURE,
    error
  }
}