/*
 *
 * TaskRelatePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, SET_STATE, GET_TASK_RELATE_SUCCESS, POST_TASK_SUCCESS } from './constants';

export const initialState = fromJS({
  data: '',
  _id: '',
  openDrawer2: false,
  openDrawerTask: false,
  isProject: true,
  name: '',
  template: '',
  description: '',
  startDate: '',
  endDate: '',
  taskStatus: '',
  priority: '',
  customer: '',
  inCharge: [],
  join: [],
  viewable: [],
  approved: '',
  progress: '',
  file: [],
  fileName: '',
  url: '',
  ratio: '',
  note: '',
  id: 'add',
  hiden: 0,
  taskType: 1,
  tasks: [],
  profile: {
    _id: null,
  },
  searchDay: 0,
  users: [],
  employee: '',
  stDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  enDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  filter: '',
  openDrawerSearch: false,
  taskSelect: {},
  inChargeSelect: {},
  viewableSelect: {},
  stopSelect: {},
  cancelSelect: {},
  doingSelect: {},
  progressSelect: {},
  completeSelect: {},
  completeSlowSelect: {},
  reload: 0,
  taskData: '',
  tabIndex: -1,
  filterAll: { isProject: false },
  dashboard: 0,
});

function taskRelatePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case SET_STATE:
      return state.set(action.name, action.value);
    case GET_TASK_RELATE_SUCCESS:
      return state
        .set('profile', action.profile)
        .set('tasks', action.tasks)
        .set('users', action.users);
    case POST_TASK_SUCCESS:
      return state
        .set('taskSelect', action.taskSelect)
        .set('inChargeSelect', action.inChargeSelect)
        .set('viewableSelect', action.viewableSelect)
        .set('stopSelect', action.stopSelect)
        .set('cancelSelect', action.cancelSelect)
        .set('doingSelect', action.doingSelect)
        .set('progressSelect', action.progressSelect)
        .set('completeSelect', action.completeSelect)
        .set('completeSlowSelect', action.completeSlowSelect);
    default:
      return state;
  }
}

export default taskRelatePageReducer;
