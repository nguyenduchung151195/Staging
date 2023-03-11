// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_BONUS } from '../../../../../../config/urlConfig';
import {
  createBonusSuccess,
  createBonusFailure,
  updateBonusSuccess,
  updateBonusFailure,
  deleteBonusSuccess,
  deleteBonusFailure,
} from './actions';
import { CREATE_BONUS, UPDATE_BONUS, DELETE_BONUS } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createBonus(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_BONUS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createBonusSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createBonusFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createBonusFailure(err));
  }
}

export function* updateBonus(action) {
  try {
    const { hrmEmployeeId: BonusId, data } = action;
    const response = yield call(request, `${API_HRM_BONUS}/${BonusId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateBonusSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateBonusFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateBonusFailure(err));
  }
}

export function* deleteBonus(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_BONUS}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteBonusSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteBonusFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteBonusFailure(err));
  }
}

export default function* BonusPageSaga() {
  yield takeLatest(CREATE_BONUS, createBonus);
  yield takeLatest(UPDATE_BONUS, updateBonus);
  yield takeLatest(DELETE_BONUS, deleteBonus);
}
