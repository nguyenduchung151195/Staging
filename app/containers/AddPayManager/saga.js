import { put, takeLatest, call } from 'redux-saga/effects';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_REPORT } from '../../config/urlConfig';
import { getDataSuccess, getReportPayManagerFailure, getReportPayManagerSuccess, mergeData } from './actions';
import { GET_DATA, GET_REPORT_PAY_MANAGER } from './constants';

// Individual exports for testing
export function* getDataSaga() {
  try {
    const data = yield call(request, `${API_REPORT}/debtSupplier`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    let circleColumns = [];
    if (data) {
      circleColumns = [
        {
          country: 'Tổng công nợ phải trả',
          value: data.total,
        },
      ];
    }

    yield put(getDataSuccess(data));
    yield put(mergeData({ circleColumns }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* getReportPayManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { path } = action;
    const res = yield call(request, `${API_REPORT}/${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      const data = { path, data: res.data };
      yield put(getReportPayManagerSuccess(data));
    } else {
      yield put(getReportPayManagerFailure(res));
    }
  } catch (error) {
    console.log(1, error)
    yield put(getReportPayManagerFailure(error));
  }
}

export default function* addPayManagerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(GET_REPORT_PAY_MANAGER, getReportPayManagerSaga);
}
