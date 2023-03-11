import { API_HUMAN_RESOURCE } from 'config/urlConfig';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../utils/request';
import {
  getHumanResourceFailure,
  getHumanResourceSuccess,
  updateHumanresourceFailure,
  updateHumanResourceSuccess,
  addHumanResourceSuccess,
  addHumanresourceFailure,
  getHumanResource,
} from './actions';
import { GET_HUMAN_RESOURCE, UPDATE_HUMAN_RESOURCE, ADD_HUMAN_RESOURCE } from './constants';
import { serialize } from '../../../../utils/common';
import { changeSnackbar } from '../../../Dashboard/actions';

export function* getHumanResourceSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, action.body ? `${action.body}` : `${API_HUMAN_RESOURCE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res && res.status === 1) {
      const { humanResourceSource, data } = res;
      const defaultFields = [{ name: 'name', title: 'Tên phòng ban', checked: true }];
      const fields = Array.isArray(humanResourceSource)
        ? humanResourceSource.map(field => ({ name: field.code, title: field.name, checked: true }))
        : [];
      const newFields = [...defaultFields, ...fields];
      yield put(getHumanResourceSuccess(newFields, data));
    } else {
      yield put(getHumanResourceFailure(res));
    }
  } catch (error) {
    yield put(getHumanResourceFailure(error));
  }
}

export function* addHumanResourceSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_HUMAN_RESOURCE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(addHumanResourceSuccess(res.data));
      yield put(getHumanResource());
    } else {
      yield put(addHumanresourceFailure(res));
    }
  } catch (error) {
    yield put(addHumanresourceFailure(error));
  }
}

export function* updateHumanResourceSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_HUMAN_RESOURCE}/${data && data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(updateHumanResourceSuccess(res.data));
      yield put(getHumanResource());
    } else {
      yield put(updateHumanresourceFailure(res));
    }
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateHumanresourceFailure(error));
  }
}

export default function* humanResourecePageSaga() {
  yield takeLatest(UPDATE_HUMAN_RESOURCE, updateHumanResourceSaga);
  yield takeLatest(ADD_HUMAN_RESOURCE, addHumanResourceSaga);
  yield takeLatest(GET_HUMAN_RESOURCE, getHumanResourceSaga);
}
