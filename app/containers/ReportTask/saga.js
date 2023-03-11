import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { API_REPORT } from 'config/urlConfig';
import { getDataSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { GET_DATA } from './constants';
// Individual exports for testing

function* getDataSaga() {
  try {
    const data = yield call(request, `${API_REPORT}/taskPlan`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getDataSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

export default function* reportTaskSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
