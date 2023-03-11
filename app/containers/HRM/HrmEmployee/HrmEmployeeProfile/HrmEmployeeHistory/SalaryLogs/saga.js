// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_SALARY } from '../../../../../../config/urlConfig';
import {
  createSalarySuccess,
  createSalaryFailure,
  updateSalarySuccess,
  updateSalaryFailure,
  deleteSalarySuccess,
  deleteSalaryFailure,
} from './actions';
import { CREATE_SALARY, UPDATE_SALARY, DELETE_SALARY } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createSalary(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_SALARY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createSalarySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createSalaryFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createSalaryFailure(err));
  }
}

export function* updateSalary(action) {
  try {
    const { hrmEmployeeId: salaryId, data } = action;
    const response = yield call(request, `${API_HRM_SALARY}/${salaryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateSalarySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateSalaryFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateSalaryFailure(err));
  }
}

export function* deleteSalary(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_SALARY}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteSalarySuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteSalaryFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteSalaryFailure(err));
  }
}

export default function* salaryPageSaga() {
  yield takeLatest(CREATE_SALARY, createSalary);
  yield takeLatest(UPDATE_SALARY, updateSalary);
  yield takeLatest(DELETE_SALARY, deleteSalary);
}
