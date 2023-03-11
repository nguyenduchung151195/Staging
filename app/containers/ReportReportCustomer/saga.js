// import { take, call, put, select } from 'redux-saga/effects';
import { put, takeLatest, call } from 'redux-saga/effects';
// import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_CUSTOMERS, API_BOS } from '../../config/urlConfig';
import { getReportCustomerSuccess, fetchAllBosSuccessAction, fetchAllBosFailAction } from './actions';
import { GET_REPORT_CUSTOMER, GET_ALL_BOS } from './constants';
import { serialize } from '../../helper';
// const token = `Bearer ${localStorage.getItem('token')}`;
export function* getTaskRelatePageSaga() {
  try {
    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("sos", customers)
    yield put(getReportCustomerSuccess(customers));
  } catch (err) {
    console.log('aa', err);
    // yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
export function* fetchGetAllBos(action) {
  const { limit = 10, skip = 0 } = action
  let url = '';
  if (action.query) {
    url = `${API_BOS}?${serialize(action.query)}&limit=${limit}&skip=${skip}`;
  } else {
    url = `${API_BOS}?limit=${limit}&skip=${skip}`;
  }

  try {
    const data = yield call(request, url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      // console.log(data);
      yield put(fetchAllBosSuccessAction(data));
    }
  } catch (err) {
    yield put(fetchAllBosFailAction(err));
  }
}
// Individual exports for testing
export default function* reportReportCustomerSaga() {
  yield takeLatest(GET_REPORT_CUSTOMER, getTaskRelatePageSaga);
  yield takeLatest(GET_ALL_BOS, fetchGetAllBos);
  // See example in containers/HomePage/saga.js
}
