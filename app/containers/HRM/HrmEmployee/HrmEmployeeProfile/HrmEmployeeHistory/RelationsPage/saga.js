// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HRM_RELATION } from '../../../../../../config/urlConfig';
import {
  createRelationSuccess,
  createRelationFailure,
  updateRelationSuccess,
  updateRelationFailure,
  deleteRelationSuccess,
  deleteRelationFailure,
} from './actions';
import { CREATE_RELATION, UPDATE_RELATION, DELETE_RELATION } from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';

export function* createRelation(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_RELATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createRelationSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createRelationFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createRelationFailure(err));
  }
}

export function* updateRelation(action) {
  try {
    const { hrmEmployeeId: RelationId, data } = action;
    const response = yield call(request, `${API_HRM_RELATION}/${RelationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateRelationSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRelationFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRelationFailure(err));
  }
}

export function* deleteRelation(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_RELATION}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteRelationSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteRelationFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteRelationFailure(err));
  }
}

export default function* RelationPageSaga() {
  yield takeLatest(CREATE_RELATION, createRelation);
  yield takeLatest(UPDATE_RELATION, updateRelation);
  yield takeLatest(DELETE_RELATION, deleteRelation);
}
