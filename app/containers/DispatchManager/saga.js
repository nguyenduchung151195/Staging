import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_DISPATCH } from '../../config/urlConfig';
import { GET_ALL_DISPATCH, DELETE_DISPATCHS_SUCCESS, DELETE_DISPATCHS, UPDATE_DISPATCH_SUCCESS, UPDATE_DISPATCH } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getAllDispatchSuccess,
  getAllDispatchFailed,
  deleteDispatchSuccessAct,
  updateDispatchSuccessAction,
  updateDispatchFailAction,
} from './actions';
import { CREATE_DOCUMENT_SUCCESS } from '../AddDispatchManagerPage/constants';
import { serialize } from '../../helper';
let lastQuery = {};

export function* getAllDispatch(action) {
  // console.log(action);
  const token = localStorage.getItem('token');
  let url = '';
  lastQuery = { ...lastQuery, ...action.query };

  url = `${API_DISPATCH}?${serialize(lastQuery)}`;

  try {
    const data = yield call(request, url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllDispatchSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
      // yield put(getAllDispatchSuccess(data));
    } else {
      yield put(getAllDispatchFailed({}));
    }
  } catch (err) {
    yield put(getAllDispatchFailed(err));
  }
}
export function* fetchDeleteDispatch(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedBos = yield call(request, `${API_DISPATCH}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.data }),
    });

    if (deletedBos) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteDispatchSuccessAct());
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export function* fetchUpdateDispatch(action) {
  // console.log(action);
  const token = localStorage.getItem('token');

  // if (action.query) {
  //   url = `${API_DISPATCH}?${serialize(lastQuery)}`;
  // } else {
  //   url = `${API_DISPATCH}`;
  // }
  const url = `${API_DISPATCH}/${action.dispatch._id}`;

  try {
    const data = yield call(request, url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.dispatch),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateDispatchSuccessAction());
      // yield put(getAllDispatchSuccess(data));
    } else {
      yield put(updateDispatchFailAction());
    }
  } catch (err) {
    yield put(updateDispatchFailAction());
  }
}
// Individual exports for testing
export default function* dispatchManagerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_DISPATCH, getAllDispatch);
  yield takeEvery(CREATE_DOCUMENT_SUCCESS, getAllDispatch);
  yield takeEvery(DELETE_DISPATCHS_SUCCESS, getAllDispatch);
  yield takeEvery(DELETE_DISPATCHS, fetchDeleteDispatch);
  yield takeEvery(UPDATE_DISPATCH_SUCCESS, getAllDispatch);
  yield takeEvery(UPDATE_DISPATCH, fetchUpdateDispatch);
}
