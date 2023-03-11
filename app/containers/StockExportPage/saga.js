import { takeEvery, call, put } from 'redux-saga/effects';
import qs from 'qs';
import request from '../../utils/request';
import { API_STOCK_EXPORT, API_ADD_NEW_PRODUCT } from '../../config/urlConfig';
import { GET_ALL_ITEMS, UPDATE_ITEMS, GET_PRODUCT } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { getAllItemsSuccess, getAllItemsFailed, updateItemsSuccess, updateItemsFailed, getProductsSuccess, getProductsFailed } from './actions';

export function* getAllItemsExport(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_STOCK_EXPORT}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllItemsSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getAllItemsFailed({}));
    }
  } catch (err) {
    yield put(getAllItemsFailed(err));
  }
}

export function* updateExport(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_STOCK_EXPORT}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    if (data) {
      yield put(updateItemsSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật xuất kho thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật xuất kho thất bại', variant: 'error' }));
      yield put(updateItemsFailed({}));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: `${err.message}`, variant: 'error' }));
    yield put(updateItemsFailed(err));
  }
}

export function* getProductById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/?${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProductsSuccess(data.data));
    } else {
      yield put(getProductsFailed({}));
    }
  } catch (err) {
    yield put(getProductsFailed(err));
  }
}

// Individual exports for testing
export default function* stockExportPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_ITEMS, getAllItemsExport);
  yield takeEvery(UPDATE_ITEMS, updateExport);
  yield takeEvery(GET_PRODUCT, getProductById);
}
