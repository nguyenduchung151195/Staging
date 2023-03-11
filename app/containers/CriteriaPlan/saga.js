import { takeLatest, call, put } from 'redux-saga/effects';
import { API_ORIGANIZATION, API_CRITERIA, API_USERS } from '../../config/urlConfig';
import { mergeData, getData } from './actions';
import { GET_DATA, PUT_CRITERIA } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
// import { serialize } from '../../utils/common';
import request from '../../utils/request';
import { addUserToDepartment } from '../../helper';
// Individual exports for testing

export function* getDataSaga() {
  try {
    const departments = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const kpiPlan = yield call(request, `${API_CRITERIA}/plan`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const newDepartment = addUserToDepartment(departments, users.data);

    const setCriteria = yield call(request, `${API_CRITERIA}/criterionType`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const criterias = yield call(request, API_CRITERIA, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    yield put(mergeData({ departments: newDepartment, setCriteria, criterias: criterias.data, kpiPlan }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* postCriteriaSaga(action) {
  try {
    yield call(request, `${API_CRITERIA}/plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    yield put(getData());
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật liệu thất bại', variant: 'error' }));
  }
}

export default function* criteriaPlanSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(PUT_CRITERIA, postCriteriaSaga);
}
