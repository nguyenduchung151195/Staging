import { takeLatest, call, put } from 'redux-saga/effects';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { getDataSuccess, mergeData } from './actions';
import { GET_DATA } from './constants';
// Individual exports for testing
export function* getDataSaga() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_REPORT}/debtCustomer`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    let circleColumns = [];
    if (data) {
      circleColumns = [
        {
          country: 'Tổng công nợ bán hàng',
          value: data.totalSaleDebtAll,
        },
        {
          country: 'Tổng ông nợ hợp đồng',
          value: data.totalContractDebtAll,
        },
      ];
    }
    yield put(getDataSuccess(data));
    yield put(mergeData({ circleColumns }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* liabilitiesReportSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
