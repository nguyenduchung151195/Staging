// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_MATERNITY } from '../../../../../../config/urlConfig';
import {
  createMaternitySuccess,
  createMaternityFailure,
  updateMaternitySuccess,
  updateMaternityFailure,
  deleteMaternitySuccess,
  deleteMaternityFailure,
} from './actions';
import { CREATE_MATERNITY, UPDATE_MATERNITY, DELETE_MATERNITY } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createMaternity(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_MATERNITY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createMaternitySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createMaternityFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createMaternityFailure(err));
  }
}

export function* updateMaternity(action) {
  try {
    const { hrmEmployeeId: MaternityId, data } = action;
    const response = yield call(request, `${API_HRM_MATERNITY}/${MaternityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateMaternitySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateMaternityFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateMaternityFailure(err));
  }
}

export function* deleteMaternity(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_MATERNITY}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteMaternitySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteMaternityFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteMaternityFailure(err));
  }
}

export default function* maternityPageSaga() {
  yield takeLatest(CREATE_MATERNITY, createMaternity);
  yield takeLatest(UPDATE_MATERNITY, updateMaternity);
  yield takeLatest(DELETE_MATERNITY, deleteMaternity);
}
