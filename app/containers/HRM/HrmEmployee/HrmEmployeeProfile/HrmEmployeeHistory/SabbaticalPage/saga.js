// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_SABBATICAL } from '../../../../../../config/urlConfig';
import {
  createSabbaticalSuccess,
  createSabbaticalFailure,
  updateSabbaticalSuccess,
  updateSabbaticalFailure,
  deleteSabbaticalSuccess,
  deleteSabbaticalFailure,
} from './actions';
import { CREATE_SABBATICAL, UPDATE_SABBATICAL, DELETE_SABBATICAL } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createSabbatical(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_SABBATICAL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createSabbaticalSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createSabbaticalFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createSabbaticalFailure(err));
  }
}

export function* updateSabbatical(action) {
  try {
    const { hrmEmployeeId: SabbaticalId, data } = action;
    const response = yield call(request, `${API_HRM_SABBATICAL}/${SabbaticalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateSabbaticalSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateSabbaticalFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateSabbaticalFailure(err));
  }
}

export function* deleteSabbatical(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_SABBATICAL}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteSabbaticalSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteSabbaticalFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteSabbaticalFailure(err));
  }
}

export default function* SabbaticalPageSaga() {
  yield takeLatest(CREATE_SABBATICAL, createSabbatical);
  yield takeLatest(UPDATE_SABBATICAL, updateSabbatical);
  yield takeLatest(DELETE_SABBATICAL, deleteSabbatical);
}
