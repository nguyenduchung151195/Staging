import { takeLatest, call, put } from 'redux-saga/effects';
import { API_ORIGANIZATION, API_USERS } from '../../config/urlConfig';
import { mergeData } from './actions';
import { GET_DATA } from './constants';
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

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const newDepartment = addUserToDepartment(departments, users.data);

    yield put(mergeData({ departments: newDepartment }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* salesEmployeeSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
