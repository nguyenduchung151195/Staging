/*
 *
 * KpiProject reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, POST_DATA, POST_DATA_SUCCESS, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  data: '',
  openDrawer: false,
  code: '',
  openDialog: false,
  employees: [{ name: '', ratio: 0, id: '', type: 1 }],
  ratio: 0,
  project: '',
  projects: [],
  newEmployees: [],
  projectArr: [],
  openDialogEdit: false,
  itemKpi: '',
  itemProject: '',
  errorRatio: true,
  reload: 0,
});

function kpiProjectReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_DATA:
      return state.set('data', action.data);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data);
    case GET_DATA_SUCCESS:
      return state.set('projectArr', action.projects);

    default:
      return state;
  }
}

export default kpiProjectReducer;
