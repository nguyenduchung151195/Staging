// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_SUPPLIERS, API_VIEW_CONFIG } from 'config/urlConfig';
import { getSuppliersFailed, getSuppliersSuccess, getSuppliers, putConfigSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';

function* getSuppliersSaga() {
  try {
    const data = yield call(request, API_SUPPLIERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getSuppliersSuccess(data.data));
    } else {
      yield put(getSuppliersFailed());
    }
  } catch (error) {
    yield put(getSuppliersFailed());
  }
}

function* deleteSuppliers(action) {
  try {
    yield call(request, `${API_SUPPLIERS}/remove-more`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ suppliers: action.list }),
    });
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
    yield put(getSuppliers());
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
  }
}

function* putConfig(action) {
  try {
    const data = yield call(request, `${API_VIEW_CONFIG}/${action.data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putConfigSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật viewConfig thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật viewConfig thất bại' }));
    // yield put(putConfigFailed());
  }
}

// Individual exports for testing
export default function* suppliersPageSaga() {
  yield takeLatest('GET_SUPPLIERS', getSuppliersSaga);
  yield takeLatest('PUT_CONFIG', putConfig);
  yield takeLatest('DELETE_SUPPLIERS', deleteSuppliers);
}
