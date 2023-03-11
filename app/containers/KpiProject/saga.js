import { takeLatest, call, put } from 'redux-saga/effects';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_CRITERIA, API_TASK_PROJECT } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
// import { getDataSuccess } from './actions';
import { POST_DATA, GET_DATA } from './constants';
import { postDataSuccess, getDataSuccess } from './actions';
// Individual exports for testing

function* postDataSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/task`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postDataSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Đã tồn tại KPI cho dự án này' }));
  }
}

function* getDataSaga() {
  try {
    const filter = serialize({ filter: { isProject: true } });
    const projects = yield call(request, `${API_TASK_PROJECT}?${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getDataSuccess(projects.data));
  } catch (error) {
    yield put(changeSnackbar({ variant: error, message: 'Lấy dữ liệu thất bại', status: true }));
  }
}
export default function* kpiProjectSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_DATA, postDataSaga);
  yield takeLatest(GET_DATA, getDataSaga);
}
