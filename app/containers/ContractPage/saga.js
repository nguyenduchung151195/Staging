import { call, put, takeLatest } from 'redux-saga/effects';
import {
  getContractSuccess,
  getContractFalse,
  deleteContractSuccess,
  deleteContractFailed,
  UpdateStatusFailed,
  UpdateStatusSuccess,
} from './actions';
import { GET_CONTRACT_BY_TYPE, GET_CONTRACT } from '../../config/urlConfig';
import request from '../../utils/request';
import { GET_CONTRACT_ACT, DELETE_CONTRACT, UPDATE_STATUS } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
export function* fetchGetContracts(action) {
  try {
    const { query } = action;
    let URL = '';
    if (query) {
      URL = `${GET_CONTRACT_BY_TYPE}?${query}`;
    } else {
      URL = GET_CONTRACT_BY_TYPE;
    }
    const data = yield call(request, URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getContractSuccess(data));
  } catch (err) {
    yield put(getContractFalse(err));
  }
}
export function* fetchDeleteContracts(action) {
  try {
    const data = yield call(request, GET_CONTRACT, {
      method: 'DELETE',
      body: JSON.stringify({ ids: action.body.ids }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (data.success) {
      yield put(deleteContractSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Xóa hợp đồng thành công', variant: 'success' }));

      let URL = '';
      if (action.body.query) {
        URL = `${GET_CONTRACT_BY_TYPE}?${action.body.query}`;
      } else {
        URL = GET_CONTRACT_BY_TYPE;
      }
      const data = yield call(request, URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      yield put(getContractSuccess(data));
    }
  } catch (err) {
    yield put(deleteContractFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa hợp đồng thất bại', variant: 'error' }));
  }
}

export function* updateStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${GET_CONTRACT}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (!data || data.status === 0) {
      yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
      yield put(UpdateStatusFailed());  
    } else {
      yield put(UpdateStatusSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(UpdateStatusFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* contractSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONTRACT_ACT, fetchGetContracts);
  yield takeLatest(DELETE_CONTRACT, fetchDeleteContracts);
  yield takeLatest(UPDATE_STATUS, updateStatus);
}
