import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';
import { getReportExpenseFailure, getReportExpenseSuccess } from './actions';
import { GET_REPORT_EXPENSE } from './constants';

export function* getReportExpenseSaga(action) {
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
      yield put(getReportExpenseSuccess(data));
    } else {
      yield put(getReportExpenseFailure(res));
    }
  } catch (error) {
    console.log(1, error)
    yield put(getReportExpenseFailure(error));
  }
}

// Individual exports for testing
export default function* addExpenseManageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_REPORT_EXPENSE, getReportExpenseSaga);

}
