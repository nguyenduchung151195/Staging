import { takeLatest, call, put } from 'redux-saga/effects';
import { API_SALE, API_BOS, API_TRADINGS } from '../../config/urlConfig';
// import lodash from 'lodash';
import request from '../../utils/request';
import { getSalesSuccess, getDataSuccess } from './actions';
import { GET_SALES, GET_DATA } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
// import { convertTemplate } from '../../utils/common';
// Individual exports for testing

function* getSales() {
  try {
    const sales = yield call(request, API_SALE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(
      getSalesSuccess(
        sales,
        // approvess
      ),
    );
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    const businessData = yield call(request, API_BOS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const exchangingData = yield call(request, API_TRADINGS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getDataSuccess(businessData, exchangingData));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu CHKD thất bại', variant: 'error' }));
  }
}

export default function* salesQuotationsSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_SALES, getSales);
  yield takeLatest(GET_DATA, getDataSaga);
}
