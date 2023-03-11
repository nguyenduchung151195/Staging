/*
 *
 * AddFavoritePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_DATA_CHART_IN_FAVORITE_SUCCESS, CHANGE_MENU_ITEM_IN_FAVORITE } from './constants';

export const initialState = fromJS({ menu: 0 });

function addFavoritePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
      case CHANGE_MENU_ITEM_IN_FAVORITE:
      // TT: "ĐÁNH DẤU MENU ITEM" ĐƯỢC CHỌN : "data" = "{menu: ...}"
      return state.merge(action.data);
    case GET_DATA_CHART_IN_FAVORITE_SUCCESS:
      // TT: dựa vào ITEM MENU được chọn -CALL API- LẤY DỮ LIỆU TƯƠNG ỨNG để RENDER ra biểu đồ tương ứng
      const { data: { name, data } } = action;
      return state.set(name, data);
    default:
      return state;
  }
}

export default addFavoritePageReducer;
