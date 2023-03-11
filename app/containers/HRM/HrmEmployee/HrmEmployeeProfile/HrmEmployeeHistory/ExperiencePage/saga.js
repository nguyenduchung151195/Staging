// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_EXPERIENCE } from '../../../../../../config/urlConfig';
import {
  createExperienceSuccess,
  createExperienceFailure,
  updateExperienceSuccess,
  updateExperienceFailure,
  deleteExperienceSuccess,
  deleteExperienceFailure,
} from './actions';
import { CREATE_EXPERIENCE, UPDATE_EXPERIENCE, DELETE_EXPERIENCE } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createExperience(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_EXPERIENCE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createExperienceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createExperienceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createExperienceFailure(err));
  }
}

export function* updateExperience(action) {
  try {
    const { hrmEmployeeId: ExperienceId, data } = action;
    const response = yield call(request, `${API_HRM_EXPERIENCE}/${ExperienceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateExperienceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateExperienceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateExperienceFailure(err));
  }
}

export function* deleteExperience(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_EXPERIENCE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteExperienceSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteExperienceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteExperienceFailure(err));
  }
}

export default function* ExperiencePageSaga() {
  yield takeLatest(CREATE_EXPERIENCE, createExperience);
  yield takeLatest(UPDATE_EXPERIENCE, updateExperience);
  yield takeLatest(DELETE_EXPERIENCE, deleteExperience);
}
