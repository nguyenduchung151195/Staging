import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';

import { GET_TEMPLATE } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData } from './actions';
import { clientId } from '../../variable';
function* getTemplatesSaga() {
  try {
    const data = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });

    yield put(mergeData({ templates: data }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

// Individual exports for testing
export default function* emailSmsSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_TEMPLATE, getTemplatesSaga);
}
