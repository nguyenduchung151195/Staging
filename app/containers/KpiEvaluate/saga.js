import { takeLatest, call, put } from 'redux-saga/effects';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_CRITERIA } from '../../config/urlConfig';
import {
  postProcessSuccess,
  getProcessCurrentSuccess,
  putProcessSuccess,
  postEvaluateSuccess,
  getEvaluateCurrentSuccess,
  putEvaluateSuccess,
  postProcessGroupSuccess,
  getProcessGroupCurrentSuccess,
  putProcessGroupSuccess,
} from './actions';
import {
  POST_PROCESS,
  GET_PROCESS_CURRENT,
  PUT_PROCESS,
  POST_EVALUATE,
  GET_EVALUATE_CURRENT,
  PUT_EVALUATE,
  POST_PROCESS_GROUP,
  GET_PROCESS_GROUP_CURRENT,
  PUT_PROCESS_GROUP,
} from './constants';
// Individual exports for testing

function* postProcessSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/processType`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postProcessSuccess(data));

    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
  }
}

function* getProcessCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/processType/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getProcessCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy loại quy trình thất bại' }));
  }
}

function* putProcessSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/processType/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putProcessSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: error.message || 'Cập nhật thất bại' }));
  }
}

function* postEvaluateSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/process`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postEvaluateSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
  }
}

function* getEvaluateCurrent(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/process/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getEvaluateCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy quy trình đánh giá thất bại' }));
  }
}

function* putEvaluateSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/process/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putEvaluateSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: error.message || 'Cập nhật thất bại' }));
  }
}

function* postProcessGroupSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/processGroup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postProcessGroupSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: error.message || 'Thêm mới thất bại' }));
  }
}

function* getProcessGroupSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/processGroup/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getProcessGroupCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy nhóm đánh giá thất bại' }));
  }
}

function* putProcessGroupSaga(action) {
  try {
    const data = yield call(request, `${API_CRITERIA}/processGroup/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putProcessGroupSuccess(data));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: error.message || 'Cập nhật thất bại' }));
  }
}

export default function* kpiEvaluateSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_PROCESS, postProcessSaga);
  yield takeLatest(GET_PROCESS_CURRENT, getProcessCurrentSaga);
  yield takeLatest(PUT_PROCESS, putProcessSaga);
  yield takeLatest(POST_EVALUATE, postEvaluateSaga);
  yield takeLatest(GET_EVALUATE_CURRENT, getEvaluateCurrent);
  yield takeLatest(PUT_EVALUATE, putEvaluateSaga);
  yield takeLatest(POST_PROCESS_GROUP, postProcessGroupSaga);
  yield takeLatest(GET_PROCESS_GROUP_CURRENT, getProcessGroupSaga);
  yield takeLatest(PUT_PROCESS_GROUP, putProcessGroupSaga);
}
