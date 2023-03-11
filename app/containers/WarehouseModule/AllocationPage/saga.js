import { takeEvery, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { getAssetSuccess, getAssetFailed, editAllocationSuccess, editAllocationFailed } from './actions';
import { GET_ASSET, EDIT_ALLOCATION } from './constants';
import { API_ASSET, API_ASSET_ALLOCATION } from '../../../config/urlConfig';
import { changeSnackbar } from '../../Dashboard/actions';

export function* getAsset(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ASSET}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAssetSuccess(data));
    } else {
      yield put(getAssetFailed({}));
    }
  } catch (err) {
    console.log(err);
    yield put(getAssetFailed(err));
  }
}

export function* editAllocation(action) {
  const { body } = action;
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ASSET_ALLOCATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (data) {
      yield put(editAllocationSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Thao tác thành công', variant: 'success' }));
    } else {
      yield put(editAllocationFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Thao tác thất bại', variant: 'error' }));
    }
  } catch (err) {
    console.log(err);
    yield put(editAllocationFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thao tác thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* allocationPageSaga() {
  yield takeEvery(EDIT_ALLOCATION, editAllocation);
  yield takeEvery(GET_ASSET, getAsset);
}
