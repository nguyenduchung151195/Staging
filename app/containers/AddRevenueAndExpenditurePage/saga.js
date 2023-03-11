import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_CATEGORY_STOCK_TREE, API_RNE } from '../../config/urlConfig';
import {
  getCatalogSuccess,
  getCatalogFailed,
  createRecordSuccess,
  createRecordFailed,
  getRecordSuccess,
  getRecordFailed,
  updateRecordSuccess,
  updateRecordFailed,
} from './actions';
import { GET_CATEGORY, CREATE_RECORD, GET_RECORD_BY_ID, UPDATE_RECORD } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

export function* getCategory() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_CATEGORY_STOCK_TREE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success === true) {
      yield put(getCatalogSuccess(data.data));
    } else {
      yield put(getCatalogFailed({}));
    }
  } catch (err) {
    yield put(getCatalogFailed(err));
  }
}

export function* createNewRecord(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(createRecordSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
    } else {
      yield put(createRecordFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(createRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateRecord(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(updateRecordSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    } else {
      yield put(updateRecordFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(updateRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* getRecordById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getRecordSuccess(data));
    } else {
      yield put(getRecordFailed({}));
    }
  } catch (err) {
    yield put(getRecordFailed(err));
  }
}

// Individual exports for testing
export default function* addRevenueAndExpenditurePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_CATEGORY, getCategory);
  yield takeEvery(CREATE_RECORD, createNewRecord);
  yield takeEvery(GET_RECORD_BY_ID, getRecordById);
  yield takeEvery(UPDATE_RECORD, updateRecord);
}
