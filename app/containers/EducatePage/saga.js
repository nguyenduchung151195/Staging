// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_HRM_EDUCATION, API_EDUCATE_PLAN, API_EDUCATE_ROUND } from '../../config/urlConfig';
import {
  createEducateSuccess,
  createEducateFailure,
  updateEducateSuccess,
  updateEducateFailure,
  deleteEducateSuccess,
  deleteEducateFailure,
  createEducateRoundSuccess,
  createEducateRoundFailure,
  updateEducateRoundSuccess,
  updateEducateRoundFailure,
  deleteEducateRoundFailure,
  deleteEducateRoundSuccess
} from './actions';
import { CREATE_EDUCATE, UPDATE_EDUCATE, DELETE_EDUCATE, CREATE_EDUCATE_ROUND, UPDATE_EDUCATE_ROUND, DELETE_EDUCATE_ROUND } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

export function* createEducate(action) {
  try {
    const { data } = action;
    const response = yield call(request, `${API_EDUCATE_PLAN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createEducateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || response.error || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createEducateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createEducateFailure(err));
  }
}

export function* updateEducate(action) {
  try {
    const { id, data } = action;
    const response = yield call(request, `${API_EDUCATE_PLAN}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateEducateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateEducateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateEducateFailure(err));
  }
}

export function* deleteEducate(action) {
  try {
    const { ids } = action;
    const response = yield call(request, `${API_EDUCATE_PLAN}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteEducateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteEducateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteEducateFailure(err));
  }
}

export function* createEducateRound(action) {
  try {
    const { data } = action;
    const response = yield call(request, `${API_EDUCATE_ROUND}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createEducateRoundSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createEducateRoundFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createEducateRoundFailure(err));
  }
}

export function* updateEducateRound(action) {
  try {
    const { id, data } = action;
    console.log(data)
    const response = yield call(request, `${API_EDUCATE_ROUND}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateEducateRoundSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateEducateRoundFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateEducateRoundFailure(err));
  }
}
export function* deleteEducateRound(action) {
  try {
    const { ids } = action;
    const response = yield call(request, `${API_EDUCATE_ROUND}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteEducateRoundSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteEducateRoundFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteEducateRoundFailure(err));
  }
}
export default function* educatePage() {
  yield takeLatest(CREATE_EDUCATE, createEducate);
  yield takeLatest(UPDATE_EDUCATE, updateEducate);
  yield takeLatest(DELETE_EDUCATE, deleteEducate);
  yield takeLatest(CREATE_EDUCATE_ROUND, createEducateRound);
  yield takeLatest(UPDATE_EDUCATE_ROUND, updateEducateRound);
  yield takeLatest(DELETE_EDUCATE_ROUND, deleteEducateRound);




}
