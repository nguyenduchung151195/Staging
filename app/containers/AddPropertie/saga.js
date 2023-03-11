import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  createPropertieSuccess,
  createPropertieFailed,
  editPropertieSuccess,
  editPropertieFailed,
  fetchPropertiesSuccess,
  fetchPropertiesFailed,
} from './actions';
import { CREATE_PROPERTIE, EDIT_PROPERTIE, FETCH_PROPERTIES } from './constants';
import { GET_PROP_LIST } from '../../config/urlConfig';

export function* createPropertie(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, GET_PROP_LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data.success === true) {
      //   const oldList = yield select(makeSelectListProperties());
      //   oldList.push(data.data);
      yield put(createPropertieSuccess());
    } else {
      yield put(createPropertieFailed({}));
    }
  } catch (err) {
    yield put(createPropertieFailed(err));
  }
}

export function* editPropertie(action) {
  const bodySend = {
    code: action.body.code,
    name: action.body.name,
    order: action.body.order,
    type: action.body.type,
    // type: 'select-multiple',
    describe: action.body.describe,
    options: action.body.options,
    config: action.body.config,
  };
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${GET_PROP_LIST}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    if (data.status === 'success') {
      // const oldList = yield select(makeSelectListProperties());
      // const index = oldList.findIndex(item => {
      //   if (item.id === action.body.id) return true;
      //   return false;
      // });
      // oldList[index] = bodySend;
      // oldList.push(data.data);
      yield put(editPropertieSuccess());
    } else {
      yield put(editPropertieFailed({}));
    }
  } catch (err) {
    yield put(editPropertieFailed(err));
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

// Individual exports for testing
export default function* addPropertieSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CREATE_PROPERTIE, createPropertie);
  yield takeLatest(EDIT_PROPERTIE, editPropertie);
  yield takeLatest(FETCH_PROPERTIES, fetchPropertiesList);
}
