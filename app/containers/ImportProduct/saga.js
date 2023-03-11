import { call, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import request from '../../utils/request';
import { API_ORDER_PO } from '../../config/urlConfig';
import { getOrderSuccessAct, getOrderFailedAct } from './actions';
import { GET_ORDER } from './constants';
export function* getImportProduct() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ORDER_PO, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(getOrderSuccessAct(data));
  } catch (err) {
    yield put(getOrderFailedAct(err));
  }
}
// Individual exports for testing
export default function* importProductSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ORDER, getImportProduct);
}
