import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  fetchPropertiesSetSuccess,
  fetchPropertiesSetFailed,
  fetchPropertiesGroupSuccess,
  fetchPropertiesGroupFailed,
  fetchPropertiesSuccess,
  fetchPropertiesFailed,
  deletePropertieSuccess,
  deletePropertieFailed,
  deletePropertiesGroupSuccess,
  deletePropertiesGroupFailed,
  deletePropertiesSetSuccess,
  deletePropertiesSetFailed,
} from './actions';
import { FETCH_PROPERTIES_SET, DELETE_PROPERTIE, DELETE_PROPERTIES_GROUP, DELETE_PROPERTIES_SET } from './constants';
import { GET_PROP_SET, GET_PROP_GROUP, GET_PROP_LIST } from '../../config/urlConfig';
import { makeSelectListProperties, makeSelectPropertiesGroup, makeSelectPropertiesSet } from './selectors';

export function* fetchPropertiesSet() {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {},
    });
    if (data.status === 'success') {
      yield put(fetchPropertiesSetSuccess(data.data));
    } else {
      yield put(fetchPropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(fetchPropertiesSetFailed(err));
  }
}

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

export function* deleteProperties(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${GET_PROP_LIST}/${action.body}`, {
      method: 'DELETE',
      headers: {
        // 'Content-Type': 'application/json',
      },
      // body: JSON.stringify(bodySend),
    });
    if (data.status === 'success') {
      const oldList = yield select(makeSelectListProperties());
      const index = oldList.findIndex(item => {
        if (item.id === action.body) return true;
        return false;
      });
      oldList.splice(index, 1);
      // console.log(oldList, index);
      yield put(deletePropertieSuccess(oldList));
    } else {
      yield put(deletePropertieFailed({}));
    }
  } catch (err) {
    yield put(deletePropertieFailed(err));
  }
}

export function* deletePropertiesGroup(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${GET_PROP_GROUP}/${action.body.id}`, {
      method: 'DELETE',
      headers: {
        // 'Content-Type': 'application/json',
      },
      // body: JSON.stringify(bodySend),
    });
    if (data.status === 'success') {
      const oldList = yield select(makeSelectPropertiesGroup());
      const index = oldList.findIndex(item => {
        if (item.id === action.body.id) return true;
        return false;
      });
      oldList.splice(index, 1);
      // console.log(oldList, index);
      yield put(deletePropertiesGroupSuccess(oldList));
    } else {
      yield put(deletePropertiesGroupFailed({}));
    }
  } catch (err) {
    yield put(deletePropertiesGroupFailed(err));
  }
}

export function* deletePropertiesSet(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${GET_PROP_SET}/${action.body.id}`, {
      method: 'DELETE',
      headers: {
        // 'Content-Type': 'application/json',
      },
      // body: JSON.stringify(bodySend),
    });
    if (data.status === 'success') {
      const oldList = yield select(makeSelectPropertiesSet());
      const index = oldList.findIndex(item => {
        if (item.id === action.body.id) return true;
        return false;
      });
      oldList.splice(index, 1);
      // console.log(oldList, index);
      yield put(deletePropertiesSetSuccess(oldList));
    } else {
      yield put(deletePropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(deletePropertiesSetFailed(err));
  }
}
// Individual exports for testing
export default function* propertiesPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_PROPERTIES_SET, fetchPropertiesSet);
  yield takeLatest(FETCH_PROPERTIES_SET, fetchPropertiesGroup);
  yield takeLatest(FETCH_PROPERTIES_SET, fetchPropertiesList);
  yield takeEvery(DELETE_PROPERTIE, deleteProperties);
  yield takeEvery(DELETE_PROPERTIES_GROUP, deletePropertiesGroup);
  yield takeEvery(DELETE_PROPERTIES_SET, deletePropertiesSet);
}
