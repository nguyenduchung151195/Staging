// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_SALARY } from '../../../../../../config/urlConfig';
import { createSalarySuccess, createSalaryFailure, updateSalarySuccess, updateSalaryFailure } from './actions';
import { CREATE_SALARY, UPDATE_SALARY, DELETE_SALARY } from './constants';

export function* createSalary(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_SALARY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        body: JSON.stringify(data),
      },
    });
    yield put(createSalarySuccess(response));
  } catch (err) {
    yield put(createSalaryFailure(err));
  }
}

export function* updateSalary(action) {
  const token = localStorage.getItem('token');
  try {
    const { hrmEmployeeId, data } = action;
    const response = yield call(request, `${API_HRM_SALARY}/${hrmEmployeeId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        body: JSON.stringify(data),
      },
    });
    yield put(updateSalarySuccess(response));
  } catch (err) {
    yield put(updateSalaryFailure(err));
  }
}

export function* deleteSalary() {
  const token = localStorage.getItem('token');
  try {
    const { hrmEmployeeId } = action;
    const response = yield call(request, `${API_HRM_SALARY}/${hrmEmployeeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(deleteSalarySuccess(response));
  } catch (err) {
    yield put(deleteSalaryFailure(err));
  }
}

export default function* salaryPageSaga() {
  yield takeLatest(CREATE_SALARY, createSalary);
  yield takeLatest(UPDATE_SALARY, updateSalary);
  yield takeLatest(DELETE_SALARY, deleteSalary);
}
