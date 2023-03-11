import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_ROLE_GROUP, DELETE_ROLE_GROUP } from './constants';
import { API_ROLE_GROUP } from '../../config/urlConfig';
import request from '../../utils/request';
import { getRoleGroupSuccessAction, getRoleGroupError, deleteRoleGroupSuccess, getRoleGroupAction, deleteRoleGroupFailed } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { clientId } from '../../variable';

export function* getRoleGroupSaga(action) {
  console.log(action, 'sss')
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP}?clientId=${clientId}${action && action.body && action.body.selector ? `&selector=${action && action.body && action.body.selector}` : ""}&sort=-updatedAt`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (data) {
      yield put(getRoleGroupSuccessAction(data.data));
    } else {
      yield put(getRoleGroupError({}));
    }
  } catch (err) {
    console.log(err, "err")
    yield put(getRoleGroupError(err));
  }
}

export function* deleteRoleGroupSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (data) {
      yield put(deleteRoleGroupSuccess(data.data));
      yield put(getRoleGroupAction());
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
    } else {
      yield put(deleteRoleGroupFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(deleteRoleGroupFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export default function* roleGroupPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ROLE_GROUP, getRoleGroupSaga);
  yield takeEvery(DELETE_ROLE_GROUP, deleteRoleGroupSaga);
}
