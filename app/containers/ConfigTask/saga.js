import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';

import { API_TASK_CONFIG, API_CREAT_TASK_CONFIG, API_UPDATE_TASK_CONFIG, API_DELETE_TASK_CONFIG } from '../../config/urlConfig';
import { GET_CONFIG, POST_CONFIG, PUT_CONFIG, DELETE_CONFIG, PUT_CONFIG_PARENT } from './constants';
import { postConfigSuccess, deleteConfigSuccess, getConfig, mergeData } from './actions';

// Individual exports for testing
export function* getTaskSaga() {
  try {
    const config = yield call(request, API_TASK_CONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.setItem('taskStatus', JSON.stringify(config));
    yield put(mergeData({ config }));
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
export function* postTaskSaga(action) {
  try {
    const response = yield call(request, `${API_CREAT_TASK_CONFIG}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (response.status === 1) {
      yield put(postConfigSuccess(response));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thành công', variant: 'success' }));
      yield put(getConfig());
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới cấu hình thất bại', variant: 'error' }));
    }
  } catch (error) {
    console.log('error', error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thất bại', variant: 'error' }));
  }
}
export function* putTaskSaga(action) {
  try {
    const data = yield call(request, `${API_UPDATE_TASK_CONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(postConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thất bại', variant: 'error' }));
  }
}
export function* deleteTaskSaga(action) {
  try {
    const data = yield call(request, `${API_DELETE_TASK_CONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: action.configId }),
    });

    yield put(deleteConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thất bại', variant: 'error' }));
  }
}

export function* putConfigParentSaga(action) {
  try {
    yield call(request, `${API_TASK_CONFIG}/${action.data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.data.data, name: action.data.name }),
    });

    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình gantt thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật  cấu hình gantt thất bại', variant: 'error' }));
  }
}

export default function* configTaskSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONFIG, getTaskSaga);
  yield takeLatest(POST_CONFIG, postTaskSaga);
  yield takeLatest(PUT_CONFIG, putTaskSaga);
  yield takeLatest(DELETE_CONFIG, deleteTaskSaga);
  yield takeLatest(PUT_CONFIG_PARENT, putConfigParentSaga);
}
