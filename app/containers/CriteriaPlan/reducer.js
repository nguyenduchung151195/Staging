/*
 *
 * CriteriaPlan reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  times: 1,
  year: new Date().getFullYear(),
  month: [],
  day: {},
  quater: [],
  kpi: null,
  departments: [],
  setCriteria: [],
  criterias: [],
  criteriaArr: [],
  filter: {},
  startDate: '',
  endDate: '',
  listDeperments: [],
  setCriteras: { _id: 'fff' },
});

function criteriaPlanReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state
        .set('departments', action.departments)
        .set('setCriteria', action.setCriteria)
        .set('criterias', action.criterias);
    default:
      return state;
  }
}

export default criteriaPlanReducer;
