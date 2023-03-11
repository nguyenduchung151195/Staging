import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_CRITERIA } from '../../config/urlConfig';
import { postConfigSuccess, getCurrentConfigSuccess, putConfigSuccess } from './actions';
import { POST_CONFIG, GET_CURRENT, PUT_CONFIG } from './constants';
// Individual exports for testing

function* postConfigSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/config`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postConfigSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
    yield put(push('/kpi/config'));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
  }
}

function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/config/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getCurrentConfigSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dự liệu thất bại' }));
  }
}

function* putConfigSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/config/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putConfigSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
    yield put(push('/kpi/config'));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
  }
}
export default function* addKpiConfigSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_CONFIG, postConfigSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
  yield takeLatest(PUT_CONFIG, putConfigSaga);
}
