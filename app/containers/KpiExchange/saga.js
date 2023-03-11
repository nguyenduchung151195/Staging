import { takeLatest, call, put } from 'redux-saga/effects';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_CRITERIA } from '../../config/urlConfig';
import { putExchangeSuccess, getCurrentExchangeSuccess } from './actions';
import { PUT_EXCHANGE, GET_CURRENT_EXCHANGE } from './constants';

function* putExchangeSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/exchange`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(putExchangeSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thao tác thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thao tác thất bại' }));
  }
}

function* getCurrentSaga() {
  try {
    const data = yield call(request, `${API_CRITERIA}/exchange`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getCurrentExchangeSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

// Individual exports for testing
export default function* kpiExchangeSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(PUT_EXCHANGE, putExchangeSaga);
  yield takeLatest(GET_CURRENT_EXCHANGE, getCurrentSaga);
}
