// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_PROCESS } from '../../../../../../config/urlConfig';
import {
  createProcessSuccess,
  createProcessFailure,
  updateProcessSuccess,
  updateProcessFailure,
  deleteProcessSuccess,
  deleteProcessFailure,
} from './actions';
import { CREATE_PROCESS, UPDATE_PROCESS, DELETE_PROCESS } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createProcess(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_PROCESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createProcessSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createProcessFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createProcessFailure(err));
  }
}

export function* updateProcess(action) {
  try {
    const { hrmEmployeeId: ProcessId, data } = action;
    const response = yield call(request, `${API_HRM_PROCESS}/${ProcessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateProcessSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateProcessFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateProcessFailure(err));
  }
}

export function* deleteProcess(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_PROCESS}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteProcessSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteProcessFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteProcessFailure(err));
  }
}

export default function* ProcessPageSaga() {
  yield takeLatest(CREATE_PROCESS, createProcess);
  yield takeLatest(UPDATE_PROCESS, updateProcess);
  yield takeLatest(DELETE_PROCESS, deleteProcess);
}
