import { fromJS } from 'immutable';
import {
  GET_INFO,
  GET_INFO_SUCCESS,
  GET_INFO_FAILURE,
  GET_FACE_INFO_SUCCESS,
  GET_FACE_INFO_FAILURE,
  TIMEKEENGPING,
  TIMEKEENGPING_SUCCESS,
  TIMEKEENGPING_FAILURE,
} from './constant';
export const initialState = fromJS({
  userData: {},
  faceInfo: {},
  timekeepingData: null,
  timekeepingSuccess: null,
});

function faceRecognitionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INFO_SUCCESS:
      return state.set('userData', action.data);
    case GET_FACE_INFO_SUCCESS:
      return state.set('faceInfo', action.data);
    case GET_FACE_INFO_FAILURE:
      return state.set('faceInfo', {});
    case TIMEKEENGPING:
      return state.set('timekeepingSuccess', null);
    case TIMEKEENGPING_SUCCESS:
      return state.set('timekeepingData', action.data).set('timekeepingSuccess', true);
    case TIMEKEENGPING_FAILURE:
      return state;
    default:
      return state;
  }
}

export default faceRecognitionReducer;
