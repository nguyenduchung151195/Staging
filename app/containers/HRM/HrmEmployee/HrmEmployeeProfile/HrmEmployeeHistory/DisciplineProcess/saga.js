// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_DISCIPLINE } from '../../../../../../config/urlConfig';
import {
  createDisciplineSuccess,
  createDisciplineFailure,
  updateDisciplineSuccess,
  updateDisciplineFailure,
  deleteDisciplineSuccess,
  deleteDisciplineFailure,
} from './actions';
import { CREATE_DISCIPLINE, UPDATE_DISCIPLINE, DELETE_DISCIPLINE } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createDiscipline(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_DISCIPLINE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createDisciplineSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createDisciplineFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createDisciplineFailure(err));
  }
}

export function* updateDiscipline(action) {
  try {
    const { hrmEmployeeId: DisciplineId, data } = action;
    const response = yield call(request, `${API_HRM_DISCIPLINE}/${DisciplineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateDisciplineSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateDisciplineFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateDisciplineFailure(err));
  }
}

export function* deleteDiscipline(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_DISCIPLINE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteDisciplineSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteDisciplineFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteDisciplineFailure(err));
  }
}

export default function* DisciplinePageSaga() {
  yield takeLatest(CREATE_DISCIPLINE, createDiscipline);
  yield takeLatest(UPDATE_DISCIPLINE, updateDiscipline);
  yield takeLatest(DELETE_DISCIPLINE, deleteDiscipline);
}
