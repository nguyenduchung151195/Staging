// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_DISMISSED } from '../../../../../../config/urlConfig';
import {
  createDismissedSuccess,
  createDismissedFailure,
  updateDismissedSuccess,
  updateDismissedFailure,
  deleteDismissedSuccess,
  deleteDismissedFailure,
} from './actions';
import { CREATE_DISMISSED, UPDATE_DISMISSED, DELETE_DISMISSED } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createDismissed(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_DISMISSED, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createDismissedSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createDismissedFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createDismissedFailure(err));
  }
}

export function* updateDismissed(action) {
  try {
    const { hrmEmployeeId: DismissedId, data } = action;
    const response = yield call(request, `${API_HRM_DISMISSED}/${DismissedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateDismissedSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateDismissedFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateDismissedFailure(err));
  }
}

export function* deleteDismissed(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_DISMISSED}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteDismissedSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteDismissedFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteDismissedFailure(err));
  }
}

export default function* dismissedPageSaga() {
  yield takeLatest(CREATE_DISMISSED, createDismissed);
  yield takeLatest(UPDATE_DISMISSED, updateDismissed);
  yield takeLatest(DELETE_DISMISSED, deleteDismissed);
}
