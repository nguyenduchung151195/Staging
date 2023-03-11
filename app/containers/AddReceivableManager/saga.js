import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';
import { getReportReceivableManagerFailure, getReportReceivableManagerSuccess } from './actions';
import { GET_REPORT_RECEIVABLE_MANAGER } from './constants';
export function* getReportReceivableManagerSaga(action) {
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
      yield put(getReportReceivableManagerSuccess(data));
    } else {
      yield put(getReportReceivableManagerFailure(res));
    }
  } catch (error) {
    console.log(1, error)
    yield put(getReportReceivableManagerFailure(error));
  }
}
// Individual exports for testing
export default function* addReceivableManagerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_REPORT_RECEIVABLE_MANAGER, getReportReceivableManagerSaga);
}
