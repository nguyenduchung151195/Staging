import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  API_TAKE_LEAVE_MANAGER
} from 'config/urlConfig';
import {
  createTakeLeaveSuccess,
  createTakeLeaveFailure,
  updateTakeLeaveSuccess,
  updateTakeLeaveFailure,
  deleteTakeLeaveSuccess,
  deleteTakeLeaveFailure,
} from './actions';
import { CREATE_TAKE_LEAVE, UPDATE_TAKE_LEAVE, DELETE_TAKE_LEAVE } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { serialize } from 'utils/common';

export function* createTakeLeave(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_TAKE_LEAVE_MANAGER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response && response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createTakeLeaveSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createTakeLeaveFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createTakeLeaveFailure(err));
  }
}

export function* updateTakeLeave(action) {
  try {
    const { data, hrmEmployeeId } = action;
    const response = yield call(request, `${API_TAKE_LEAVE_MANAGER}/${hrmEmployeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response && response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateTakeLeaveSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateTakeLeaveFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateTakeLeaveFailure(err));
  }
}

export function* deleteTakeLeave(action) {
  try {
    const { data } = action;
    const response = yield call(request, `${API_TAKE_LEAVE_MANAGER}/${data}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    if (response && response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteTakeLeaveSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteTakeLeaveFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteTakeLeaveFailure(err));
  }
}

// Individual exports for testing
export default function* takeLeaveManagePageSaga() {
  yield takeLatest(CREATE_TAKE_LEAVE, createTakeLeave);
  yield takeLatest(UPDATE_TAKE_LEAVE, updateTakeLeave);
  yield takeLatest(DELETE_TAKE_LEAVE, deleteTakeLeave);
    // See example in containers/HomePage/saga.js
  }
  