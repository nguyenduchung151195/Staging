// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_PRAISE } from '../../../../../../config/urlConfig';
import {
  createPraiseSuccess,
  createPraiseFailure,
  updatePraiseSuccess,
  updatePraiseFailure,
  deletePraiseSuccess,
  deletePraiseFailure,
} from './actions';
import { CREATE_PRAISE, UPDATE_PRAISE, DELETE_PRAISE } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createPraise(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_PRAISE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createPraiseSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createPraiseFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createPraiseFailure(err));
  }
}

export function* updatePraise(action) {
  try {
    const { hrmEmployeeId: PraiseId, data } = action;
    const response = yield call(request, `${API_HRM_PRAISE}/${PraiseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updatePraiseSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updatePraiseFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updatePraiseFailure(err));
  }
}

export function* deletePraise(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_PRAISE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deletePraiseSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deletePraiseFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deletePraiseFailure(err));
  }
}

export default function* praisePageSaga() {
  yield takeLatest(CREATE_PRAISE, createPraise);
  yield takeLatest(UPDATE_PRAISE, updatePraise);
  yield takeLatest(DELETE_PRAISE, deletePraise);
}
