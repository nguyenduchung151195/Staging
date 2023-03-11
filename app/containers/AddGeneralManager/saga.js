import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';
import { getReportGeneralFailure, getReportGeneralSuccess } from './actions';
import { GET_REPORT_GENERAL } from './constants';

export function* getReportGeneralSaga(action) {
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
      yield put(getReportGeneralSuccess(data));
    } else {
      yield put(getReportGeneralFailure(res));
    }
  } catch (error) {
    console.log(1, error)
    yield put(getReportGeneralFailure(error));
  }
}
// Individual exports for testing
export default function* addGeneralManagerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_REPORT_GENERAL, getReportGeneralSaga);
}
