// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_INDENTURE } from '../../../../../../config/urlConfig';
import {
  createIndentureSuccess,
  createIndentureFailure,
  updateIndentureSuccess,
  updateIndentureFailure,
  deleteIndentureSuccess,
  deleteIndentureFailure,
} from './actions';
import { CREATE_INDENTURE, UPDATE_INDENTURE, DELETE_INDENTURE } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createIndenture(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_INDENTURE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createIndentureSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createIndentureFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createIndentureFailure(err));
  }
}

export function* updateIndenture(action) {
  try {
    const { hrmEmployeeId: IndentureId, data } = action;
    const response = yield call(request, `${API_HRM_INDENTURE}/${IndentureId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateIndentureSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateIndentureFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateIndentureFailure(err));
  }
}

export function* deleteIndenture(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_INDENTURE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteIndentureSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteIndentureFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteIndentureFailure(err));
  }
}

export default function* IndenturePageSaga() {
  yield takeLatest(CREATE_INDENTURE, createIndenture);
  yield takeLatest(UPDATE_INDENTURE, updateIndenture);
  yield takeLatest(DELETE_INDENTURE, deleteIndenture);
}
