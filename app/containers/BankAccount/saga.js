import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import { createAccountRequestSuccess, createcreateAccountRequestFailed } from './actions';
import {  CREATE_ACCOUNT_REQUESTED } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { API_LT_ACCOUNT } from '../../config/urlConfig';

const requestURL = API_LT_ACCOUNT;

function* createAccountRequest({ action }) {
  try {
    const { data } = action;
    const token = localStorage.getItem('token');
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createAccountRequestSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createcreateAccountRequestFailed(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createcreateAccountRequestFailed(err));
  }
}
export default function* rootSaga() {
  yield takeLatest(CREATE_ACCOUNT_REQUESTED, createAccountRequest);
}
