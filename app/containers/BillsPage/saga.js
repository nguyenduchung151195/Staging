import { takeEvery, takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_BILLS } from '../../config/urlConfig';
import { GET_ALL_BILLS, UPDATE_BILL_STATUS, DELETE_BILLS } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getAllBillsSuccess,
  getAllBillsFailed,
  updateBillStatusSuccess,
  updateBillStatusFailed,
  deleteBillsSuccess,
  deleteBillsFailed,
} from './actions';
import { serialize } from '../../helper';

export function* getAllBills(action) {
  const token = localStorage.getItem('token');
  let url = '';
  if (action.query) {
    url = `${API_BILLS}?${serialize(action.query)}`;
  } else {
    url = `${API_BILLS}`;
  }

  try {
    const data = yield call(request, url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllBillsSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getAllBillsFailed({}));
    }
  } catch (err) {
    yield put(getAllBillsFailed(err));
  }
}

export function* updateStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_BILLS}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (!data || data.status === 0) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thất bại', variant: 'error' }));
      yield put(updateBillStatusFailed());
    } else {
      yield put(updateBillStatusSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(updateBillStatusFailed(err));
    yield put(updateBillStatusFailed({ status: true, message: 'Cập nhật trạng thái thất bại', variant: 'error' }));
  }
}

export function* deleteBills(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_BILLS}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (data.success) {
      yield put(deleteBillsSuccess(data.data));
      yield put(changeSnackbar({ status: true, message: 'Xóa hóa đơn thành công', variant: 'success' }));
      const dataNew = yield call(request, API_BILLS, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        yield put(getAllBillsSuccess(dataNew));
      } else {
        yield put(getAllBillsFailed({}));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa hóa đơn thất bại', variant: 'error' }));
      yield put(deleteBillsFailed());
    }
  } catch (err) {
    yield put(deleteBillsFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa hóa đơn thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* billsPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_BILLS, getAllBills);
  yield takeLatest(UPDATE_BILL_STATUS, updateStatus);
  yield takeLatest(DELETE_BILLS, deleteBills);
}
