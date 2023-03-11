import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  fetchPropertiesGroupSuccess,
  fetchPropertiesGroupFailed,
  fetchPropertiesSuccess,
  fetchPropertiesFailed,
  createPropertiesSetSuccess,
  createPropertiesSetFailed,
} from './actions';
import { FETCH_PROPERTIES_GROUP, FETCH_PROPERTIES, CREATE_PROPERTIES_SET } from './constants';
import { GET_PROP_GROUP, GET_PROP_LIST, GET_PROP_SET } from '../../config/urlConfig';
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

export function* fetchPropertiesList() {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, GET_PROP_LIST, {
      method: 'GET',
      headers: {},
    });
    if (data.status === 'success') {
      yield put(fetchPropertiesSuccess(data.data));
    } else {
      yield put(fetchPropertiesFailed({}));
    }
  } catch (err) {
    yield put(fetchPropertiesFailed(err));
  }
}

export function* createPropertiesSet(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, GET_PROP_SET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data.success === true) {
      yield put(createPropertiesSetSuccess());
    } else {
      yield put(createPropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(createPropertiesSetFailed(err));
  }
}
// Individual exports for testing
export default function* addPropertiesSetSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_PROPERTIES_GROUP, fetchPropertiesGroup);
  yield takeLatest(FETCH_PROPERTIES, fetchPropertiesList);
  yield takeLatest(CREATE_PROPERTIES_SET, createPropertiesSet);
}
