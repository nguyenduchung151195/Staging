import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TEMPLATE, API_CAMPAIGN, API_CUSTOMERS } from 'config/urlConfig';
import { GET_DATA, POST_DATA, GET_CURRENT } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { getDataSuccess, postDataSuccess, getCurrentSuccess } from './actions';
import { clientId } from '../../variable';
// Individual exports for testing

function* getTemplatesSaga() {
  try {
    const templates = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });

    const data = templates.filter(item => item.formType === 'email');
    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getDataSuccess(data, customers.data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* postDataSaga(action) {
  try {
    const data = yield call(request, API_CAMPAIGN, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postDataSuccess(data));
    if (action.data.callback) action.data.callback();
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message || 'Thêm mới thất bại', variant: 'error' }));
    // yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}


function* putDataSaga(action) {
  try {
    const data = yield call(request, `${API_CAMPAIGN}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postDataSuccess(data));
    if (action.data.callback) action.data.callback();
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}


function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_CAMPAIGN}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(getCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy chiến dịch thất bại' }));
  }
}

export default function* addEmailCampaignSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getTemplatesSaga);
  yield takeLatest(POST_DATA, postDataSaga);
  yield takeLatest("PUT_DATA_CD_PAGE", putDataSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
}
