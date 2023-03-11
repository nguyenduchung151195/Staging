import { takeLatest, call, put } from 'redux-saga/effects';

// import { push } from 'react-router-redux';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_CRITERIA } from '../../config/urlConfig';
import { postDataSuccess, getCurrentSuccess, putDataSuccess } from './actions';
import { POST_EVALUATE, GET_CURRENT, PUT_EVALUATE } from './constants';

function* postDataSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/review`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(postDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/review/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy bản đánh giá thất bại' }));
  }
}

function* putDataSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/review/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(putDataSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
  }
}

export default function* addKpiEvaluateSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_EVALUATE, postDataSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
  yield takeLatest(PUT_EVALUATE, putDataSaga);
}
