// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_EDUCATION } from '../../../../../../config/urlConfig';
import {
  createEducationSuccess,
  createEducationFailure,
  updateEducationSuccess,
  updateEducationFailure,
  deleteEducationSuccess,
  deleteEducationFailure,
} from './actions';
import { CREATE_EDUCATION, UPDATE_EDUCATION, DELETE_EDUCATION } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createEducation(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_EDUCATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createEducationSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createEducationFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createEducationFailure(err));
  }
}

export function* updateEducation(action) {
  try {
    const { hrmEmployeeId: EducationId, data } = action;
    const response = yield call(request, `${API_HRM_EDUCATION}/${EducationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateEducationSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateEducationFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateEducationFailure(err));
  }
}

export function* deleteEducation(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_EDUCATION}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteEducationSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteEducationFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteEducationFailure(err));
  }
}

export default function* EducationPageSaga() {
  yield takeLatest(CREATE_EDUCATION, createEducation);
  yield takeLatest(UPDATE_EDUCATION, updateEducation);
  yield takeLatest(DELETE_EDUCATION, deleteEducation);
}
