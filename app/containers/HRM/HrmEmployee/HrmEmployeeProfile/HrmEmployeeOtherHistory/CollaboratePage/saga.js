// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_BUSINESS_TRIP } from '../../../../../../config/urlConfig';
import {
  createCollaborateSuccess,
  createCollaborateFailure,
  updateCollaborateSuccess,
  updateCollaborateFailure,
  deleteCollaborateSuccess,
  deleteCollaborateFailure,
} from './actions';
import { CREATE_COLLABORATE, UPDATE_COLLABORATE, DELETE_COLLABORATE } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createCollaborate(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_BUSINESS_TRIP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createCollaborateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createCollaborateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createCollaborateFailure(err));
  }
}

export function* updateCollaborate(action) {
  try {
    const { hrmEmployeeId: CollaborateId, data } = action;
    const response = yield call(request, `${API_HRM_BUSINESS_TRIP}/${CollaborateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateCollaborateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateCollaborateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateCollaborateFailure(err));
  }
}

export function* deleteCollaborate(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_BUSINESS_TRIP}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteCollaborateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteCollaborateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteCollaborateFailure(err));
  }
}

export default function* collaboratePageSaga() {
  yield takeLatest(CREATE_COLLABORATE, createCollaborate);
  yield takeLatest(UPDATE_COLLABORATE, updateCollaborate);
  yield takeLatest(DELETE_COLLABORATE, deleteCollaborate);
}
