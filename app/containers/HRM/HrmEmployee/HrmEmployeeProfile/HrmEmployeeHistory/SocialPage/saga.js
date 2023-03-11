// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_SOCIAL } from '../../../../../../config/urlConfig';
import {
  createSocialSuccess,
  createSocialFailure,
  updateSocialSuccess,
  updateSocialFailure,
  deleteSocialSuccess,
  deleteSocialFailure,
} from './actions';
import { CREATE_SOCIAL, UPDATE_SOCIAL, DELETE_SOCIAL } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createSocial(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_SOCIAL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createSocialSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createSocialFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createSocialFailure(err));
  }
}

export function* updateSocial(action) {
  try {
    const { hrmEmployeeId: SocialId, data } = action;
    const response = yield call(request, `${API_HRM_SOCIAL}/${SocialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateSocialSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateSocialFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateSocialFailure(err));
  }
}

export function* deleteSocial(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_SOCIAL}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteSocialSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteSocialFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteSocialFailure(err));
  }
}

export default function* SocialPageSaga() {
  yield takeLatest(CREATE_SOCIAL, createSocial);
  yield takeLatest(UPDATE_SOCIAL, updateSocial);
  yield takeLatest(DELETE_SOCIAL, deleteSocial);
}
