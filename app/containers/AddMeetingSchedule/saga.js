import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { API_MEETING, API_ORIGANIZATION } from '../../config/urlConfig';
import request from '../../utils/request';

import { postDataSuccess, getCurrentSuccess, putDataSuccess, mergeData } from './actions';
import { POST_DATA, GET_CURRENT, PUT_DATA, GET_DATA } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

// Individual exports for testing

function* postDataSaga(action) {
  try {
    const data = yield call(request, API_MEETING, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));

    if (action.data.callback) action.data.callback(data);
    else yield put(push('/Calendar/meeting-calendar'));
  } catch (error) {
    const mess = error.message.split("||")
    console.log(action, "action")
    if(action && action.handleGetErr){
      action.handleGetErr(mess)
    }
    const err = mess  && Array.isArray(mess) && mess.length === 2 ? mess[0] : ""
    yield put(changeSnackbar({ status: true, message: err ||  error.message, variant: 'error' }));
  }
}

function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_MEETING}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    data.customer = Array.isArray(data.customer) ? data.customer.map(i => ({ _id: i.customerId, name: i.name })) : [];
    yield put(getCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy lịch họp thất bại', variant: 'error' }));
  }
}

function* putDataSaga(action) {
  try {
    const data = yield call(request, `${API_MEETING}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    if (action.data.callback) action.data.callback(data);
    else yield put(push('/Calendar/meeting-calendar'));
  } catch (error) {
    // yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    console.log('error', error)
    const mess = error.message.split("||")
    console.log(action, "action")
    if(action && action.handleGetErr){
      action.handleGetErr(mess)
    }
    const err = mess  && Array.isArray(mess) && mess.length === 2 ? mess[0] : ""
    yield put(changeSnackbar({ status: true, message: err ||  error.message, variant: 'error' }));
  }
}

function* getTasksSaga() {
  try {
    const departments = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(
      mergeData({
        departments,
      }),
    );
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

export default function* addMeetingScheduleSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_DATA, postDataSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
  yield takeLatest(PUT_DATA, putDataSaga);
  yield takeLatest(GET_DATA, getTasksSaga);
}
