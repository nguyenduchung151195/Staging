import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { API_ROLE_GROUP } from '../../../../../config/urlConfig';
import request from '../../../../../utils/request';
import { getRoleGroupFailure, getRoleGroupSuccess } from './actions';
import { GET_ROLE_GROUP } from './constants';
import { clientId } from 'variable';

export function* getRoleGroupSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_ROLE_GROUP}?clientId=${clientId}`, {
      headers: {
        Authorazation: `Beare ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (res) {
      yield put(getRoleGroupSuccess(res.data));
    } else {
      yield put(getRoleGroupFailure(res));
    }
  } catch (error) {
    yield put(getRoleGroupFailure(error));
  }
}

export default function* mainInforPageSaga() {
  yield takeLatest(GET_ROLE_GROUP, getRoleGroupSaga);
}
