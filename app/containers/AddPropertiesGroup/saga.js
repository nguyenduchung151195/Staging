import { takeLatest, call, put } from 'redux-saga/effects';
import qs from 'qs';
import request from '../../utils/request';
import {
  fetchPropertiesGroupSuccess,
  fetchPropertiesGroupFailed,
  createPropertiesGroupSuccess,
  createPropertiesGroupFailed,
  editPropertiesGroupSuccess,
  editPropertiesGroupFailed,
} from './actions';
import { FETCH_PROPERTIES_GROUP, CRETAE_PROPERTIES_GROUP, EDIT_PROPERTIES_GROUP } from './constants';
import { GET_PROP_GROUP } from '../../config/urlConfig';

export function* fetchPropertiesGroup() {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, GET_PROP_GROUP, {
      method: 'GET',
      headers: {},
    });
    if (data.status === 'success') {
      yield put(fetchPropertiesGroupSuccess(data.data));
    } else {
      yield put(fetchPropertiesGroupFailed({}));
    }
  } catch (err) {
    yield put(fetchPropertiesGroupFailed(err));
  }
}

export function* createPropertiesGroup(action) {
  // console.log(action.body);
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, GET_PROP_GROUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.body),
    });
    if (data.success === true) {
      yield put(createPropertiesGroupSuccess(data.data));
    } else {
      yield put(createPropertiesGroupFailed({}));
    }
  } catch (err) {
    yield put(createPropertiesGroupFailed(err));
  }
}

export function* editPropertiesGroup(action) {
  // console.log(action.body);
  try {
    // const departmentId = action.departmentId;
    const bodySend = {
      name: action.body.name,
      order: action.body.order,
      describe: action.body.describe,
    };
    const data = yield call(request, `${GET_PROP_GROUP}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(bodySend),
    });
    if (data.status === 'success') {
      yield put(editPropertiesGroupSuccess(data.data));
    } else {
      yield put(editPropertiesGroupFailed({}));
    }
  } catch (err) {
    yield put(editPropertiesGroupFailed(err));
  }
}

// Individual exports for testing
export default function* addPropertiesGroupSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_PROPERTIES_GROUP, fetchPropertiesGroup);
  yield takeLatest(CRETAE_PROPERTIES_GROUP, createPropertiesGroup);
  yield takeLatest(EDIT_PROPERTIES_GROUP, editPropertiesGroup);
}
