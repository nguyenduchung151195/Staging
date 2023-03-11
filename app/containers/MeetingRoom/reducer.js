/*
 *
 * MeetingRoom reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, POST_DATA_SUCCESS, GET_CURRENT_SUCCESS, GET_CURRENT, PUT_DATA_SUCCESS, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  data: '',
  name: '',
  openDrawer: false,
  address: '',
  acreage: 0,
  utilities: [],
  utilitiesArr: ['Bàn, ghế', 'Máy chiếu', 'Bảng viết'],
  reload: 0,
  id: 'add',
  tab: 0,
  meetings: [],
  newMeeting: [],
  idCalendar: 'add',
  openDrawerMeeting: false,
});

function meetingRoomReducer(state = initialState, action) {
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
    case GET_DATA_SUCCESS:
      return state.set('meetings', action.meetings.data);
    default:
      return state;
  }
}

export default meetingRoomReducer;
