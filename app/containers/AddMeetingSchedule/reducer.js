/*
 *
 * AddMeetingSchedule reducer
 *
 */

import { fromJS } from 'immutable';
import { URL_MEETTING } from '../../config/urlConfig';
import { DEFAULT_ACTION, MERGE_DATA, POST_DATA_SUCCESS, GET_CURRENT, GET_CURRENT_SUCCESS, PUT_DATA_SUCCESS, GET_DEFAULT } from './constants';

export const initialState = fromJS({
  code: '',
  data: '',
  file: undefined,
  date: new Date(),
  timeStart: new Date(),
  timeEnd: new Date(),
  from: null,
  link: 'Calendar/meeting-calendar',
  organizer: null,
  people: null,
  prepare: null,
  prepareMeeting: '',
  name: '',
  address: '',
  content: '',
  kanbanStatus: 0,
  task: null,
  roomMetting: null,
  id: 'add',
  typeCalendar: 1, // 1 la lich hop, 2 la cong tac
  tab: 0,
  reload: 0,
  openDrawer: false,
  idTask: 'add',
  filter: {},
  employee: null,
  departments: [],
  department: '',
  linkMeeting: URL_MEETTING,
  isOnlineMeeting: false
});

function addMeetingScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data);
    case GET_CURRENT:
      return state.set('id', action.id);
    case GET_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_DATA_SUCCESS:
      return state.set('data', action.data);
    case GET_DEFAULT:
      return state.merge(initialState);
    default:
      return state;
  }
}

export default addMeetingScheduleReducer;
