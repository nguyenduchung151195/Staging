/*
 *
 * ReportHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_API_SUCCESS, GET_INCREASES_OR_DECREASES, GET_INCREASES_OR_DECREASES_SUCCESS, GET_LATE, GET_LATE_SUCCESS , GET_HRM_BY_MONTH_SUCCESS, GET_HRM_BY_MONTH, GET_WAGE_BY_MONTH, GET_WAGE_BY_MONTH_SUCCESS} from './constants';

export const initialState = fromJS({
  personnel: [],
  catagory: [],
});

function reportHrmPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_API_SUCCESS:
      return state.set('personnel', action.personnel).set('catagory', action.catagory);
    case GET_INCREASES_OR_DECREASES:
      return state.set('loadingChart', true);
    case GET_INCREASES_OR_DECREASES_SUCCESS:
      return state.set('increasesOrDecreases', action.data).set('loadingChart', false);
    case GET_LATE:
      return state.set('loadingChart', true);
    case GET_LATE_SUCCESS:
      return state.set('lateData', action.data).set('loadingChart', false);
    case GET_HRM_BY_MONTH:
      return state.set('loadingChart', true);
    case GET_HRM_BY_MONTH_SUCCESS:
      return state.set('hrmData', action.data).set('loadingChart', false);
    case GET_WAGE_BY_MONTH:
      return state.set('loadingChart', true);
    case GET_WAGE_BY_MONTH_SUCCESS:
      return state.set('wageData', action.data).set('loadingChart', false);
    default:
      return state;
  }
}

export default reportHrmPageReducer;
