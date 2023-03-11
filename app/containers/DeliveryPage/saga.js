import { call, put, takeEvery } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_TASK_PROJECT, GET_CONTRACT, API_DELIVERY } from '../../config/urlConfig';
import {
  getTaskSuccess,
  getTaskFailed,
  getContractSuccess,
  getContractFailed,
  getItemDeliverySuccess,
  getItemDeliveryFailed,
  updateItemDeliverySuccess,
  updateItemDeliveryFailed,
} from './actions';
import { GET_TASK, GET_CONTRACT_AC, GET_ITEM_DELIVERY, UPDATE_DELIVERY } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

export function* getTask() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_TASK_PROJECT}?filter%5BisProject%5D=true&skip=0&limit=10`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getTaskSuccess(data.data));
    } else {
      yield put(getTaskFailed({}));
    }
  } catch (err) {
    yield put(getTaskFailed(err));
  }
}

export function* getContact(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${GET_CONTRACT}?filter%5Btask.taskId%5D=${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getContractSuccess(data.data));
    } else {
      yield put(getContractFailed({}));
    }
  } catch (err) {
    yield put(getContractFailed(err));
  }
}

export function* getDelivery(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_DELIVERY}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getItemDeliverySuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getItemDeliveryFailed({}));
    }
  } catch (err) {
    yield put(getItemDeliveryFailed(err));
  }
}

export function* updateDelivery(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_DELIVERY}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (!data || data.status === 0) {
      yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
      yield put(updateItemDeliveryFailed());
    } else {
      yield put(updateItemDeliverySuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(updateItemDeliveryFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* deliveryPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_TASK, getTask);
  yield takeEvery(GET_CONTRACT_AC, getContact);
  yield takeEvery(GET_ITEM_DELIVERY, getDelivery);
  yield takeEvery(UPDATE_DELIVERY, updateDelivery);
}
