import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  fetchPropertiesGroupSuccess,
  fetchPropertiesGroupFailed,
  fetchPropertiesSuccess,
  fetchPropertiesFailed,
  editPropertiesSetSuccess,
  editPropertiesSetFailed,
  getPropertiesSetSuccess,
  getPropertiesSetFailed,
} from './actions';
import { FETCH_PROPERTIES_GROUP, FETCH_PROPERTIES, EDIT_PROPERTIES_SET, GET_PROPERTIES_SET } from './constants';
import { GET_PROP_GROUP, GET_PROP_LIST, GET_PROP_SET } from '../../config/urlConfig';
// Individual exports for testing

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

export function* getPropertiesSet(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${GET_PROP_SET}/${action.body}`, {
      method: 'GET',
      headers: {},
    });
    if (data.status === 'success') {
      yield put(getPropertiesSetSuccess(data.data));
    } else {
      yield put(getPropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(getPropertiesSetFailed(err));
  }
}

export function* editPropertiesSet(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${GET_PROP_SET}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body.body),
    });
    if (data.status === 'success') {
      yield put(editPropertiesSetSuccess());
    } else {
      yield put(editPropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(editPropertiesSetFailed(err));
  }
}

export default function* editPropertiesSetSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_PROPERTIES_GROUP, fetchPropertiesGroup);
  yield takeLatest(GET_PROPERTIES_SET, getPropertiesSet);
  yield takeLatest(FETCH_PROPERTIES, fetchPropertiesList);
  yield takeLatest(EDIT_PROPERTIES_SET, editPropertiesSet);
}
