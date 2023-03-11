// import { take, call, put, select } from 'redux-saga/effects';

import { takeLatest, call, put } from 'redux-saga/effects';
import { getDataSuccess, postCampaignSuccess, putCampaignSuccess } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_TEMPLATE, API_CAMPAIGN, API_CUSTOMERS } from '../../config/urlConfig';

import { GET_DATA, POST_CAMPAIGN, PUT_CAMPAIGN } from './constants';
import { clientId } from '../../variable';
// Individual exports for testing

export function* getTemplateSaga() {
  try {
    const templates = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });
    const data = templates.filter(item => item.formType === 'sms');
    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getDataSuccess(data, customers.data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
function* postCampaignSaga(action) {
  try {
    const data = yield call(request, API_CAMPAIGN, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postCampaignSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}
function* putCampaignSaga(action) {
  try {
    const data = yield call(request, `${API_CAMPAIGN}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putCampaignSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhập thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhập thất bại', variant: 'error' }));
  }
}
// Individual exports for testing
export default function* addSmsCampaignSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getTemplateSaga);
  yield takeLatest(POST_CAMPAIGN, postCampaignSaga);
  yield takeLatest(PUT_CAMPAIGN, putCampaignSaga);
}
