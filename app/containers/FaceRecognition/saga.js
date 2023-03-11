import { takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { getInfoSuccess, getInfoFailure, getFaceInfoSuccess, getFaceInfoFailure, timeKeepingSuccess, timeKeepingFailure } from './actions';
import { GET_INFO, GET_FACE_INFO, TIMEKEENGPING } from './constant';
import request from 'utils/request';
import { API_TIMEKEEPING_2 } from 'config/urlConfig';

// try {
//   const data = yield call(request, `${API_PERSONNEL}?${action.body}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   });
//   if (data) {
//     yield put(fetchAllUserSuccessAction({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
//   }
// } catch (err) {
//   yield put(fetchAllUserfalseAction(err));
// }

const objTemp = {
  name: 'Đỗ  Việt Bách',
  code: '000039',
  gender: 'Nam',
  birthday: '01-01-1997',
  email: 'dovietbacch791997@gmail.com',
  phoneNumber: '0368923930',
  identityCardNumber: '1551060735',
};

export function* getInfoSaga() {
  try {
    yield put(getInfoSuccess(objTemp));
  } catch (error) {
    yield put(getInfoFailure());
  }
}

export function* fetchFaceInfoSaga(action) {
  try {
    const data2 = yield call(request, 'API_TEMPLATE', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(getInfoSuccess());
  } catch (error) {
    yield put(getInfoFailure());
  }
}

export function* timeKeeping(action) {
  try {
    // console.log('action', action);
    const response = yield call(request, API_TIMEKEEPING_2, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    // console.log('response', response);
    if (response.status === 1) yield put(timeKeepingSuccess(response.data));
    else yield put(timeKeepingFailure());
  } catch (error) {
    yield put(timeKeepingFailure());
  }
}

export default function* faceRecognitionSaga() {
  yield takeLatest(GET_INFO, getInfoSaga);
  yield takeLatest(GET_FACE_INFO, fetchFaceInfoSaga);
  yield takeEvery(TIMEKEENGPING, timeKeeping);
}
