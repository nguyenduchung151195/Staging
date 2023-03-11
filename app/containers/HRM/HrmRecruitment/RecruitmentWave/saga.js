// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_RECRUITMENT } from '../../../../../../config/urlConfig';
import { createRecruitmentSuccess, createRecruitmentFailure, updateRecruitmentSuccess, updateRecruitmentFailure } from './actions';
import { CREATE_RECRUITMENT, UPDATE_RECRUITMENT, DELETE_RECRUITMENT } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createRecruitment(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_RECRUITMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.success) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createRecruitmentSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createRecruitmentFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createRecruitmentFailure(err));
  }
}

export function* updateRecruitment(action) {
  try {
    const { hrmEmployeeId, data } = action;
    const response = yield call(request, `${API_HRM_RECRUITMENT}/${hrmEmployeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.success) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateRecruitmentSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecruitmentFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecruitmentFailure(err));
  }
}

export function* deleteRecruitment() {
  try {
    const { hrmEmployeeId } = action;
    const response = yield call(request, `${API_HRM_RECRUITMENT}/${hrmEmployeeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    debugger
    if (response.success) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteRecruitmentSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteRecruitmentFailure(response));
    }
    debugger;
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteRecruitmentFailure(err));
  }
}

export default function* recruitmentPageSaga() {
  yield takeLatest(CREATE_RECRUITMENT, createRecruitment);
  yield takeLatest(UPDATE_RECRUITMENT, updateRecruitment);
  yield takeLatest(DELETE_RECRUITMENT, deleteRecruitment);
}
